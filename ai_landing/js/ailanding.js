// 1. 매일 밤 10시 카운트다운 타이머 로직
function updateTimer() {
  const now = new Date();
  let targetTime = new Date();

  targetTime.setHours(22, 0, 0, 0);

  if (now > targetTime) {
    targetTime.setDate(targetTime.getDate() + 1);
  }

  const diff = targetTime - now;

  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const hStr = String(hours).padStart(2, "0");
  const mStr = String(minutes).padStart(2, "0");
  const sStr = String(seconds).padStart(2, "0");

  document.getElementById("hour1").innerText = hStr[0];
  document.getElementById("hour2").innerText = hStr[1];
  document.getElementById("min1").innerText = mStr[0];
  document.getElementById("min2").innerText = mStr[1];
  document.getElementById("sec1").innerText = sStr[0];
  document.getElementById("sec2").innerText = sStr[1];
}

setInterval(updateTimer, 1000);
updateTimer();

// 2. 구글 시트 데이터(남은 수량) 읽기 전용 함수
async function fetchLiveStockData() {
  // [주의] 여기에 앱스 스크립트 ID가 아닌, 읽어올 스프레드시트의 문서 고유 ID를 넣어야 합니다.
  // 예: '1BxiMVs0Xrx5qO11p_o_X0s93Z78y'
  const sheetDocumentId = "";
  const sheetName = "sheet1";

  if (!sheetDocumentId) return;

  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetDocumentId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

  try {
    const response = await fetch(csvUrl);
    let data = await response.text();

    data = data.replace(/"/g, "");

    const rows = data.split("\n");
    rows.forEach((row) => {
      const columns = row.split(",");
      if (columns.length >= 2) {
        const itemId = columns[0].trim();
        const stockCount = columns[1].trim();

        const stockElement = document.querySelector(`[data-id="${itemId}"]`);
        if (stockElement) {
          stockElement.innerText = stockCount;
          if (parseInt(stockCount) === 0) {
            const radioInput = stockElement
              .closest("label")
              .querySelector('input[type="radio"]');
            if (radioInput) radioInput.disabled = true;
          }
        }
      }
    });
  } catch (error) {
    console.error("Data fetch error", error);
  }
}

window.onload = fetchLiveStockData;

// 3. 모달 제어 로직 (이벤트 응모)
function openModal() {
  const selectedProduct = document.querySelector(
    'input[name="product"]:checked',
  );
  if (selectedProduct && selectedProduct.disabled) {
    return;
  }

  const modal = document.getElementById("applyModal");
  const formSection = document.getElementById("modalFormSection");
  const messageSection = document.getElementById("modalMessageSection");
  const errorMsg = document.getElementById("modalError");

  // 선택한 상품 이름 가져오기
  let productName = "";
  if (selectedProduct) {
    const cardContent = selectedProduct.nextElementSibling;
    const productTitle = cardContent.querySelector("h3");
    if (productTitle) {
      productName = productTitle.innerText;
    }
  }

  // 초기화
  document.getElementById("name").value = "";
  document.getElementById("tel").value = "";
  document.getElementById("email").value = "";
  document.getElementById("choice").value = productName; // 상품명 자동 입력 (Readonly)

  errorMsg.classList.add("hidden");
  formSection.classList.remove("hidden");
  messageSection.classList.add("hidden");
  document.getElementById("submitBtn").disabled = false;
  document.getElementById("submitBtn").innerText = "응모 완료";

  modal.classList.remove("hidden");
}

function closeModal() {
  const modal = document.getElementById("applyModal");
  modal.classList.add("hidden");
}

// 4. 구글 앱스 스크립트로 폼 데이터 전송 (POST)
function submitApplication() {
  const nameVal = document.getElementById("name").value.trim();
  const telVal = document.getElementById("tel").value.trim();
  const emailVal = document.getElementById("email").value.trim();
  const choiceVal = document.getElementById("choice").value.trim();
  const errorMsg = document.getElementById("modalError");

  // 필수값 검증
  if (!nameVal || !telVal || !emailVal || !choiceVal) {
    errorMsg.innerText = "이름, 연락처, 이메일, 선택상품을 모두 확인해주세요.";
    errorMsg.classList.remove("hidden");
    return;
  }

  // 전송 중 상태 표시
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.innerText = "전송 중...";
  submitBtn.disabled = true;

  // 제공해주신 구글 앱스 스크립트 웹앱 URL 연결
  const scriptUrl =
    "https://script.google.com/macros/s/AKfycby1sw2VrOt8nQ1jmrCTUtVCgv3erJ34yoVsd3-EoYlFG4Bwn4nELmn-iOWVSqwMN7Q/exec";

  // 전송할 폼 데이터 생성 (요청한 필드명 name, tel, email, choice 및 sheet 이름 포함)
  const formData = new FormData();
  formData.append("name", nameVal);
  formData.append("tel", telVal);
  formData.append("email", emailVal);
  formData.append("choice", choiceVal);
  formData.append("sheetName", "sheet1");

  // Fetch API를 통한 데이터 전송 (CORS 정책 회피를 위해 mode: 'no-cors' 사용)
  fetch(scriptUrl, {
    method: "POST",
    mode: "no-cors",
    body: formData,
  })
    .then(() => {
      // 전송 완료 시 UI 전환
      document.getElementById("modalFormSection").classList.add("hidden");
      document.getElementById("modalMessageSection").classList.remove("hidden");
    })
    .catch((error) => {
      console.error("Submit error:", error);
      errorMsg.innerText = "통신 중 오류가 발생했습니다. 다시 시도해 주세요.";
      errorMsg.classList.remove("hidden");
      submitBtn.innerText = "응모 완료";
      submitBtn.disabled = false;
    });
}
