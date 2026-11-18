/* ==========================================================================
   Nuel Nwokeocha — portfolio interactions (vanilla JS, zero dependencies)
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nav: scrolled state ---------- */
  var nav = document.querySelector(".nav");
  function onScrollNav() {
    if (window.scrollY > 10) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scrollspy ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav-links a");
  function spy() {
    var pos = window.scrollY + 120;
    var currentId = "";
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) currentId = sec.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
    });
  }
  if ("IntersectionObserver" in window && sections.length) {
    window.addEventListener("scroll", spy, { passive: true });
    spy();
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Typed roles ---------- */
  var typed = document.getElementById("typed-role");
  if (typed && !reduceMotion) {
    var roles = ["DevOps Engineer", "Cloud Architect", "Infrastructure Engineer", "AWS Solutions Architect"];
    var i = 0, char = 0, deleting = false;
    function tick() {
      var word = roles[i];
      if (!deleting) {
        char++;
        typed.textContent = word.slice(0, char);
        if (char === word.length) { deleting = true; return setTimeout(tick, 1400); }
        return setTimeout(tick, 70);
      }
      char--;
      typed.textContent = word.slice(0, char);
      if (char === 0) {
        deleting = false;
        i = (i + 1) % roles.length;
      }
      setTimeout(tick, 40);
    }
    setTimeout(tick, 300);
  }
})();
