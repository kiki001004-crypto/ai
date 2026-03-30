// Smooth Scroll Animation on Page Load

document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");
  const mobileBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section, footer");

  // 1. 스크롤 시 헤더 배경색 변경
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // 2. 모바일 햄버거 메뉴 토글
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener("click", () => {
      mobileBtn.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  // 3. 부드러운 스크롤 및 메뉴 클릭 로직
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = header.offsetHeight;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // 클릭 시 모바일 메뉴 닫기
        if (navMenu.classList.contains("active")) {
          mobileBtn.classList.remove("active");
          navMenu.classList.remove("active");
        }
      }
    });
  });

  // 4. 스크롤 위치에 따른 활성 링크 표시 (Intersection Observer)
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -80% 0px",
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${entry.target.id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));
});

document.addEventListener("DOMContentLoaded", function () {
  // Add scroll reveal animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with scroll-fade-in class
  const elementsToAnimate = document.querySelectorAll(".scroll-fade-in");
  elementsToAnimate.forEach((element) => {
    observer.observe(element);
  });

  // Add staggered delay to multiple elements in the same section
  const philosophyCards = document.querySelectorAll(".philosophy-card");
  philosophyCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.2}s`;
  });

  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.15}s`;
  });

  const routineCards = document.querySelectorAll(".routine-card");
  routineCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.2}s`;
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add hover effect to buttons
  const buttons = document.querySelectorAll(".btn-primary, .btn-outline");
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });

    button.addEventListener("mousedown", function () {
      this.style.transform = "scale(0.95)";
    });

    button.addEventListener("mouseup", function () {
      this.style.transform = "scale(1.05)";
    });
  });

  // Parallax effect for decorative circles
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const decoCircle1 = document.querySelector(".deco-circle-1");
    const decoCircle2 = document.querySelector(".deco-circle-2");

    if (decoCircle1 && decoCircle2) {
      decoCircle1.style.transform = `rotate(${scrolled * 0.1}deg)`;
      decoCircle2.style.transform = `rotate(${-scrolled * 0.1}deg)`;
    }
  });

  // Add loading animation for images
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.addEventListener("load", function () {
      this.style.opacity = "1";
    });

    // Set initial opacity
    img.style.opacity = "0";
    img.style.transition = "opacity 0.5s ease";

    // If image is already loaded (cached)
    if (img.complete) {
      img.style.opacity = "1";
    }
  });

  // Routine icon rotation on hover
  const routineIcons = document.querySelectorAll(".routine-icon");
  routineIcons.forEach((icon) => {
    const card = icon.closest(".routine-card");

    card.addEventListener("mouseenter", function () {
      icon.style.transform = "rotate(360deg)";
    });

    card.addEventListener("mouseleave", function () {
      icon.style.transform = "rotate(0deg)";
    });
  });

  // Philosophy icon hover effect
  const philosophyIcons = document.querySelectorAll(".philosophy-icon");
  philosophyIcons.forEach((icon) => {
    const card = icon.closest(".philosophy-card");

    card.addEventListener("mouseenter", function () {
      icon.style.transform = "scale(1.1) rotate(5deg)";
    });

    card.addEventListener("mouseleave", function () {
      icon.style.transform = "scale(1) rotate(0deg)";
    });
  });

  // Add click effect to social icons
  const socialIcons = document.querySelectorAll(".social-icon");
  socialIcons.forEach((icon) => {
    icon.addEventListener("click", function (e) {
      e.preventDefault();

      // Create ripple effect
      const ripple = document.createElement("span");
      ripple.style.position = "absolute";
      ripple.style.width = "100%";
      ripple.style.height = "100%";
      ripple.style.borderRadius = "50%";
      ripple.style.background = "rgba(255, 255, 255, 0.5)";
      ripple.style.transform = "scale(0)";
      ripple.style.animation = "ripple 0.6s ease-out";

      this.style.position = "relative";
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Add CSS for ripple animation
  const style = document.createElement("style");
  style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);

  // Lazy loading for images (for better performance)
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          }
          imageObserver.unobserve(img);
        }
      });
    });

    const lazyImages = document.querySelectorAll("img[data-src]");
    lazyImages.forEach((img) => imageObserver.observe(img));
  }

  // Add entrance animation to hero section
  const heroElements = {
    brandTitle: document.querySelector(".brand-title"),
    subtitle: document.querySelector(".hero-subtitle"),
    description: document.querySelector(".hero-description"),
    button: document.querySelector(".btn-primary"),
    image: document.querySelector(".hero-image-wrapper"),
  };

  // Trigger animations
  setTimeout(() => {
    if (heroElements.brandTitle) {
      heroElements.brandTitle.style.opacity = "1";
      heroElements.brandTitle.style.transform = "translateY(0)";
    }
  }, 100);

  // Add active state to footer links
  const footerLinks = document.querySelectorAll(".footer-links a");
  footerLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      this.style.transform = "translateX(5px)";
      this.style.opacity = "1";
    });

    link.addEventListener("mouseleave", function () {
      this.style.transform = "translateX(0)";
      this.style.opacity = "0.8";
    });
  });

  console.log("LUMIEL website loaded successfully! ✨");
});

// Handle window resize
let resizeTimer;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    // Recalculate any responsive elements if needed
    console.log("Window resized");
  }, 250);
});

// Prevent scroll jank
window.addEventListener(
  "scroll",
  function () {
    window.requestAnimationFrame(function () {
      // Any scroll-based animations handled here
    });
  },
  { passive: true },
);
