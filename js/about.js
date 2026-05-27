/* ══════════════════════════════════════════════════════
   NATIONWIDE HAUL — About Page JavaScript
   ══════════════════════════════════════════════════════ */

// ── Scroll Reveal Animations ────────────────────────────
function initReveal() {
  var els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(function(el) { io.observe(el); });
}

// Init on page load
document.addEventListener('DOMContentLoaded', function() {
  initReveal();
});

// ── Stat counter animation ──────────────────────────────
(function() {
  var statEls = document.querySelectorAll('.stat-item__number[data-target]');
  if (!statEls.length) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-target'));
        var suffix = el.getAttribute('data-suffix') || '';
        var current = 0;
        var step = target / (1800 / 16);
        var timer = setInterval(function() {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); el.classList.add('stat-landed'); }
          el.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 16);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statEls.forEach(function(el) { obs.observe(el); });
})();
