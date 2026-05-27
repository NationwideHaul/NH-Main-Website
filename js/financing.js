/* ══════════════════════════════════════════════════════
   NATIONWIDE HAUL — Financing Page JavaScript
   ══════════════════════════════════════════════════════ */

// ── Financing Calculator ────────────────────────────────
function formatCurrency(n) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function calcPayment() {
  var loan   = parseFloat(document.getElementById('loanSlider').value);
  var term   = parseFloat(document.getElementById('termSlider').value);
  var down   = parseFloat(document.getElementById('downSlider').value);
  var rate   = parseFloat(document.getElementById('rateInput').value);
  document.getElementById('loanDisplay').textContent = '$' + formatCurrency(loan);
  document.getElementById('termDisplay').textContent = term + ' months';
  document.getElementById('downDisplay').textContent = '$' + formatCurrency(down);
  var principal = loan - down;
  if (principal <= 0) {
    document.getElementById('calcMonthly').textContent = '0';
    document.getElementById('calcFinanced').textContent = '$0';
    document.getElementById('calcTotalPay').textContent = '$0';
    document.getElementById('calcTotalInt').textContent = '$0';
    document.getElementById('calcTermOut').textContent = term;
    return;
  }
  var monthly;
  if (rate === 0) {
    monthly = principal / term;
  } else {
    var r = (rate / 100) / 12;
    monthly = principal * r * Math.pow(1 + r, term) / (Math.pow(1 + r, term) - 1);
  }
  var totalPay = monthly * term;
  var totalInt = totalPay - principal;
  document.getElementById('calcMonthly').textContent  = formatCurrency(monthly);
  document.getElementById('calcFinanced').textContent = '$' + formatCurrency(principal);
  document.getElementById('calcTotalPay').textContent = '$' + formatCurrency(totalPay);
  document.getElementById('calcTotalInt').textContent = '$' + formatCurrency(totalInt);
  document.getElementById('calcTermOut').textContent  = term;
}

['loanSlider','termSlider','downSlider','rateInput'].forEach(function(id) {
  var el = document.getElementById(id);
  if (el) el.addEventListener('input', calcPayment);
});
calcPayment();

// ── FAQ Accordion ───────────────────────────────────────
function toggleFaq(btn) {
  var item = btn.closest('.faq-item');
  var isOpen = item.classList.contains('is-open');
  document.querySelectorAll('.faq-item').forEach(function(i){ i.classList.remove('is-open'); });
  if (!isOpen) item.classList.add('is-open');
}
