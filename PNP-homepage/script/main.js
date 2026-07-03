/* ==============================
  main.js
  공통 인터랙션
============================== */

window.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const closeBtn = document.querySelector(".gnb-close");
  const dim = document.querySelector(".gnb-dim");
  const gnbLinks = document.querySelectorAll(".gnb-link");
  const gnbItems = document.querySelectorAll(".gnb-item");
  const depthLinks = document.querySelectorAll(".gnb-depth-link");
  const topBtn = document.querySelector(".top-btn");

  const mobileWidth = 900;

  function isMobile() {
    return window.innerWidth <= mobileWidth;
  }

  function openMenu() {
    if (!header || !menuBtn) return;
    header.classList.add("is-menu-open");
    body.classList.add("is-lock");
    menuBtn.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    if (!header || !menuBtn) return;
    header.classList.remove("is-menu-open");
    body.classList.remove("is-lock");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  function toggleMobileDepth(item) {
    const isOpen = item.classList.contains("is-open");
    const siblings = item.parentElement.querySelectorAll(".gnb-item.is-open");

    siblings.forEach(function (sibling) {
      if (sibling !== item) sibling.classList.remove("is-open");
    });

    item.classList.toggle("is-open", !isOpen);
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", openMenu);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
  }

  if (dim) {
    dim.addEventListener("click", closeMenu);
  }

  gnbLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const item = link.closest(".gnb-item");
      const hasDepth = item && item.classList.contains("has-depth");

      if (isMobile() && hasDepth) {
        event.preventDefault();
        toggleMobileDepth(item);
        return;
      }

      if (!isMobile() && hasDepth) {
        if (link.getAttribute("href") === "#") {
          event.preventDefault();
       }

       link.blur();
      }
    });
  });

  gnbItems.forEach(function (item) {
  item.addEventListener("mouseenter", function () {
    if (isMobile()) return;

    const focusedElement = document.activeElement;

    if (
      focusedElement &&
      focusedElement.closest(".gnb-item") &&
      focusedElement.closest(".gnb-item") !== item
    ) {
      focusedElement.blur();
    }
  });
});

  depthLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (isMobile()) {
        closeMenu();
        return;
      }

     link.blur();
   });
  });

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", function () {
    if (!isMobile()) closeMenu();
  });

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }

  function updateTopButton() {
    if (!topBtn) return;
    topBtn.classList.toggle("is-show", window.scrollY > 300);
  }

  window.addEventListener("scroll", function () {
    updateHeader();
    updateTopButton();
  });

  if (topBtn) {
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ==============================
  Mobile Footer Accordion
============================== */

const footerMobileToggles = document.querySelectorAll(".footer-mobile-toggle");

footerMobileToggles.forEach(function (toggle) {
  toggle.addEventListener("click", function () {
    if (!isMobile()) return;

    const currentMenu = toggle.closest(".footer-mobile-menu");
    const openMenus = document.querySelectorAll(".footer-mobile-menu.is-open");

    openMenus.forEach(function (menu) {
      if (menu !== currentMenu) {
        menu.classList.remove("is-open");
      }
    });

    currentMenu.classList.toggle("is-open");
  });
});

window.addEventListener("resize", function () {
  if (!isMobile()) {
    document.querySelectorAll(".footer-mobile-menu.is-open").forEach(function (menu) {
      menu.classList.remove("is-open");
    });
  }
});


 /* ==============================
    Sub Page LNB
  ============================== */

  const subLnb = document.querySelector(".sub-lnb");
  const subLnbToggle = document.querySelector(".sub-lnb-current");

  if (subLnb && subLnbToggle) {
    subLnbToggle.addEventListener("click", function () {
      if (!isMobile()) return;

      const isOpen = subLnb.classList.toggle("is-open");
      subLnbToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    subLnb.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (!isMobile()) return;

        subLnb.classList.remove("is-open");
        subLnbToggle.setAttribute("aria-expanded", "false");
      });
    });

    window.addEventListener("resize", function () {
      if (!isMobile()) {
        subLnb.classList.remove("is-open");
        subLnbToggle.setAttribute("aria-expanded", "false");
      }
    });
  }




/* ==============================
    Main Visual Slider
  ============================== */

  const mainVisual = document.querySelector(".main-visual-slider");

  if (mainVisual) {
    const visualTrack = mainVisual.querySelector(".main-visual-track");
    let visualSlides = mainVisual.querySelectorAll(".main-visual-slide");
    const visualDots = mainVisual.querySelectorAll(".main-visual-dots button");
    const visualPrev = mainVisual.querySelector(".main-visual-prev");
    const visualNext = mainVisual.querySelector(".main-visual-next");

    let visualIndex = 0;
    let visualTimer = null;
    let isMoving = false;

    // 첫 번째 슬라이드를 복제해서 마지막에 추가
    if (visualTrack && visualSlides.length > 0) {
      const firstClone = visualSlides[0].cloneNode(true);
      firstClone.classList.add("is-clone");
      firstClone.setAttribute("aria-hidden", "true");
      visualTrack.appendChild(firstClone);
      visualSlides = mainVisual.querySelectorAll(".main-visual-slide");
    }

    function moveVisualSlide(index, useTransition) {
      if (!visualTrack) return;

      visualTrack.style.transition = useTransition
        ? "transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)"
        : "none";

      visualTrack.style.transform = "translateX(" + index * -100 + "%)";
    }

    function updateVisualDots() {
      const realIndex = visualIndex % visualDots.length;

      visualDots.forEach(function (dot, dotIndex) {
        const isActive = dotIndex === realIndex;

        dot.classList.toggle("is-active", isActive);

        if (isActive) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
    }

    function updateVisualAria() {
      const realIndex = visualIndex % visualDots.length;

      visualSlides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === visualIndex);
        slide.setAttribute("aria-hidden", slideIndex === realIndex ? "false" : "true");
      });
    }

    function showVisualSlide(index) {
      if (isMoving) return;

      isMoving = true;
      visualIndex = index;

      moveVisualSlide(visualIndex, true);
      updateVisualDots();
      updateVisualAria();
    }

    function nextVisualSlide() {
      showVisualSlide(visualIndex + 1);
    }

    function prevVisualSlide() {
      if (isMoving) return;

      // 1번에서 이전을 누르면, 먼저 복제 전 마지막 슬라이드 위치로 순간 이동
      if (visualIndex === 0) {
        visualIndex = visualDots.length;
        moveVisualSlide(visualIndex, false);

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            showVisualSlide(visualDots.length - 1);
          });
        });
      } else {
        showVisualSlide(visualIndex - 1);
      }
    }

    if (visualTrack) {
      visualTrack.addEventListener("transitionend", function () {
        // 복제된 1번 슬라이드에 도착하면 진짜 1번으로 순간 이동
        if (visualIndex === visualDots.length) {
          visualIndex = 0;
          moveVisualSlide(visualIndex, false);
        }

        updateVisualDots();
        updateVisualAria();
        isMoving = false;
      });
    }

    function startVisualAuto() {
      stopVisualAuto();
      visualTimer = window.setInterval(nextVisualSlide, 5000);
    }

    function stopVisualAuto() {
      if (visualTimer) {
        window.clearInterval(visualTimer);
        visualTimer = null;
      }
    }

    if (visualPrev) {
      visualPrev.addEventListener("click", function () {
        prevVisualSlide();
        startVisualAuto();
      });
    }

    if (visualNext) {
      visualNext.addEventListener("click", function () {
        nextVisualSlide();
        startVisualAuto();
      });
    }

    visualDots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        if (isMoving) return;

        visualIndex = dotIndex;
        moveVisualSlide(visualIndex, true);
        updateVisualDots();
        updateVisualAria();
        startVisualAuto();
      });
    });

    mainVisual.addEventListener("mouseenter", stopVisualAuto);
    mainVisual.addEventListener("mouseleave", startVisualAuto);

    moveVisualSlide(0, false);
    updateVisualDots();
    updateVisualAria();
    startVisualAuto();
  }

  updateHeader();
  updateTopButton();

    /* 오시는 길 - Kakao Map */
  const locationMapEl = document.getElementById("locationKakaoMap");

  if (locationMapEl) {
    const appKey = locationMapEl.dataset.kakaoAppKey;
    const address = locationMapEl.dataset.address;
    const placeName = locationMapEl.dataset.placeName || "㈜피앤피컨설팅";
    const level = Number(locationMapEl.dataset.level) || 3;
    const fallback = document.querySelector(".location-map-fallback");

    const showMapFallback = () => {
      if (fallback) {
        fallback.classList.add("is-visible");
      }
    };

    const initLocationMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        showMapFallback();
        return;
      }

      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, (result, status) => {
          if (status !== window.kakao.maps.services.Status.OK || !result[0]) {
            showMapFallback();
            return;
          }

          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

          const map = new window.kakao.maps.Map(locationMapEl, {
            center: coords,
            level: level,
          });

          const marker = new window.kakao.maps.Marker({
            map: map,
            position: coords,
            title: placeName,
          });

          const infoWindow = new window.kakao.maps.InfoWindow({
            content: '<div class="location-map-info">' + placeName + "</div>",
          });

          infoWindow.open(map, marker);

          const zoomControl = new window.kakao.maps.ZoomControl();
          map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

          window.addEventListener("resize", () => {
            map.relayout();
            map.setCenter(coords);
          });
        });
      });
    };

    if (!appKey || appKey === "여기에_카카오_JAVASCRIPT_KEY") {
      showMapFallback();
    } else if (window.kakao && window.kakao.maps) {
      initLocationMap();
    } else {
      const kakaoScript = document.createElement("script");
      kakaoScript.src =
        "https://dapi.kakao.com/v2/maps/sdk.js?appkey=" +
        encodeURIComponent(appKey) +
        "&libraries=services&autoload=false";
      kakaoScript.onload = initLocationMap;
      kakaoScript.onerror = showMapFallback;
      document.head.appendChild(kakaoScript);
    }
  }





});