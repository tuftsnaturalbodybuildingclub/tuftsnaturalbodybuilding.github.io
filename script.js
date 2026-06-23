/* ============================================================
   Tufts Natural Bodybuilding Club — script.js
   ============================================================
   This file adds the interactive behavior. Right now it does
   these small things:
     1. Opens/closes the mobile menu when you tap the hamburger
     2. Closes that menu after you tap a link
     3. Fills in the current year in the footer
     4. Counts the "pounds lifted" number up when it scrolls in

   It's a good place to start learning JavaScript: read the
   comments, change something, and reload your page to see it.
   ============================================================ */

// Wait until the HTML is fully loaded before running anything.
document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1 & 2. MOBILE MENU ---------- */

  // Grab the button and the nav from the page (by their class/id in index.html).
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primary-nav");

  if (toggle && nav) {
    // When the hamburger is clicked, flip the menu open or closed.
    toggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open"); // add/remove the class
      toggle.classList.toggle("is-open", isOpen);     // animate the bars into an X
      toggle.setAttribute("aria-expanded", isOpen);   // tells screen readers the state
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    // After tapping any link inside the menu, close it again.
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* ---------- 3. CURRENT YEAR IN FOOTER ---------- */

  // Find the <span id="year"> in the footer and drop today's year into it.
  const yearSpan = document.querySelector("#year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* ---------- 4. COUNT-UP "POUNDS LIFTED" ---------- */

  // The .stat-number element holds the target in its data-target attribute.
  // We animate from 0 up to that number the first time it scrolls into view.
  const statEl = document.querySelector(".stat-number");
  if (statEl) {
    const target = Number(statEl.dataset.target) || 0;

    // Add the thousands separators (e.g. 3300000 -> "3,300,000").
    function formatNumber(n) {
      return Math.round(n).toLocaleString("en-US");
    }

    // Some people ask their device to reduce motion — show the final
    // number right away rather than animating it.
    const reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      statEl.textContent = formatNumber(target);
    } else {
      let started = false;

      function runCount() {
        const duration = 2000; // total time in milliseconds (2 seconds)
        const startTime = performance.now();

        function tick(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          // ease-out: fast at first, gently slowing as it nears the total
          const eased = 1 - Math.pow(1 - progress, 3);
          statEl.textContent = formatNumber(target * eased);
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            statEl.textContent = formatNumber(target); // land exactly on the total
          }
        }
        requestAnimationFrame(tick);
      }

      // Only start once the band is actually on screen.
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting && !started) {
                started = true;
                runCount();
                observer.disconnect(); // run it once, then stop watching
              }
            });
          },
          { threshold: 0.4 }
        );
        observer.observe(statEl);
      } else {
        // Very old browsers: just run it.
        runCount();
      }
    }
  }

});

/* ------------------------------------------------------------
   WANT TO ADD MORE LATER? Some beginner-friendly ideas:
     - A "back to top" button that appears after scrolling
     - A countdown to your next meeting
     - A photo gallery or a list of members loaded from data
   Add new code inside the DOMContentLoaded function above.
   ------------------------------------------------------------ */