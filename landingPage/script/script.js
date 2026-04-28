(() => {
  "use strict";

  const SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwOtaOE32xgC0fUfyg4opOFSXjqh-V05FGSqayYJmctHZeZzkuwDYrzS7dfc6L90WEozw/exec";
  const API_URL = /^https?:\/\//.test(SHEETS_WEB_APP_URL.trim()) ? SHEETS_WEB_APP_URL.trim() : "";
  const REQUEST_TIMEOUT_MS = 5000;

  const FALLBACK_DATA = {
    programs: [
      {
        id: "FACE",
        title: "퍼스널 컬러 진단 모델",
        description: "4계절 톤 분석, 드레이핑, 메이크업 컬러 매칭 콘텐츠에 참여합니다.",
        duration: "90분",
        date: "상시 협의",
        location: "서울 강남",
        slots: 5,
      },
      {
        id: "STYLE",
        title: "스타일링 콘텐츠 모델",
        description: "진단 결과에 맞춘 의상 컬러와 스타일링 변화를 촬영합니다.",
        duration: "120분",
        date: "개별 연락",
        location: "서울 강남",
        slots: 3,
      },
      {
        id: "BEAUTY",
        title: "뷰티 리뷰 모델",
        description: "메이크업 전후, 립·블러셔 추천 콘텐츠 제작에 참여합니다.",
        duration: "60분",
        date: "매주 토요일",
        location: "서울 강남",
        slots: 4,
      },
      {
        id: "PHOTO",
        title: "프로필 촬영 모델",
        description: "브랜드 홍보용 이미지와 후기 콘텐츠 촬영을 함께 진행합니다.",
        duration: "90분",
        date: "일정 조율",
        location: "서울 강남",
        slots: 2,
      },
    ],
    reviews: [
      {
        name: "김*연",
        rating: 5,
        content: "사진 가이드가 명확해서 지원이 쉬웠고, 상담도 부담 없이 진행됐어요.",
        date: "2025-01-10",
      },
      {
        name: "박*아",
        rating: 5,
        content: "내 톤에 맞는 컬러를 직접 확인하니 촬영 준비가 훨씬 편해졌습니다.",
        date: "2025-01-12",
      },
      {
        name: "이*민",
        rating: 4,
        content: "신청 후 안내가 빨랐고 촬영 콘셉트도 사전에 자세히 설명해 주셨어요.",
        date: "2025-01-18",
      },
    ],
    faq: [
      {
        question: "지원 후 연락은 언제 오나요?",
        answer: "신청 내용 확인 후 순차적으로 개별 연락드립니다. 지원량에 따라 일정은 달라질 수 있습니다.",
        order: 1,
      },
      {
        question: "사진은 꼭 여러 장 첨부해야 하나요?",
        answer: "정면, 45도, 측면, 셀카가 있으면 선정 검토가 더 정확합니다. 가능한 밝고 보정이 적은 사진을 권장합니다.",
        order: 2,
      },
      {
        question: "촬영 이미지 사용 범위는 어떻게 되나요?",
        answer: "최종 선정 후 사용 범위와 기간을 별도 안내하고 동의 절차를 진행합니다.",
        order: 3,
      },
      {
        question: "남성도 지원 가능한가요?",
        answer: "성인 남녀 모두 지원 가능합니다. 모집 분야와 일정에 따라 개별 안내드립니다.",
        order: 4,
      },
    ],
  };

  const state = {
    programs: [],
    activeProgram: "",
  };

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  const elements = {
    header: $("#siteHeader"),
    progressBar: $("#scrollProgressBar"),
    topButton: $("#topButton"),
    programList: $("#programList"),
    reviewList: $("#reviewList"),
    faqList: $("#faqList"),
    modal: $("#applicationModal"),
    formState: $("#formState"),
    successState: $("#successState"),
    form: $("#applicationForm"),
    submitButton: $("#submitButton"),
    fields: {
      name: $("#name"),
      tel: $("#tel"),
      age: $("#age"),
      objective: $("#objective"),
      question: $("#question"),
      agreement: $("#agreement"),
    },
    errors: {
      name: $("#nameError"),
      tel: $("#telError"),
      age: $("#ageError"),
      objective: $("#objectiveError"),
      agreement: $("#agreementError"),
    },
  };

  const validators = {
    name(value) {
      const trimmed = value.trim();
      if (!trimmed || /\s/.test(trimmed)) return "이름을 입력해주세요";
      return "";
    },
    tel(value) {
      if (!/^010-\d{4}-\d{4}$/.test(value.trim())) return "올바른 형식으로 입력해주세요";
      return "";
    },
    age(value) {
      const age = Number(value);
      if (!Number.isInteger(age) || age < 19 || age > 60) return "19세 이상 60세 이하만 신청 가능합니다";
      return "";
    },
    objective(value) {
      if (!value) return "지원분야를 선택해주세요";
      return "";
    },
    agreement(checked) {
      if (!checked) return "개인정보 수집 및 이용에 동의해주세요";
      return "";
    },
  };

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function toArrayResponse(payload) {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    return [];
  }

  function requestWithTimeout(factory, timeoutMs) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);
    return factory(controller.signal).finally(() => window.clearTimeout(timer));
  }

  async function fetchSheet(action, fallbackData, attempt = 0) {
    if (!API_URL) return fallbackData;

    try {
      const response = await requestWithTimeout((signal) => {
        const url = new URL(API_URL);
        url.searchParams.set("action", action);
        return fetch(url.toString(), {
          method: "GET",
          cache: "no-store",
          signal,
        });
      }, REQUEST_TIMEOUT_MS);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      if (payload && payload.error) throw new Error(payload.error);
      return toArrayResponse(payload);
    } catch (error) {
      if (attempt < 1) return fetchSheet(action, fallbackData, attempt + 1);
      console.warn(`[Sheets API] ${action} fetch failed`, error);
      return fallbackData;
    }
  }

  function renderPrograms(programs) {
    state.programs = programs;
    elements.programList.replaceChildren();
    elements.fields.objective.querySelectorAll("option:not(:first-child)").forEach((option) => option.remove());

    const tones = ["#f5c7cd", "#40495c", "#d9a86c", "#a9c9e8"];

    programs.forEach((program, index) => {
      const card = createElement("article", "program-card reveal");
      card.style.setProperty("--tone", tones[index % tones.length]);
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `${program.title || "프로그램"} 지원하기`);

      const badge = createElement("span", "program-id", program.id || `MODEL-${index + 1}`);
      const title = createElement("h3", "", program.title || "모집 프로그램");
      const desc = createElement("p", "", program.description || "상세 내용은 개별 안내드립니다.");
      const meta = createElement("div", "program-meta");

      [
        ["진행", program.duration || "협의"],
        ["일정", program.date || "개별 연락"],
        ["장소", program.location || "개별 안내"],
        ["인원", program.slots ? `${program.slots}명` : "상시"],
      ].forEach(([label, value]) => {
        const row = createElement("span");
        row.append(createElement("em", "", label), createElement("strong", "", value));
        meta.append(row);
      });

      card.append(badge, title, desc, meta);
      card.addEventListener("click", () => openModal(program.title));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openModal(program.title);
        }
      });

      elements.programList.append(card);

      const option = createElement("option", "", program.title || `프로그램 ${index + 1}`);
      option.value = program.title || `프로그램 ${index + 1}`;
      elements.fields.objective.append(option);
    });

    observeReveals();
  }

  function renderReviews(reviews) {
    elements.reviewList.replaceChildren();

    reviews.slice(0, 6).forEach((review, index) => {
      const card = createElement("article", "review-card reveal");
      card.classList.add(`reveal-delay-${Math.min(index % 3, 2) + 1}`);
      const stars = Math.max(0, Math.min(5, Number(review.rating || 5)));

      const starNode = createElement("div", "review-stars", "★".repeat(stars) + "☆".repeat(5 - stars));
      const content = createElement("p", "", review.content || "만족스러운 경험이었습니다.");
      const footer = createElement("footer");
      footer.append(createElement("strong", "", review.name || "참여자"), createElement("span", "", review.date || ""));
      card.append(starNode, content, footer);
      elements.reviewList.append(card);
    });

    observeReveals();
  }

  function renderFAQ(faqItems) {
    elements.faqList.replaceChildren();

    faqItems
      .slice()
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
      .forEach((item, index) => {
        const faq = createElement("article", "faq-item reveal");
        if (index > 0) faq.classList.add("reveal-delay-1");

        const question = createElement("button", "faq-question", item.question || "질문");
        question.type = "button";
        question.setAttribute("aria-expanded", "false");

        const answer = createElement("div", "faq-answer");
        answer.append(createElement("p", "", item.answer || "답변은 추후 안내됩니다."));

        question.addEventListener("click", () => toggleFAQ(faq, question, answer));
        faq.append(question, answer);
        elements.faqList.append(faq);
      });

    observeReveals();
  }

  function toggleFAQ(item, button, answer) {
    const isOpen = item.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
    answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : "0px";
  }

  function setupTabs() {
    const tabButtons = $$("[data-tab]");
    const panels = $$("[data-panel]");

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.tab;
        tabButtons.forEach((tab) => {
          const active = tab === button;
          tab.classList.toggle("active", active);
          tab.setAttribute("aria-selected", String(active));
        });
        panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === target));
      });
    });
  }

  function observeReveals() {
    if (!window.IntersectionObserver) {
      $$(".reveal").forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" },
    );

    $$(".reveal:not(.visible)").forEach((el) => observer.observe(el));
  }

  function updateScrollUI() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));

    elements.progressBar.style.width = `${progress}%`;
    elements.header.classList.toggle("scrolled", scrollTop > 20);
    elements.topButton.classList.toggle("visible", scrollTop > 460);
    elements.topButton.style.setProperty("--scroll", `${progress}%`);

    updateActiveNav();
  }

  function updateActiveNav() {
    const sections = ["recruit", "programs", "photoGuide", "reviews", "faq"];
    let current = "";
    for (let index = sections.length - 1; index >= 0; index -= 1) {
      const id = sections[index];
      const section = document.getElementById(id);
      if (section && window.scrollY + 130 >= section.offsetTop) {
        current = id;
        break;
      }
    }

    $$(".header-nav a").forEach((link) => {
      const href = link.getAttribute("href") || "";
      link.classList.toggle("active", Boolean(current && href === `#${current}`));
    });
  }

  function openModal(programName = "") {
    elements.modal.classList.add("open");
    elements.modal.setAttribute("aria-hidden", "false");
    elements.formState.classList.add("active");
    elements.successState.classList.remove("active");
    document.body.classList.add("modal-open");

    if (programName) {
      elements.fields.objective.value = programName;
      state.activeProgram = programName;
      validateField("objective");
    }

    window.setTimeout(() => elements.fields.name.focus(), 80);
  }

  function closeModal() {
    elements.modal.classList.remove("open");
    elements.modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function bindModal() {
    $$('[data-open-modal]').forEach((button) => {
      button.addEventListener("click", () => openModal(state.activeProgram));
    });

    $$('[data-close-modal]').forEach((button) => {
      button.addEventListener("click", closeModal);
    });

    elements.modal.addEventListener("click", (event) => {
      if (event.target === elements.modal) closeModal();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && elements.modal.classList.contains("open")) closeModal();
    });
  }

  function setFieldError(fieldName, message) {
    const field = elements.fields[fieldName];
    const error = elements.errors[fieldName];
    const group = field ? field.closest(".field-group") : null;

    if (error) error.textContent = message;
    if (group) group.classList.toggle("is-invalid", Boolean(message));
  }

  function validateField(fieldName) {
    let message = "";

    if (fieldName === "agreement") {
      message = validators.agreement(elements.fields.agreement.checked);
    } else {
      message = validators[fieldName](elements.fields[fieldName].value);
    }

    setFieldError(fieldName, message);
    return !message;
  }

  function validateForm() {
    return ["name", "tel", "age", "objective", "agreement"].every(validateField);
  }

  function formatPhoneInput(value) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  function bindFormValidation() {
    ["name", "age", "objective"].forEach((fieldName) => {
      elements.fields[fieldName].addEventListener("blur", () => validateField(fieldName));
      elements.fields[fieldName].addEventListener("input", () => {
        if (elements.errors[fieldName].textContent) validateField(fieldName);
      });
    });

    elements.fields.tel.addEventListener("input", (event) => {
      event.target.value = formatPhoneInput(event.target.value);
      if (elements.errors.tel.textContent) validateField("tel");
    });
    elements.fields.tel.addEventListener("blur", () => validateField("tel"));

    elements.fields.agreement.addEventListener("change", () => validateField("agreement"));
  }

  function getToday() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  async function submitApplication(payload) {
    if (!API_URL) {
      throw new Error("SHEETS_WEB_APP_URL is empty. Apps Script 웹앱 URL을 입력해주세요.");
    }

    /**
     * Google Apps Script는 GitHub Pages 같은 외부 도메인에서 일반 fetch 응답을 읽을 수 없습니다.
     * 그래서 hidden iframe + form POST + postMessage 방식으로 저장 결과를 실제로 확인합니다.
     * 이제 Apps Script가 saved:true를 보내야만 신청 완료 화면으로 넘어갑니다.
     */
    return new Promise((resolve, reject) => {
      const iframeName = `sheetsSubmitFrame_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      const iframe = document.createElement("iframe");
      const form = document.createElement("form");
      const timeoutMs = 15000;

      let settled = false;
      let timer = null;

      function cleanup() {
        window.removeEventListener("message", handleMessage);
        if (timer) window.clearTimeout(timer);
        window.setTimeout(() => {
          iframe.remove();
          form.remove();
        }, 0);
      }

      function finish(error, data) {
        if (settled) return;
        settled = true;
        cleanup();
        if (error) reject(error);
        else resolve(data);
      }

      function handleMessage(event) {
        const data = event.data;
        if (!data || typeof data !== "object" || data.source !== "jayjun-sheets") return;

        if (data.ok && data.saved) {
          finish(null, data);
        } else {
          finish(new Error(data.error || "Google Sheets 저장에 실패했습니다."));
        }
      }

      iframe.name = iframeName;
      iframe.title = "Google Sheets submit frame";
      iframe.style.display = "none";

      form.method = "POST";
      form.action = API_URL;
      form.target = iframeName;
      form.style.display = "none";
      form.acceptCharset = "UTF-8";

      const formData = { ...payload, action: "saveApplication" };
      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value == null ? "" : String(value);
        form.append(input);
      });

      window.addEventListener("message", handleMessage);
      document.body.append(iframe, form);

      timer = window.setTimeout(() => {
        finish(new Error("Apps Script 응답이 없습니다. 웹앱 권한이 '모든 사용자'인지, /exec URL인지 확인해주세요."));
      }, timeoutMs);

      form.submit();
    });
  }

  function showSuccess() {
    elements.formState.classList.remove("active");
    elements.successState.classList.add("active");
  }

  function resetForm() {
    elements.form.reset();
    ["name", "tel", "age", "objective", "agreement"].forEach((fieldName) => setFieldError(fieldName, ""));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    const payload = {
      name: elements.fields.name.value.trim(),
      tel: elements.fields.tel.value.trim(),
      age: elements.fields.age.value.trim(),
      objective: elements.fields.objective.value,
      question: elements.fields.question.value.trim(),
      agreement: "동의",
      createdAt: getToday(),
    };

    const originalText = elements.submitButton.textContent;
    elements.submitButton.disabled = true;
    elements.submitButton.textContent = "처리 중...";

    try {
      await submitApplication(payload);
      resetForm();
      showSuccess();
    } catch (error) {
      console.error("Application submit failed", error);
      elements.submitButton.textContent = "저장 실패 · 설정을 확인해 주세요";
      window.setTimeout(() => {
        elements.submitButton.textContent = originalText;
      }, 1600);
    } finally {
      elements.submitButton.disabled = false;
      if (elements.submitButton.textContent === "처리 중...") {
        elements.submitButton.textContent = originalText;
      }
    }
  }

  function bindTopButton() {
    elements.topButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  async function initData() {
    const [programs, reviews, faq] = await Promise.all([
      fetchSheet("getPrograms", FALLBACK_DATA.programs),
      fetchSheet("getReviews", FALLBACK_DATA.reviews),
      fetchSheet("getFAQ", FALLBACK_DATA.faq),
    ]);

    renderPrograms(programs.length ? programs : FALLBACK_DATA.programs);
    renderReviews(reviews.length ? reviews : FALLBACK_DATA.reviews);
    renderFAQ(faq.length ? faq : FALLBACK_DATA.faq);
  }

  function init() {
    setupTabs();
    observeReveals();
    bindModal();
    bindFormValidation();
    bindTopButton();
    elements.form.addEventListener("submit", handleSubmit);
    window.addEventListener("scroll", updateScrollUI, { passive: true });
    window.addEventListener("resize", updateScrollUI);
    updateScrollUI();
    initData();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
