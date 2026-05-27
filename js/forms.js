/* ══════════════════════════════════════════════════════
   NATIONWIDE HAUL — Form Handlers
   ══════════════════════════════════════════════════════ */

// ── FormSubmit AJAX Helper ──────────────────────────────
function submitFormAjax(formId, successId, errorId, email, btnSelector, btnLabel) {
  var form = document.getElementById(formId);
  var success = document.getElementById(successId);
  var error = document.getElementById(errorId);
  var btn = form.querySelector(btnSelector);
  btn.disabled = true;
  btn.textContent = 'Sending\u2026';
  if (error) error.style.display = 'none';
  var data = new FormData(form);
  fetch('https://formsubmit.co/ajax/' + email, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: data
  }).then(function(res) {
    if (res.ok) {
      form.style.display = 'none';
      success.style.display = 'block';
      var modal = form.closest('.modal, [data-modal]');
      if (modal) setTimeout(function() { modal.style.display = 'none'; }, 3000);
    } else {
      btn.disabled = false;
      btn.textContent = btnLabel;
      if (error) error.style.display = 'block';
    }
  }).catch(function() {
    btn.disabled = false;
    btn.textContent = btnLabel;
    if (error) error.style.display = 'block';
  });
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
  submitFormAjax('contactForm', 'contactSuccess', 'contactError', '1f9d473f405e35b870b95b5cacd00809', '.contact-form__submit', 'Send Message \u2192');
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
  submitFormAjax('lrQuoteForm', 'lrQuoteSuccess', 'lrQuoteError', '1f9d473f405e35b870b95b5cacd00809', '.lr-form__submit', 'Send Quote Request \u2192');
}

// ── Municipality Equipment Form ─────────────────────────
function municSubmitForm(e) {
  e.preventDefault();
  submitFormAjax('municEquipForm', 'municEquipSuccess', 'municEquipError', '1f9d473f405e35b870b95b5cacd00809', 'button[type="submit"]', 'Send Request to Government Sales Team \u2192');
}

// ── Sell Equipment Form ─────────────────────────────────
function sellEquipSubmit(e) {
  e.preventDefault();
  submitFormAjax('sellEquipForm', 'sellEquipSuccess', 'sellEquipError', '1f9d473f405e35b870b95b5cacd00809', 'button[type="submit"]', 'Submit Equipment Information \u2192');
}

// ── DOT Inspection Form ─────────────────────────────────
function dotInspSubmit(e) {
  e.preventDefault();
  submitFormAjax('dotInspForm', 'dotInspSuccess', 'dotInspError', '1f9d473f405e35b870b95b5cacd00809', 'button[type="submit"]', 'Schedule My Free DOT Inspection \u2192');
}
