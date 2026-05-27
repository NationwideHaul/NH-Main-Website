/* ══════════════════════════════════════════════════════
   NATIONWIDE HAUL — Lease Page JavaScript
   ══════════════════════════════════════════════════════ */

// ── Fleet Filter ────────────────────────────────────────
function lrFilter(btn, type) {
  document.querySelectorAll('.lr-filter-tab').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  document.querySelectorAll('#lrFleetGrid .lr-fleet-card').forEach(function(card) {
    card.style.display = (type === 'all' || card.dataset.type === type) ? '' : 'none';
  });
}

// ── FAQ Accordion (reused from financing) ───────────────
function toggleFaq(btn) {
  var item = btn.closest('.faq-item');
  var isOpen = item.classList.contains('is-open');
  document.querySelectorAll('.faq-item').forEach(function(i){ i.classList.remove('is-open'); });
  if (!isOpen) item.classList.add('is-open');
}
