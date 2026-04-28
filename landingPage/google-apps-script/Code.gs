/**
 * Google Apps Script backend for the Jayjun model application form.
 *
 * IMPORTANT
 * - Deploy as Web app.
 * - Execute as: Me
 * - Who has access: Anyone
 * - After editing this code, deploy a NEW VERSION. Old /exec deployments do not update automatically.
 */

const SPREADSHEET_ID = '1_SmdyIw_bqD8KgTjsWr0fCNpUU0ldOsbxvsbeddMvA8';
const APPLICATION_SHEET_NAME = 'sheet1';
const DEBUG_SHEET_NAME = '_debug';
const APPLICATION_HEADERS = ['name', 'tel', 'age', 'objective', 'question', 'createdAt'];

function doGet(e) {
  try {
    const params = getRequestParams_(e);
    const action = String(params.action || 'health');

    // 브라우저 주소창에서 직접 저장 테스트할 수 있게 열어둔 액션입니다.
    // 예: WEB_APP_URL?action=testSave
    if (action === 'testSave') {
      const result = saveApplicationData_({
        name: params.name || '테스트',
        tel: params.tel || '010-0000-0000',
        age: params.age || '25',
        objective: params.objective || '연결 테스트',
        question: params.question || 'Apps Script 저장 테스트입니다.',
        createdAt: params.createdAt || getKoreaTimestamp_(),
      }, 'GET_TEST');
      return jsonResponse({ ok: true, ...result });
    }

    if (action === 'saveApplication') {
      const result = saveApplicationData_(params, 'GET');
      return jsonResponse({ ok: true, ...result });
    }

    if (action === 'getPrograms') return jsonResponse({ ok: true, data: readObjectsFromSheet_('programs') });
    if (action === 'getReviews') return jsonResponse({ ok: true, data: readObjectsFromSheet_('reviews') });
    if (action === 'getFAQ') return jsonResponse({ ok: true, data: readObjectsFromSheet_('faq') });

    return jsonResponse({
      ok: true,
      message: 'Jayjun Sheets API is running.',
      sheetName: APPLICATION_SHEET_NAME,
      testUrlHint: '웹앱 URL 뒤에 ?action=testSave 를 붙여 열면 sheet1에 테스트 행이 저장됩니다.',
    });
  } catch (error) {
    const message = getErrorMessage_(error);
    logDebug_('GET_ERROR', { error: message });
    return jsonResponse({ ok: false, error: message });
  }
}

function doPost(e) {
  try {
    const params = getRequestParams_(e);
    const action = String(params.action || 'saveApplication');

    if (action !== 'saveApplication') {
      throw new Error('Unknown action: ' + action);
    }

    const result = saveApplicationData_(params, 'POST');
    return postMessageResponse_({ ok: true, ...result });
  } catch (error) {
    const message = getErrorMessage_(error);
    logDebug_('POST_ERROR', { error: message, raw: getRawPostData_(e) });
    return postMessageResponse_({ ok: false, error: message });
  }
}

function saveApplicationData_(params, method) {
  const row = {
    name: clean_(params.name),
    tel: clean_(params.tel),
    age: clean_(params.age),
    objective: clean_(params.objective),
    question: clean_(params.question),
    createdAt: clean_(params.createdAt) || getKoreaTimestamp_(),
  };

  logDebug_('RECEIVED_' + method, row);
  validateApplication_(row);

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getOrCreateSheet_(APPLICATION_SHEET_NAME);
    ensureHeaders_(sheet, APPLICATION_HEADERS);
    sheet.appendRow(APPLICATION_HEADERS.map((header) => row[header] || ''));
    SpreadsheetApp.flush();

    const savedRowNumber = sheet.getLastRow();
    logDebug_('SAVED_' + method, { rowNumber: savedRowNumber, sheetName: APPLICATION_SHEET_NAME, ...row });

    return {
      saved: true,
      sheetName: APPLICATION_SHEET_NAME,
      rowNumber: savedRowNumber,
    };
  } finally {
    lock.releaseLock();
  }
}

function validateApplication_(row) {
  if (!row.name) throw new Error('name is required');
  if (!row.tel) throw new Error('tel is required');

  const age = Number(row.age);
  if (!Number.isInteger(age) || age < 1 || age > 120) {
    throw new Error('age is invalid');
  }

  if (!row.objective) throw new Error('objective is required');
}

function getRequestParams_(e) {
  const params = {};

  if (e && e.parameter) {
    Object.keys(e.parameter).forEach((key) => {
      params[key] = e.parameter[key];
    });
  }

  const raw = getRawPostData_(e);
  if (!raw) return params;

  // 1) JSON body 지원
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      Object.keys(parsed).forEach((key) => {
        params[key] = parsed[key];
      });
      return params;
    }
  } catch (error) {
    // JSON이 아니면 아래 URL-encoded 파싱을 시도합니다.
  }

  // 2) application/x-www-form-urlencoded body 지원
  raw.split('&').forEach((part) => {
    if (!part) return;
    const pieces = part.split('=');
    const key = decodeURIComponent(String(pieces.shift() || '').replace(/\+/g, ' '));
    const value = decodeURIComponent(String(pieces.join('=') || '').replace(/\+/g, ' '));
    if (key) params[key] = value;
  });

  return params;
}

function getRawPostData_(e) {
  return String((e && e.postData && e.postData.contents) || '');
}

function getSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getOrCreateSheet_(sheetName) {
  const spreadsheet = getSpreadsheet_();
  return spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
}

function ensureHeaders_(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    return;
  }

  const width = Math.max(sheet.getLastColumn(), headers.length);
  const currentHeaders = sheet.getRange(1, 1, 1, width).getValues()[0];
  const isEmptyHeader = currentHeaders.every((value) => String(value || '').trim() === '');

  if (isEmptyHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function readObjectsFromSheet_(sheetName) {
  const sheet = getSpreadsheet_().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];

  const values = sheet.getDataRange().getValues();
  const headers = values.shift().map((header) => String(header).trim());

  return values
    .filter((row) => row.some((cell) => cell !== '' && cell !== null))
    .map((row) => headers.reduce((object, header, index) => {
      object[header] = row[index];
      return object;
    }, {}));
}

function logDebug_(eventName, payload) {
  try {
    const sheet = getOrCreateSheet_(DEBUG_SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['createdAt', 'event', 'payload']);
    }
    sheet.appendRow([getKoreaTimestamp_(), eventName, JSON.stringify(payload || {})]);
  } catch (error) {
    // 디버그 기록 실패가 실제 저장을 막지 않게 조용히 무시합니다.
  }
}

function postMessageResponse_(data) {
  const payload = JSON.stringify({ source: 'jayjun-sheets', ...data })
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  const html = `<!doctype html>
<html><head><meta charset="utf-8"></head><body>
<script>
(function () {
  var data = ${payload};
  try {
    window.top.postMessage(data, '*');
  } catch (error) {
    try { window.parent.postMessage(data, '*'); } catch (ignored) {}
  }
})();
</script>
</body></html>`;

  return HtmlService
    .createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function clean_(value) {
  return String(value || '').trim();
}

function getKoreaTimestamp_() {
  return Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
}

function getErrorMessage_(error) {
  return String((error && error.message) || error || 'Unknown error');
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
