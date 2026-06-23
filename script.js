/* ============================================================
   Tufts Natural Bodybuilding Club — script.js
   ============================================================
   This file adds the interactive behavior. Right now it does
   these small things:
     1. Opens/closes the mobile menu when you tap the hamburger
     2. Closes that menu after you tap a link
     3. Fills in the current year in the footer
     4. Counts the "pounds lifted" number up when it scrolls in
     5. Loops the federation logos smoothly at any screen width

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
        const duration = 5000; // total time in milliseconds (2 seconds)
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

  /* ---------- 5. FEDERATIONS LOGO MARQUEE ---------- */

  // We copy the row of logos enough times to more than fill the screen, then
  // slide the whole row by exactly half its width. Because the two halves are
  // identical, the reset is invisible — so the loop never "pops" or leaves a
  // gap, no matter how wide the screen is.
  const marquee = document.querySelector(".logo-marquee");
  const track = marquee ? marquee.querySelector(".logo-track") : null;

  if (marquee && track) {
    const reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const SPEED = 45; // pixels per second — lower is slower

    // Keep a pristine copy of the original logos to rebuild from.
    const originals = Array.from(track.children).map(function (node) {
      return node.cloneNode(true);
    });

    function appendSet(decorative) {
      originals.forEach(function (node) {
        const copy = node.cloneNode(true);
        if (decorative) {
          // Hide the duplicate copies from screen readers.
          copy.setAttribute("alt", "");
          copy.setAttribute("aria-hidden", "true");
        }
        track.appendChild(copy);
      });
    }

    function buildMarquee() {
      if (reduceMotion) return; // leave the tidy static row in place

      // Lay out one set in a single line so we can measure its real width.
      track.classList.add("is-animating");
      track.innerHTML = "";
      appendSet(false);

      const setWidth = track.scrollWidth;
      const viewport = marquee.clientWidth;
      if (!setWidth || !viewport) return;

      // Enough sets to cover the screen once = one "half"; double it.
      const setsPerHalf = Math.max(1, Math.ceil(viewport / setWidth));

      track.innerHTML = "";
      for (let i = 0; i < setsPerHalf * 2; i++) {
        appendSet(i !== 0); // first set keeps real alt text; rest are decorative
      }

      // Match the duration to the distance so the speed stays constant.
      const halfWidth = setWidth * setsPerHalf;
      track.style.setProperty("--marquee-duration", halfWidth / SPEED + "s");
    }

    // Run once the logo images have loaded (so their widths are known),
    // and rebuild if the window is resized.
    window.addEventListener("load", buildMarquee);

    let resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildMarquee, 200);
    });
  }

});

/* ------------------------------------------------------------
   WANT TO ADD MORE LATER? Some beginner-friendly ideas:
     - A "back to top" button that appears after scrolling
     - A countdown to your next meeting
     - A photo gallery or a list of members loaded from data
   Add new code inside the DOMContentLoaded function above.
   ------------------------------------------------------------ */