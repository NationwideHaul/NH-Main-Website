/* ══════════════════════════════════════════════════════
   NATIONWIDE HAUL — Form Handlers
   ══════════════════════════════════════════════════════ */

// ── Form AJAX Helper ────────────────────────────────────
// Primary delivery is our own Resend backend (/api/notify): no captcha,
// no third-party rate limits, per-team routing + Vercel logs. If that is
// unavailable (e.g. RESEND_API_KEY not yet set) it falls back to FormSubmit
// so leads are never lost during the transition.
function submitFormAjax(formId, successId, errorId, email, btnSelector, btnLabel, formType) {
  var form = document.getElementById(formId);
  var success = document.getElementById(successId);
  var error = document.getElementById(errorId);
  var btn = form.querySelector(btnSelector);
  btn.disabled = true;
  btn.textContent = 'Sending\u2026';
  if (error) error.style.display = 'none';

  var data = new FormData(form);

  function showSuccess() {
    form.style.display = 'none';
    success.style.display = 'block';
    var modal = form.closest('.modal, [data-modal]');
    if (modal) setTimeout(function() { modal.style.display = 'none'; }, 3000);
  }
  function showError() {
    btn.disabled = false;
    btn.textContent = btnLabel;
    if (error) error.style.display = 'block';
  }

  // Fallback: FormSubmit (only reached if the Resend backend is unavailable).
  function viaFormSubmit() {
    fetch('https://formsubmit.co/ajax/' + email, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    }).then(function(res) {
      res.ok ? showSuccess() : showError();
    }).catch(showError);
  }

  // Primary: our Resend serverless function.
  var payload = {};
  data.forEach(function(v, k) { payload[k] = v; });
  if (formType) payload.form_type = formType;

  fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  }).then(function(res) {
    if (res.ok) { showSuccess(); }
    else { viaFormSubmit(); }
  }).catch(viaFormSubmit);
}

// ── Contact Form ────────────────────────────────────────
function handleContactSubmit(e) {
  e.preventDefault();
  var subjectVal = (document.getElementById('cf-subject') || {}).value || '';
  var teamByTopic = {
    'Financing Options':  'info@nefnow.com',
    'Lease & Rental':     'info@oakwoodef.com',
    'Service & Repair':   'lakelandservice@nationwidehaul.com',
    'Municipality Bids':  'govbid@nationwidehaul.com'
  };
  var teamEmail = teamByTopic[subjectVal];
  var ccField = document.querySelector('#contactForm input[name="_cc"]');
  if (ccField) {
    ccField.value = teamEmail
      ? (teamEmail + ',marketing@nationwidehaul.com')
      : 'marketing@nationwidehaul.com';
  }
  submitFormAjax('contactForm', 'contactSuccess', 'contactError', '1f9d473f405e35b870b95b5cacd00809', '.contact-form__submit', 'Send Message \u2192', 'contact');
}

// ── Contact Form Topic Pre-fill ─────────────────────────
(function() {
  var topic;
  try { topic = new URLSearchParams(location.search).get('topic'); } catch (e) {}
  if (!topic) return;
  var topicMap = {
    'financing':    'Financing Options',
    'lease':        'Lease & Rental',
    'rental':       'Lease & Rental',
    'service':      'Service & Repair',
    'repair':       'Service & Repair',
    'municipality': 'Municipality Bids',
    'gov':          'Municipality Bids',
    'general':      'General Question'
  };
  var subjectVal = topicMap[topic.toLowerCase()] || null;
  if (!subjectVal) return;
  document.addEventListener('DOMContentLoaded', function() {
    var sel = document.getElementById('cf-subject');
    if (!sel) return;
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].text.trim() === subjectVal) { sel.selectedIndex = i; break; }
    }
  });
})();

// ── Lease/Rental Quote Form ─────────────────────────────
function lrSubmitQuote(e) {
  e.preventDefault();
  submitFormAjax('lrQuoteForm', 'lrQuoteSuccess', 'lrQuoteError', '1f9d473f405e35b870b95b5cacd00809', '.lr-form__submit', 'Send Quote Request \u2192', 'lease');
}

// ── Municipality Equipment Form ─────────────────────────
function municSubmitForm(e) {
  e.preventDefault();
  submitFormAjax('municEquipForm', 'municEquipSuccess', 'municEquipError', '1f9d473f405e35b870b95b5cacd00809', 'button[type="submit"]', 'Send Request to Government Sales Team \u2192', 'municipality');
}

// ── Sell Equipment Form ─────────────────────────────────
function sellEquipSubmit(e) {
  e.preventDefault();
  submitFormAjax('sellEquipForm', 'sellEquipSuccess', 'sellEquipError', '1f9d473f405e35b870b95b5cacd00809', 'button[type="submit"]', 'Submit Equipment Information \u2192', 'sell');
}

// ── DOT Inspection Form ─────────────────────────────────
function dotInspSubmit(e) {
  e.preventDefault();
  submitFormAjax('dotInspForm', 'dotInspSuccess', 'dotInspError', '1f9d473f405e35b870b95b5cacd00809', 'button[type="submit"]', 'Schedule My Free DOT Inspection \u2192', 'dot');
}
