(function () {
  "use strict";

  /* ============ Year in footer ============ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============ Sticky header ============ */
  var header = document.getElementById("siteHeader");
  var backToTop = document.getElementById("backToTop");
  var progressBar = document.getElementById("scrollProgress");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 40);
    if (backToTop) backToTop.classList.toggle("is-visible", y > 700);

    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ============ Strategic call form confirmation ============ */
  var callFormModal = document.getElementById("callFormModal");
  var callFormClose = document.getElementById("callFormClose");
  var strategicCallForm = document.getElementById("strategicCallForm");
  var callConfirmation = document.getElementById("callConfirmation");
  var confirmationBack = document.getElementById("confirmationBack");
  var formSubmitter = null;

  function updateModalScrollLock() {
    var isModalOpen = (callFormModal && !callFormModal.hidden) || (callConfirmation && !callConfirmation.hidden);
    document.body.classList.toggle("form-modal-open", isModalOpen);
  }

  function closeCallForm() {
    if (!callFormModal) return;
    callFormModal.hidden = true;
    updateModalScrollLock();
    if (formSubmitter) formSubmitter.focus();
  }

  function closeConfirmation() {
    if (!callConfirmation) return;
    callConfirmation.hidden = true;
    updateModalScrollLock();
    if (formSubmitter) formSubmitter.focus();
  }

  function setFieldError(field, message) {
    var error = document.getElementById(field.name + "-error");
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message || "";
  }

  function validateField(field) {
    var value = field.value.trim();
    var message = "";
    if (!value) message = "This field is required.";
    else if (field.name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = "Enter a valid work email address.";
    else if (field.name === "phone" && !/^[0-9+()\s-]{7,20}$/.test(value)) message = "Enter a valid phone number.";
    else if (field.name === "name" && value.length < 2) message = "Enter your full name.";
    else if (field.name === "business" && value.length < 2) message = "Enter your business name.";
    else if (field.name === "message" && value.length < 10) message = "Please share a little more about your expansion plans.";
    setFieldError(field, message);
    return !message;
  }

  document.querySelectorAll(".open-call-form").forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      formSubmitter = button;
      if (callFormModal) {
        callFormModal.hidden = false;
        updateModalScrollLock();
        var firstField = callFormModal.querySelector("input");
        if (firstField) firstField.focus();
      }
    });
  });

  if (strategicCallForm && callConfirmation && confirmationBack) {
    strategicCallForm.querySelectorAll("input, textarea").forEach(function (field) {
      field.addEventListener("input", function () { validateField(field); });
      field.addEventListener("blur", function () { validateField(field); });
    });
    strategicCallForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var fields = strategicCallForm.querySelectorAll("input, textarea");
      var isValid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) isValid = false;
      });
      if (!isValid) {
        var firstInvalid = strategicCallForm.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      if (callFormModal) callFormModal.hidden = true;
      callConfirmation.hidden = false;
      updateModalScrollLock();
      confirmationBack.focus();
      strategicCallForm.reset();
    });
    confirmationBack.addEventListener("click", closeConfirmation);
  }
  if (callFormClose) callFormClose.addEventListener("click", closeCallForm);
  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (callConfirmation && !callConfirmation.hidden) closeConfirmation();
    else if (callFormModal && !callFormModal.hidden) closeCallForm();
  });

  /* ============ Mobile nav toggle ============ */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mainNav.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ============ Scroll reveal ============ */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ============ Section-aware navigation ============ */
  var sectionLinks = document.querySelectorAll('.main-nav .nav-link');
  var sectionTargets = Array.prototype.map.call(sectionLinks, function (link) {
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);
  if ('IntersectionObserver' in window && sectionTargets.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(function (link) {
          link.classList.toggle('is-current', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    sectionTargets.forEach(function (section) { navObserver.observe(section); });
  }

  /* ============ Subtle hero depth ============ */
  var hero = document.querySelector('.hero');
  var heroVisual = document.querySelector('.hero-visual');
  var watermark = document.querySelector('.hero-watermark');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (hero && heroVisual && !reduceMotion && window.matchMedia('(min-width: 881px)').matches) {
    hero.addEventListener('mousemove', function (event) {
      var rect = hero.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      heroVisual.style.transform = 'translate3d(' + (x * -10) + 'px,' + (y * -8) + 'px,0)';
      if (watermark) watermark.style.transform = 'translate3d(' + (x * 14) + 'px,' + (y * 10) + 'px,0)';
    });
    hero.addEventListener('mouseleave', function () {
      heroVisual.style.transform = '';
      if (watermark) watermark.style.transform = '';
    });
  }

  /* ============ Smooth-scroll offset correction for hash links ============ */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 82;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ============ Interactive Client Constellation Hover Details ============ */
  var logoNodes = document.querySelectorAll('.canvas-logo-node');
  var defaultInfo = document.getElementById('relationshipDefaultInfo');
  var activeInfo = document.getElementById('relationshipActiveInfo');
  var categoryEl = document.getElementById('relationshipCategory');
  var titleEl = document.getElementById('relationshipTitle');
  var descEl = document.getElementById('relationshipDesc');

  if (logoNodes.length && defaultInfo && activeInfo && categoryEl && titleEl && descEl) {
    logoNodes.forEach(function (node) {
      node.addEventListener('mouseenter', function () {
        var category = node.getAttribute('data-category');
        var title = node.getAttribute('data-title');
        var desc = node.getAttribute('data-desc');

        categoryEl.textContent = category;
        titleEl.textContent = title;
        descEl.textContent = desc;

        // Visual category styling overrides
        if (category) {
          if (category.indexOf('Portfolio') !== -1) {
            categoryEl.style.color = 'var(--olive-dark)';
            categoryEl.style.background = 'rgba(93, 103, 67, 0.08)';
          } else {
            categoryEl.style.color = 'var(--gold)';
            categoryEl.style.background = 'rgba(199, 154, 61, 0.12)';
          }
        }

        defaultInfo.setAttribute('hidden', 'true');
        activeInfo.removeAttribute('hidden');
      });

      node.addEventListener('mouseleave', function () {
        activeInfo.setAttribute('hidden', 'true');
        defaultInfo.removeAttribute('hidden');
      });
    });
  }
})();
