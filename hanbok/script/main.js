(function () {
        "use strict";

        const qs = (selector, scope = document) =>
          scope.querySelector(selector);
        const qsa = (selector, scope = document) =>
          Array.from(scope.querySelectorAll(selector));

        const header = qs("#header");
        const topBtn = qs(".top-btn");
        const menuBtn = qs(".menu-btn");
        const mobileMenu = qs("#mobileMenu");
        const mobileLinks = qsa(".mobile-menu a");
        const pageLinks = qsa('.gnb a[href^="#"], .mobile-menu a[href^="#"]');
        const pageSections = pageLinks
          .map((link) =>
            document.getElementById(link.getAttribute("href").slice(1)),
          )
          .filter(Boolean);

        let isHeaderScrolled = false;

        function setScrolledState() {
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop || 0;

          if (!isHeaderScrolled && scrollTop > 80) isHeaderScrolled = true;
          else if (isHeaderScrolled && scrollTop < 4) isHeaderScrolled = false;

          if (header) header.classList.toggle("is-scrolled", isHeaderScrolled);
          if (topBtn) topBtn.classList.toggle("is-show", scrollTop > 260);

          if (pageSections.length && pageLinks.length) {
            const headerHeight = header ? header.offsetHeight : 0;
            const checkPoint = scrollTop + headerHeight + 80;
            let currentId = pageSections[0].id;

            pageSections.forEach((section) => {
              if (section.offsetTop <= checkPoint) currentId = section.id;
            });

            pageLinks.forEach((link) => {
              link.classList.toggle(
                "is-active",
                link.getAttribute("href") === `#${currentId}`,
              );
            });
          }
        }

        window.addEventListener("scroll", setScrolledState, { passive: true });
        setScrolledState();

        function getFocusableMenuItems() {
          if (!mobileMenu || !menuBtn) return [];
          return [
            menuBtn,
            ...qsa('a, button, [tabindex]:not([tabindex="-1"])', mobileMenu),
          ].filter(
            (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
          );
        }

        function openMenu() {
          if (!menuBtn || !mobileMenu) return;
          document.body.classList.add("is-menu-open");
          menuBtn.classList.add("is-active");
          menuBtn.setAttribute("aria-expanded", "true");
          menuBtn.setAttribute("aria-label", "메뉴 닫기");
          mobileMenu.classList.add("is-active");
          mobileMenu.setAttribute("aria-hidden", "false");
        }

        function closeMenu() {
          if (!menuBtn || !mobileMenu) return;
          document.body.classList.remove("is-menu-open");
          menuBtn.classList.remove("is-active");
          menuBtn.setAttribute("aria-expanded", "false");
          menuBtn.setAttribute("aria-label", "메뉴 열기");
          mobileMenu.classList.remove("is-active");
          mobileMenu.setAttribute("aria-hidden", "true");
        }

        if (menuBtn) {
          menuBtn.addEventListener("click", () => {
            if (menuBtn.classList.contains("is-active")) closeMenu();
            else openMenu();
          });
        }

        function moveToSection(hash) {
          if (!hash || hash === "javascript:void(0)") return false;
          const target = qs(hash);
          if (!target) return false;
          const headerHeight = header ? header.offsetHeight : 0;
          const top =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight +
            2;
          window.scrollTo({ top, behavior: "smooth" });
          history.pushState(null, "", hash);
          return true;
        }

        pageLinks.forEach((link) => {
          link.addEventListener("click", (event) => {
            const hash = link.getAttribute("href");
            if (moveToSection(hash)) event.preventDefault();
            closeMenu();
          });
        });

        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape") closeMenu();

          if (
            event.key === "Tab" &&
            document.body.classList.contains("is-menu-open")
          ) {
            const focusable = getFocusableMenuItems();
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
        });

        document.addEventListener("click", (event) => {
          if (!mobileMenu || !menuBtn) return;
          const isMenuClick =
            mobileMenu.contains(event.target) || menuBtn.contains(event.target);
          if (document.body.classList.contains("is-menu-open") && !isMenuClick)
            closeMenu();
        });

        if (topBtn) {
          topBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
        }

        const sharedAutoPlayActions = [];
        let sharedAutoPlayTimer = null;

        function resetSharedAutoPlay() {
          window.clearInterval(sharedAutoPlayTimer);
          sharedAutoPlayTimer = window.setInterval(() => {
            sharedAutoPlayActions.forEach((action) => action());
          }, 2500); 
        }

        function createFadeSlider(options) {
          const root = qs(options.rootSelector);
          if (!root) return;
          
          const slides = qsa(options.slideSelector, root);
          const dots = options.dotSelector ? qsa(options.dotSelector, root) : [];
          const prev = options.prevSelector ? qs(options.prevSelector, root) : null;
          const next = options.nextSelector ? qs(options.nextSelector, root) : null;
          let current = 0;
          let touchStartX = 0;

          if (!slides.length) return;

          function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach((slide, slideIndex) => {
              const isActive = slideIndex === current;
              slide.classList.toggle("is-active", isActive);
              slide.setAttribute("aria-hidden", String(!isActive));
            });

            dots.forEach((dot, dotIndex) => {
              const isActive = dotIndex === current;
              dot.classList.toggle("is-active", isActive);
              dot.setAttribute("aria-current", isActive ? "true" : "false");
            });
          }

          function goNext() {
            show(current + 1);
          }
          function goPrev() {
            show(current - 1);
          }

          dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
              show(index);
              resetSharedAutoPlay();
            });
          });

          if (prev)
            prev.addEventListener("click", () => {
              goPrev();
              resetSharedAutoPlay();
            });
          if (next)
            next.addEventListener("click", () => {
              goNext();
              resetSharedAutoPlay();
            });

          root.addEventListener("mouseenter", () => window.clearInterval(sharedAutoPlayTimer));
          root.addEventListener("mouseleave", resetSharedAutoPlay);
          root.addEventListener("focusin", () => window.clearInterval(sharedAutoPlayTimer));
          root.addEventListener("focusout", resetSharedAutoPlay);
          root.addEventListener(
            "touchstart",
            (event) => {
              touchStartX = event.touches[0].clientX;
              window.clearInterval(sharedAutoPlayTimer);
            },
            { passive: true },
          );
          root.addEventListener(
            "touchend",
            (event) => {
              const diff = touchStartX - event.changedTouches[0].clientX;
              if (Math.abs(diff) > 45) {
                if (diff > 0) goNext();
                else goPrev();
              }
              resetSharedAutoPlay();
            },
            { passive: true },
          );

          sharedAutoPlayActions.push(goNext);
          show(0);
        }

        createFadeSlider({
          rootSelector: ".collection-slider",
          slideSelector: ".collection-slide",
          prevSelector: ".collection-prev",
          nextSelector: ".collection-next"
        });

        function createMainVisualSlide() {
          const root = qs(".visual-slider");
          if (!root) return;

          const track = qs(".visual-track", root);
          const originalSlides = qsa(".visual-slide", root);
          const dots = qsa(".visual-dots button", root);
          const prev = qs(".visual-prev", root);
          const next = qs(".visual-next", root);

          let current = 0;
          let touchStartX = 0;
          let isAnimating = false;

          if (!track || !originalSlides.length) return;

          const firstClone = originalSlides[0].cloneNode(true);
          firstClone.classList.remove("is-active");
          firstClone.setAttribute("aria-hidden", "true");
          firstClone.dataset.clone = "true";
          track.appendChild(firstClone);

          const slides = qsa(".visual-slide", root);
          const cloneIndex = originalSlides.length;

          function setActive(index) {
            const dotIndex = index === cloneIndex ? 0 : index;
            dots.forEach((dot, i) => {
              const isActive = i === dotIndex;
              dot.classList.toggle("is-active", isActive);
              dot.setAttribute("aria-current", isActive ? "true" : "false");
            });

            slides.forEach((slide, slideIndex) => {
              const isActive = slideIndex === index;
              slide.classList.toggle("is-active", isActive);
              slide.setAttribute("aria-hidden", String(!isActive));
            });
          }

          function moveTo(index, animate = true) {
            current = index;
            if (!animate) {
              track.style.transition = "none";
            } else {
              track.style.transition = "";
            }
            track.style.transform = `translateX(-${current * 100}%)`;
            setActive(current);

            if (!animate) {
              track.offsetHeight; 
              track.style.transition = "";
            }
          }

          function goNext() {
            if (isAnimating) return;
            isAnimating = true;
            moveTo(current + 1);
          }

          function goPrev() {
            if (isAnimating) return;
            if (current === 0) {
              moveTo(cloneIndex, false);
              setTimeout(() => {
                isAnimating = true;
                moveTo(cloneIndex - 1);
              }, 20);
              return;
            }
            isAnimating = true;
            moveTo(current - 1);
          }

          track.addEventListener("transitionend", (event) => {
            if (event.propertyName !== "transform") return;
            if (current === cloneIndex) {
              moveTo(0, false);
            }
            isAnimating = false;
          });

          if (prev) prev.addEventListener("click", () => { goPrev(); resetSharedAutoPlay(); });
          if (next) next.addEventListener("click", () => { goNext(); resetSharedAutoPlay(); });

          dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
              if (isAnimating || current === index) return;
              isAnimating = true;
              moveTo(index);
              resetSharedAutoPlay();
            });
          });

          root.addEventListener("mouseenter", () => window.clearInterval(sharedAutoPlayTimer));
          root.addEventListener("mouseleave", resetSharedAutoPlay);
          root.addEventListener("focusin", () => window.clearInterval(sharedAutoPlayTimer));
          root.addEventListener("focusout", resetSharedAutoPlay);
          root.addEventListener(
            "touchstart",
            (event) => {
              touchStartX = event.touches[0].clientX;
              window.clearInterval(sharedAutoPlayTimer);
            },
            { passive: true },
          );
          root.addEventListener(
            "touchend",
            (event) => {
              const diff = touchStartX - event.changedTouches[0].clientX;
              if (Math.abs(diff) > 45) {
                if (diff > 0) goNext();
                else goPrev();
              }
              resetSharedAutoPlay();
            },
            { passive: true },
          );

          sharedAutoPlayActions.push(goNext);
          moveTo(0, false);
        }

        createMainVisualSlide();
        resetSharedAutoPlay();

        const posterSlider = qs(".poster-slider");
        const posterTrack = qs(".poster-track");
        const posterItems = qsa(".poster-item");
        const posterNext = qs(".poster-next");
        const posterCount = qs(".poster-count");
        let posterIndex = 0;

        function getPosterMaxIndex() {
          if (!posterSlider || !posterTrack || !posterItems.length) return 0;
          const gap = parseFloat(getComputedStyle(posterTrack).gap) || 0;
          const itemWidth = posterItems[0].getBoundingClientRect().width + gap;
          const visibleCount = Math.max(
            1,
            Math.floor((posterSlider.clientWidth + gap) / itemWidth),
          );
          return Math.max(0, posterItems.length - visibleCount);
        }

        function movePoster() {
          if (!posterTrack || !posterItems.length) return;
          const gap = parseFloat(getComputedStyle(posterTrack).gap) || 0;
          const itemWidth = posterItems[0].getBoundingClientRect().width + gap;
          const maxIndex = getPosterMaxIndex();
          posterIndex = Math.min(posterIndex, maxIndex);
          posterTrack.style.transform = `translateX(${-posterIndex * itemWidth}px)`;
          if (posterCount)
            posterCount.textContent = `${posterIndex + 1}/${posterItems.length}`;
        }

        if (posterNext && posterItems.length) {
          posterNext.addEventListener("click", () => {
            const maxIndex = getPosterMaxIndex();
            posterIndex = posterIndex >= maxIndex ? 0 : posterIndex + 1;
            movePoster();
          });
          window.addEventListener("resize", movePoster);
          movePoster();
        }

        const tabButtons = qsa(".notice-tabs button");
        const noticeCards = qsa(".notice-card");

        tabButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const filter = button.dataset.filter;

            tabButtons.forEach((tab) => {
              const isActive = tab === button;
              tab.classList.toggle("is-active", isActive);
              tab.setAttribute("aria-selected", String(isActive));
              tab.setAttribute("tabindex", isActive ? "0" : "-1");
            });

            noticeCards.forEach((card) => {
              const isMatch =
                filter === "all" || card.dataset.category === filter;
              card.classList.toggle("is-hidden", !isMatch);
            });
          });
        });

        const galleryWindow = qs(".gallery-window");
        const galleryTrack = qs(".gallery-list");
        let galleryCards = galleryTrack
          ? qsa(".gallery-card", galleryTrack)
          : [];
        let galleryTimer = null;
        let galleryAnimating = false;

        function refreshGalleryCards() {
          galleryCards = galleryTrack ? qsa(".gallery-card", galleryTrack) : [];
        }

        function setGalleryFirstLarge() {
          refreshGalleryCards();
          galleryCards.forEach((card, index) => {
            const isFirst = index === 0;
            card.classList.toggle("is-large", isFirst);
            card.setAttribute("aria-current", isFirst ? "true" : "false");
          });
        }

        function resetGalleryPosition() {
          if (!galleryTrack) return;
          galleryTrack.classList.add("is-resetting");
          galleryTrack.style.transform = "translateX(0)";
          galleryTrack.offsetHeight;
          galleryTrack.classList.remove("is-resetting");
        }

        function moveGallery() {
  if (!galleryWindow || !galleryTrack) return;
  refreshGalleryCards();
  if (galleryCards.length < 2 || galleryAnimating) return;

  if (window.matchMedia("(max-width: 1024px)").matches) {
    setGalleryFirstLarge();
    resetGalleryPosition();
    return;
  }

  galleryAnimating = true;

  const firstCard = galleryCards[0];
  const nextCard = galleryCards[1];
  const gap = parseFloat(getComputedStyle(galleryTrack).gap) || 24;

  /*
    이동 시작 전에 큰 카드 상태를 다음 카드로 넘김.
    그래서 트랙 이동과 동시에 다음 카드가 자연스럽게 커짐.
  */
  firstCard.classList.remove("is-large");
  firstCard.setAttribute("aria-current", "false");

  nextCard.classList.add("is-large");
  nextCard.setAttribute("aria-current", "true");

  const moveX = 280 + gap;

  galleryTrack.offsetHeight;

  requestAnimationFrame(() => {
    galleryTrack.style.transform = `translateX(${-moveX}px)`;
  });

  const onEnd = (event) => {
    if (event.propertyName !== "transform") return;
    galleryTrack.removeEventListener("transitionend", onEnd);

    galleryTrack.classList.add("is-resetting");
    galleryTrack.appendChild(firstCard);
    galleryTrack.style.transform = "translateX(0)";

    setGalleryFirstLarge();

    galleryTrack.offsetHeight;
    galleryTrack.classList.remove("is-resetting");
    galleryAnimating = false;
  };

  galleryTrack.addEventListener("transitionend", onEnd);
}

        function startGalleryAuto() {
          if (!galleryWindow || !galleryTrack) return;
          window.clearInterval(galleryTimer);
          galleryTimer = window.setInterval(moveGallery, 2200);
        }

        if (galleryWindow && galleryTrack) {
          setGalleryFirstLarge();
          resetGalleryPosition();
          galleryWindow.addEventListener("mouseenter", () =>
            window.clearInterval(galleryTimer),
          );
          galleryWindow.addEventListener("mouseleave", startGalleryAuto);
          window.addEventListener("resize", () => {
            setGalleryFirstLarge();
            resetGalleryPosition();
          });
          startGalleryAuto();
        }

        const revealItems = qsa(".reveal");

        if ("IntersectionObserver" in window) {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  entry.target.classList.add("is-visible");
                  observer.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.12 },
          );

          revealItems.forEach((item, index) => {
            item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
            observer.observe(item);
          });
        } else {
          revealItems.forEach((item) => item.classList.add("is-visible"));
        }
      })();
