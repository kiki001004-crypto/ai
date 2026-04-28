/**
 * Google Apps Script backend for the Jayjun model application form.
 *
 * 1) Open the Google Sheet below.
 * 2) Extensions > Apps Script.
 * 3) Paste this file into Code.gs.
 * 4) Deploy > New deployment > Web app.
 * 5) Execute as: Me / Who has access: Anyone.
 * 6) Copy the Web app URL and paste it into script/script.js:
 *    const SHEETS_WEB_APP_URL = "...";
 */

const SPREADSHEET_ID = '1_SmdyIw_bqD8KgTjsWr0fCNpUU0ldOsbxvsbeddMvA8';
const APPLICATION_SHEET_NAME = 'sheet1';
const APPLICATION_HEADERS = ['name', 'tel', 'age', 'objective', 'question', 'createdAt'];

function doGet(e) {
  const action = String((e && e.parameter && e.parameter.action) || 'health');

  if (action === 'getPrograms') return jsonResponse(readObjectsFromSheet_('programs'));
  if (action === 'getReviews') return jsonResponse(readObjectsFromSheet_('reviews'));
  if (action === 'getFAQ') return jsonResponse(readObjectsFromSheet_('faq'));

  return jsonResponse({ ok: true, message: 'Jayjun Sheets API is running.' });
}

function doPost(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = String(params.action || 'saveApplication');

    if (action !== 'saveApplication') {
      throw new Error('Unknown action: ' + action);
    }

    const row = {
      name: clean_(params.name),
      tel: clean_(params.tel),
      age: clean_(params.age),
      objective: clean_(params.objective),
      question: clean_(params.question),
      createdAt: clean_(params.createdAt) || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss'),
    };

    validateApplication_(row);

    const sheet = getOrCreateSheet_(APPLICATION_SHEET_NAME);
    ensureHeaders_(sheet, APPLICATION_HEADERS);
    sheet.appendRow(APPLICATION_HEADERS.map((header) => row[header] || ''));

    return jsonResponse({ ok: true, saved: row });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  }
}

function validateApplication_(row) {
  if (!row.name) throw new Error('name is required');
  if (!/^010-\d{4}-\d{4}$/.test(row.tel)) throw new Error('tel is invalid');
  const age = Number(row.age);
  if (!Number.isInteger(age) || age < 19 || age > 60) throw new Error('age is invalid');
  if (!row.objective) throw new Error('objective is required');
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

  const currentHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length)).getValues()[0];
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

function clean_(value) {
  return String(value || '').trim();
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
