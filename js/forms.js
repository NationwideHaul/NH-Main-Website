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

// ── Anti-spam setup for lead forms ──────────────────────
// Stamps each form's load time (server-side time-trap) and, once a
// Turnstile site key is set in js/shared.js, renders a visible
// "Verify you are human" checkbox above the submit button. shared.js loads the
// Turnstile script on every page (for the footer newsletter), so we just
// wait for window.turnstile to appear.
var LEAD_FORM_IDS = ['contactForm', 'lrQuoteForm', 'municEquipForm', 'sellEquipForm', 'dotInspForm', 'repLeadForm'];
var _nhLeadTurnstile = {};

(function initLeadForms() {
  function setup() {
    var forms = LEAD_FORM_IDS.map(function(id) { return document.getElementById(id); }).filter(Boolean);
    if (!forms.length) return;
    forms.forEach(function(form) { form.dataset.loadedAt = String(Date.now()); });

    if (typeof TURNSTILE_SITE_KEY === 'undefined' || !TURNSTILE_SITE_KEY) return;
    var tries = 0;
    var timer = setInterval(function() {
      if (!window.turnstile && ++tries < 50) return;
      clearInterval(timer);
      if (!window.turnstile) return;
      forms.forEach(function(form) {
        var btn = form.querySelector('button[type="submit"]');
        var holder = document.createElement('div');
        holder.className = 'lead-form__captcha';
        holder.style.margin = '0 0 12px';
        btn ? btn.parentNode.insertBefore(holder, btn) : form.appendChild(holder);
        _nhLeadTurnstile[form.id] = window.turnstile.render(holder, {
          sitekey: TURNSTILE_SITE_KEY,
          size: 'flexible',
          appearance: 'always' // visible "Verify you are human" checkbox
        });
      });
    }, 200);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();

// ── Form AJAX Helper ────────────────────────────────────
// POSTs the lead to our own /api/notify function, which runs the anti-spam
// checks, stores it in Supabase and emails the routed team inbox via Resend.
// If it fails, the error box becomes a recovery box with two one-click
// options — call us, or send a pre-filled email to marketing@.
// (The old FormSubmit fallback was removed: its public token let bots skip
// every spam check.)
function submitFormAjax(formId, successId, errorId, btnSelector, btnLabel, formType, onSuccess) {
  var form = document.getElementById(formId);
  var success = document.getElementById(successId);
  var error = document.getElementById(errorId);
  var btn = form.querySelector(btnSelector);
  var tsId = _nhLeadTurnstile[formId];
  if (window.turnstile && tsId != null && !window.turnstile.getResponse(tsId)) {
    if (error) {
      error.innerHTML = '<p style="font-size:14px;color:#b91c1c;font-weight:700;">Please check the "Verify you are human" box above the button.</p>';
      error.style.display = 'block';
    }
    return;
  }
  btn.disabled = true;
  btn.textContent = 'Sending…';
  if (error) error.style.display = 'none';

  var data = new FormData(form);
  // Stamp the source page so the notification email/CRM shows which form it came from.
  data.append('Page URL', location.origin + location.pathname);

  // Build a JSON payload for /api/notify from the same form data.
  var payload = { form_type: formType };
  data.forEach(function(v, k) { payload[k] = v; });
  payload.elapsed_ms = Date.now() - Number(form.dataset.loadedAt || Date.now());
  if (window.turnstile && tsId != null) payload['cf-turnstile-response'] = window.turnstile.getResponse(tsId);

  function showSuccess() {
    form.style.display = 'none';
    success.style.display = 'block';
    if (onSuccess) onSuccess();
    var modal = form.closest('.modal, [data-modal]');
    if (modal) setTimeout(function() { modal.style.display = 'none'; }, 3000);
  }
  function showError(msg) {
    btn.disabled = false;
    btn.textContent = btnLabel;
    if (window.turnstile && tsId != null) window.turnstile.reset(tsId);
    if (!error) return;
    error.innerHTML =
      '<p style="font-size:15px;color:#b91c1c;font-weight:700;margin-bottom:6px;">' + (msg || 'Your request could not be sent right now.') + '</p>'
      + '<p style="font-size:13px;color:#7f1d1d;margin-bottom:14px;">Please reach us directly and we will respond fast:</p>'
      + '<a href="tel:8775597039" style="display:inline-block;background:var(--red,#c0181c);color:#fff;font-weight:700;font-size:14px;padding:10px 18px;border-radius:8px;text-decoration:none;margin:0 6px 8px;">📞 Call (877) 559-7039</a>'
      + '<a href="' + buildLeadMailto(data, formType) + '" style="display:inline-block;background:#1a1a1a;color:#fff;font-weight:700;font-size:14px;padding:10px 18px;border-radius:8px;text-decoration:none;margin:0 6px 8px;">✉️ Email us your request</a>';
    error.style.display = 'block';
  }

  // Trailing slash matches vercel.json trailingSlash:true (avoids a 307 hop).
  fetch('/api/notify/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(function(res) {
    if (res.ok) return showSuccess();
    // 400 (verification) / 429 (rate limit) carry a human-readable message.
    return res.json().catch(function() { return {}; }).then(function(d) {
      showError(res.status === 400 || res.status === 429 ? d.error : null);
    });
  }).catch(function() { showError(); });
}

// ── Contact Form ────────────────────────────────────────
function handleContactSubmit(e) {
  e.preventDefault();
  submitFormAjax('contactForm', 'contactSuccess', 'contactError', '.contact-form__submit', 'Get Started →', 'contact');
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
  submitFormAjax('lrQuoteForm', 'lrQuoteSuccess', 'lrQuoteError', '.lr-form__submit', 'Get Started →', 'lease');
}

// ── Municipality Equipment Form ─────────────────────────
function municSubmitForm(e) {
  e.preventDefault();
  submitFormAjax('municEquipForm', 'municEquipSuccess', 'municEquipError', 'button[type="submit"]', 'Get Started →', 'municipality');
}

// ── Sell Equipment Form ─────────────────────────────────
function sellEquipSubmit(e) {
  e.preventDefault();
  submitFormAjax('sellEquipForm', 'sellEquipSuccess', 'sellEquipError', 'button[type="submit"]', 'Get Started →', 'sell');
}

// ── DOT Inspection Form ─────────────────────────────────
function dotInspSubmit(e) {
  e.preventDefault();
  submitFormAjax('dotInspForm', 'dotInspSuccess', 'dotInspError', 'button[type="submit"]', 'Get Started →', 'dot');
}

// ── Sales Rep Landing Page Form (/team/<slug>/) ─────────
// The hidden `rep` field carries the slug; api/notify.js maps it to the
// rep's inbox server-side.
function repLeadSubmit(e) {
  e.preventDefault();
  var form = document.getElementById('repLeadForm');
  var btnLabel = form.querySelector('.rep-form__submit').textContent;
  submitFormAjax('repLeadForm', 'repLeadSuccess', 'repLeadError', '.rep-form__submit', btnLabel, 'rep', function() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'generate_lead', form_type: 'rep', rep: form.elements.rep.value });
  });
}
