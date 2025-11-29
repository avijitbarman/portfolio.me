// script.js — full replacement (includes typewriter, toasts, form, + robust navbar hide)
document.addEventListener("DOMContentLoaded", function () {
  /* ---------------- TYPEWRITER EFFECT ---------------- */
  const typeTarget = document.querySelector(".typewriter");
  const text = "Hi, I'm Avijit Barman";
  let i = 0;
  let isDeleting = false;

  function typeEffect() {
    if (!typeTarget) return;
    if (!isDeleting) {
      typeTarget.textContent = text.substring(0, i + 1);
      i++;
      if (i === text.length) setTimeout(() => (isDeleting = true), 1200);
    } else {
      typeTarget.textContent = text.substring(0, i - 1);
      i--;
      if (i === 0) isDeleting = false;
    }
    setTimeout(typeEffect, isDeleting ? 80 : 120);
  }
  typeEffect();

  /* ---------------- YEAR IN FOOTER ---------------- */
  const yearEl = document.getElementById("year") || document.getElementById("2025");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- TOAST HELPER ---------------- */
  function showToast(message, ms = 2000) {
    const t = document.createElement("div");
    t.className = "pf-toast";
    t.innerText = message;
    Object.assign(t.style, {
      position: "fixed",
      left: "50%",
      bottom: "36px",
      transform: "translateX(-50%)",
      background: "linear-gradient(90deg,#8a2be2,#ff007f)",
      color: "#fff",
      padding: "10px 18px",
      borderRadius: "999px",
      zIndex: 9999,
      boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
      fontWeight: 700,
    });
    document.body.appendChild(t);
    setTimeout(() => {
      t.style.transition = "opacity 300ms, transform 300ms";
      t.style.opacity = "0";
      t.style.transform = "translateX(-50%) translateY(8px)";
      setTimeout(() => t.remove(), 300);
    }, ms);
  }

  /* ---------------- BUTTONS & FORM ---------------- */
  const buttons = document.querySelectorAll(".btn");
  if (buttons && buttons.length) {
    buttons.forEach((b) => {
      if (b._bound) return;
      b.addEventListener("click", (ev) => {
        if (b.closest("form")) return;
        ev.preventDefault();
        showToast("Thanks for visiting!");
      });
      b._bound = true;
    });
  }

  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Message sent — thank you!");
      form.reset();
    });
  }

  const clearBtn = document.querySelector(".btn-clear");
  if (clearBtn && form) {
    clearBtn.addEventListener("click", () => {
      const inputs = form.querySelectorAll("input, textarea");
      inputs.forEach((el) => (el.value = ""));
      showToast("Form cleared");
    });
  }

  /* ------------- ROBUST NAVBAR HIDE/SHOW ------------- */
  // Find navbar element
  const navbar = document.getElementById("navbar");
  if (!navbar) {
    console.error("Navbar not found: make sure header has id=\"navbar\".");
    return; // stop here if navbar missing
  }

  // Initialize styles (use transform so CSS 'top' conflicts don't break behavior)
  navbar.style.willChange = "transform";
  // Only set transition if not already present (preserve custom CSS if exists)
  if (!navbar.style.transition) navbar.style.transition = "transform 0.33s ease";

  let lastScroll = window.pageYOffset || 0;
  let ticking = false;

  function onScroll() {
    const currentScroll = window.pageYOffset || 0;

    // At the top, always show
    if (currentScroll <= 0) {
      navbar.style.transform = "translateY(0)";
      lastScroll = 0;
      return;
    }

    if (currentScroll > lastScroll + 5) {
      // scrolling down (with small threshold)
      navbar.style.transform = "translateY(-110%)"; // hide (move fully up)
    } else if (currentScroll < lastScroll - 5) {
      // scrolling up
      navbar.style.transform = "translateY(0)"; // show
    }
    lastScroll = currentScroll;
  }

  // Use RAF for smooth updates and low overhead
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  // Also show navbar when resizing (helps some mobile cases)
  window.addEventListener(
    "resize",
    function () {
      navbar.style.transform = "translateY(0)";
    },
    { passive: true }
  );

  // Small touch-support: show navbar on touchstart (useful after swipe)
  window.addEventListener(
    "touchstart",
    function () {
      navbar.style.transform = "translateY(0)";
    },
    { passive: true }
  );
});
