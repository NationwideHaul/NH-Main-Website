/* ══════════════════════════════════════════════════════
   NATIONWIDE HAUL — Form Handlers
   ══════════════════════════════════════════════════════ */

// GoHighLevel inbound webhook — captures every lead straight into the CRM.
var GHL_LEAD_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/IEs4Gwg925sPu0AYNpdS/webhook-trigger/9baf6b13-b5b2-4724-8f60-c1bc65ce50c3';

// ── Form AJAX Helper ────────────────────────────────────
// Every lead is sent to TWO destinations so an outage in either never loses
// it:  (1) GoHighLevel inbound webhook → contact lands in the CRM + team
// alerts, and (2) FormSubmit → email notification to the team. The success
// message shows as soon as EITHER delivery succeeds; the error message only
// appears if BOTH fail.
function submitFormAjax(formId, successId, errorId, email, btnSelector, btnLabel, formType) {
  var form = document.getElementById(formId);
  var success = document.getElementById(successId);
  var error = document.getElementById(errorId);
  var btn = form.querySelector(btnSelector);
  btn.disabled = true;
  btn.textContent = 'Sending…';
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

  // Resolve to success on the first OK; only error once BOTH have failed.
  var settled = false;
  var remaining = 2;
  function onResult(ok) {
    if (ok && !settled) { settled = true; showSuccess(); return; }
    if (--remaining === 0 && !settled) { showError(); }
  }

  // 1) GoHighLevel — JSON payload (fields mapped in the GHL workflow).
  //    Drop FormSubmit control fields (_subject, _cc, _captcha, _honey, …).
  var payload = {};
  data.forEach(function(v, k) { if (k.charAt(0) !== '_') payload[k] = v; });
  if (formType) payload.form_type = formType;
  payload.source = 'Website Form';
  payload.page_url = location.href;
  payload.submitted_at = new Date().toISOString();
  fetch(GHL_LEAD_WEBHOOK, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(function(res) { onResult(res.ok); }).catch(function() { onResult(false); });

  // 2) FormSubmit — original FormData (kept as the email channel).
  fetch('https://formsubmit.co/ajax/' + email, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: data
  }).then(function(res) { onResult(res.ok); }).catch(function() { onResult(false); });
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
  submitFormAjax('contactForm', 'contactSuccess', 'contactError', '1f9d473f405e35b870b95b5cacd00809', '.contact-form__submit', 'Send Message →', 'contact');
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
  submitFormAjax('lrQuoteForm', 'lrQuoteSuccess', 'lrQuoteError', '1f9d473f405e35b870b95b5cacd00809', '.lr-form__submit', 'Send Quote Request →', 'lease');
}

// ── Municipality Equipment Form ─────────────────────────
function municSubmitForm(e) {
  e.preventDefault();
  submitFormAjax('municEquipForm', 'municEquipSuccess', 'municEquipError', '1f9d473f405e35b870b95b5cacd00809', 'button[type="submit"]', 'Send Request to Government Sales Team →', 'municipality');
}

// ── Sell Equipment Form ─────────────────────────────────
function sellEquipSubmit(e) {
  e.preventDefault();
  submitFormAjax('sellEquipForm', 'sellEquipSuccess', 'sellEquipError', '1f9d473f405e35b870b95b5cacd00809', 'button[type="submit"]', 'Submit Equipment Information →', 'sell');
}

// ── DOT Inspection Form ─────────────────────────────────
function dotInspSubmit(e) {
  e.preventDefault();
  submitFormAjax('dotInspForm', 'dotInspSuccess', 'dotInspError', '1f9d473f405e35b870b95b5cacd00809', 'button[type="submit"]', 'Schedule My Free DOT Inspection →', 'dot');
}
