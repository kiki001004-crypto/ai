// 1. 스크롤 애니메이션 (Reveal Effect)
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);

reveals.forEach((el) => observer.observe(el));

// 2. 모달 열기 함수
function openModal() {
  document.getElementById("signupModal").classList.add("open");
  document.getElementById("formState").style.display = "block";
  document.getElementById("successState").style.display = "none";
  document.body.style.overflow = "hidden"; // 배경 스크롤 방지
}

// 3. 모달 닫기 함수
function closeModal(e) {
  if (e.target === document.getElementById("signupModal")) closeModalDirect();
}

function closeModalDirect() {
  document.getElementById("signupModal").classList.remove("open");
  document.body.style.overflow = "";
}

// 4. 구글 폼 제출 처리
function handleFormSubmit(form) {
  const btn = form.querySelector("button");
  btn.innerText = "전송 중...";
  btn.disabled = true;

  // 실제 데이터가 구글 폼으로 전송되는 시간을 고려하여 UI를 1.2초 뒤에 변경
  setTimeout(() => {
    document.getElementById("formState").style.display = "none";
    document.getElementById("successState").style.display = "block";
    btn.disabled = false;
    btn.innerText = "신청 완료하고 가이드 받기";
  }, 1200);
}

// 5. 하단 CTA 버튼 및 모든 '신청하기' 버튼 리스너 연결
document.addEventListener("DOMContentLoaded", () => {
  // CTA 섹션 내의 흰색 버튼
  const ctaBtn = document.querySelector("#cta-section .btn-white");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openModal();
    });
  }
});
