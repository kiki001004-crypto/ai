const apiKey = "";
const heroSection = document.getElementById("hero-section");
const loadingOverlay = document.getElementById("loading-overlay");

// 시안 배경과 유사한 형태를 지시하는 프롬프트
const promptText =
  "A large modern government building with a wide circular plaza in front, surrounded by a vast, bright green grassy lawn in the foreground. Sunny day, realistic, architectural photography.";

// API 호출 지수 백오프 함수
async function fetchWithRetry(url, options, maxRetries = 5) {
  let retries = 0;
  let delay = 1000;
  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return await response.json();
    } catch (error) {
      retries++;
      if (retries >= maxRetries) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

// 백그라운드 이미지 생성 및 적용
async function generateBackgroundImage() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;
  const payload = {
    instances: { prompt: promptText },
    parameters: { sampleCount: 1 },
  };

  try {
    const result = await fetchWithRetry(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (result.predictions && result.predictions.length > 0) {
      const imageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
      // API 결과 이미지를 영문/그라데이션과 함께 배경으로 대체 적용
      heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)), url('${imageUrl}')`;
    }
  } catch (error) {
    console.error("이미지 생성 실패:", error);
    if (loadingOverlay) {
      loadingOverlay.innerHTML = "이미지 생성 실패 (기존 임시 배경 유지)";
      setTimeout(() => {
        loadingOverlay.style.display = "none";
      }, 3000);
    }
    return;
  }

  if (loadingOverlay) loadingOverlay.style.display = "none";
}

// DOM 로드 후 이미지 생성 실행
window.addEventListener("DOMContentLoaded", generateBackgroundImage);
