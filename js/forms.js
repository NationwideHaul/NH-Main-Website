/* ══════════════════════════════════════════════════════
   NATIONWIDE HAUL — Form Handlers
   ══════════════════════════════════════════════════════ */

// Where the one-click fallback email is sent if a submission fails.
var FALLBACK_EMAIL = 'marketing@nationwidehaul.com';

var LEAD_FIELD_LABELS = {
  first_name: 'First Name', last_name: 'Last Name', email: 'Email', phone: 'Phone',
  subject: 'Subject', message: 'Message', notes: 'Notes', organization: 'Organization',
  equipment_type: 'Equipment Type', program_type: 'Program Type', duration: 'Duration',
  number_of_units: 'Number of Units', operating_region: 'Operating Region',
  equipment_details: 'Equipment Details', make: 'Make', model: 'Model', year: 'Year',
  miles_hours: 'Miles / Hours', accessories: 'Accessories', sale_method: 'Sale Method',
  vin: 'VIN', stock_number: 'Stock Number'
};

// Build a pre-filled mailto: link from the visitor's own form data so a failed
// submission can still reach the team in one click.
function buildLeadMailto(data, formType) {
  var lines = [];
  data.forEach(function(v, k) {
    if (!v || k.charAt(0) === '_') return;
    var label = LEAD_FIELD_LABELS[k] || k.replace(/_/g, ' ');
    lines.push(label + ': ' + v);
  });
  var subject = 'Website Lead' + (formType ? ' (' + formType + ')' : '') + ' — form failed to send';
  var body = 'Hi Nationwide Haul team,\n\n'
    + 'I tried to submit a form on nationwidehaul.com but it did not go through. '
    + 'Here are my details:\n\n'
    + lines.join('\n')
    + '\n\nPlease get back to me. Thanks!';
  return 'mailto:' + FALLBACK_EMAIL
    + '?subject=' + encodeURIComponent(subject)
    + '&body=' + encodeURIComponent(body);
}

// ── Form AJAX Helper ────────────────────────────────────
// Primary path: POST the lead to our own /api/notify function, which stores
// it in Supabase and emails the routed team inbox via Resend.
// Safety net: if /api/notify is unreachable or errors, we automatically retry
// through FormSubmit (the old path) so a lead is never lost.
// Last resort: if BOTH fail, the error box becomes a recovery box with two
// one-click options — call us, or send a pre-filled email to marketing@.
function submitFormAjax(formId, successId, errorId, email, btnSelector, btnLabel, formType) {
  var form = document.getElementById(formId);
  var success = document.getElementById(successId);
  var error = document.getElementById(errorId);
  var btn = form.querySelector(btnSelector);
  btn.disabled = true;
  btn.textContent = 'Sending…';
  if (error) error.style.display = 'none';

  var data = new FormData(form);
  // Stamp the source page so the notification email/CRM shows which form it came from.
  data.append('Page URL', location.origin + location.pathname);

  // Build a JSON payload for /api/notify from the same form data.
  var payload = { form_type: formType };
  data.forEach(function(v, k) { payload[k] = v; });

  function showSuccess() {
    form.style.display = 'none';
    success.style.display = 'block';
    var modal = form.closest('.modal, [data-modal]');
    if (modal) setTimeout(function() { modal.style.display = 'none'; }, 3000);
  }
  function showError() {
    btn.disabled = false;
    btn.textContent = btnLabel;
    if (!error) return;
    error.innerHTML =
      '<p style="font-size:15px;color:#b91c1c;font-weight:700;margin-bottom:6px;">Your request could not be sent right now.</p>'
      + '<p style="font-size:13px;color:#7f1d1d;margin-bottom:14px;">Please reach us directly and we will respond fast:</p>'
      + '<a href="tel:8775597039" style="display:inline-block;background:var(--red,#c0181c);color:#fff;font-weight:700;font-size:14px;padding:10px 18px;border-radius:8px;text-decoration:none;margin:0 6px 8px;">📞 Call (877) 559-7039</a>'
      + '<a href="' + buildLeadMailto(data, formType) + '" style="display:inline-block;background:#1a1a1a;color:#fff;font-weight:700;font-size:14px;padding:10px 18px;border-radius:8px;text-decoration:none;margin:0 6px 8px;">✉️ Email us your request</a>';
    error.style.display = 'block';
  }

  // Fallback path — the original FormSubmit delivery, used only if our
  // own API is unreachable or returns an error.
  function fallbackToFormSubmit() {
    fetch('https://formsubmit.co/ajax/' + email, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    }).then(function(res) {
      res.ok ? showSuccess() : showError();
    }).catch(showError);
  }

  // Primary path — our own serverless function (Supabase + Resend).
  // Trailing slash matches vercel.json trailingSlash:true (avoids a 307 hop).
  fetch('/api/notify/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(function(res) {
    res.ok ? showSuccess() : fallbackToFormSubmit();
  }).catch(fallbackToFormSubmit);
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
  submitFormAjax('contactForm', 'contactSuccess', 'contactError', '1f9d473f405e35b870b95b5cacd00809', '.contact-form__submit', 'Get Started →', 'contact');
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
  submitFormAjax('lrQuoteForm', 'lrQuoteSuccess', 'lrQuoteError', '1f9d473f405e35b870b95b5cacd00809', '.lr-form__submit', 'Get Started →', 'lease');
}

// ── Municipality Equipment Form ─────────────────────────
function municSubmitForm(e) {
  e.preventDefault();
  submitFormAjax('municEquipForm', 'municEquipSuccess', 'municEquipError', '1f9d473f405e35b870b95b5cacd00809', 'button[type="submit"]', 'Get Started →', 'municipality');
}

// ── Sell Equipment Form ─────────────────────────────────
function sellEquipSubmit(e) {
  e.preventDefault();
  submitFormAjax('sellEquipForm', 'sellEquipSuccess', 'sellEquipError', '1f9d473f405e35b870b95b5cacd00809', 'button[type="submit"]', 'Get Started →', 'sell');
}

// ── DOT Inspection Form ─────────────────────────────────
function dotInspSubmit(e) {
  e.preventDefault();
  submitFormAjax('dotInspForm', 'dotInspSuccess', 'dotInspError', '1f9d473f405e35b870b95b5cacd00809', 'button[type="submit"]', 'Get Started →', 'dot');
}
