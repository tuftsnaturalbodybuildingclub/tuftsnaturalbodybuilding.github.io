/* ============================================================
   Tufts Natural Bodybuilding Club — script.js
   ============================================================
   This file adds the interactive behavior. Right now it does
   three small things:
     1. Opens/closes the mobile menu when you tap the hamburger
     2. Closes that menu after you tap a link
     3. Fills in the current year in the footer

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

});

/* ------------------------------------------------------------
   WANT TO ADD MORE LATER? Some beginner-friendly ideas:
     - A "back to top" button that appears after scrolling
     - A countdown to your next meeting
     - A photo gallery or a list of members loaded from data
   Add new code inside the DOMContentLoaded function above.
   ------------------------------------------------------------ */
