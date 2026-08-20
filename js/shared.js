/* ══════════════════════════════════════════════════════
   NATIONWIDE HAUL — Shared JavaScript
   Loaded on every page
   ══════════════════════════════════════════════════════ */

// ── Lazy loading & image performance ─────────────────────
(function(){
  document.querySelectorAll('img').forEach(function(img){
    img.decoding = 'async';
    if (!img.closest('.site-logo') && !img.closest('.hero')) {
      img.loading = 'lazy';
    }
  });
})();

// ── Mobile nav ──────────────────────────────────────────
document.querySelector('.nav-toggle').addEventListener('click', function() {
  document.querySelector('.site-nav').classList.toggle('is-open');
});

// ── Floating Glass Header: scroll-based sticky ────────────
(function() {
  var header = document.querySelector('.site-header');
  if (!header) return;
  function checkSticky() {
    if (window.innerWidth > 768) { header.classList.remove('is-scrolled'); return; }
    var topBar = document.querySelector('.top-bar');
    var threshold = topBar ? topBar.offsetHeight + 12 : 50;
    if (window.pageYOffset > threshold) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) { requestAnimationFrame(function() { checkSticky(); ticking = false; }); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', checkSticky);
  checkSticky();
})();

// ── NAV DROPDOWN ────────────────────────────────────────
function toggleDropdown(id) {
  var el = document.getElementById(id);
  var isOpen = el.classList.contains('is-open');
  document.querySelectorAll('.nav-dropdown').forEach(function(d){ d.classList.remove('is-open'); });
  if (!isOpen) el.classList.add('is-open');
}
document.addEventListener('click', function(e) {
  if (!e.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.nav-dropdown').forEach(function(d){ d.classList.remove('is-open'); });
  }
});

// ── Scroll progress bar ─────────────────────────────────
(function() {
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  window.addEventListener('scroll', function() {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = (scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0) + '%';
  }, { passive: true });
})();

// ── Newsletter Submission (double opt-in + anti-spam) ────
// Posts to our own /api/newsletter serverless function, which enforces
// honeypot, time-trap, Turnstile, validation, and rate limiting, then
// sends a confirmation email. The subscriber is only added to the list
// after they click the link in that email.

// ↓↓↓ PASTE YOUR CLOUDFLARE TURNSTILE **SITE KEY** HERE ↓↓↓
// Leave as-is (empty) and the form still works — Turnstile just stays
// off until you add the key. Get it at: dash.cloudflare.com → Turnstile.
var TURNSTILE_SITE_KEY = '';
// ↑↑↑ (This is the PUBLIC site key. The secret key goes in Vercel env vars.) ↑↑↑

// Turnstile widget ids, keyed by form, so we can read/reset per form.
var _nhTurnstile = new WeakMap();

(function initNewsletterForms() {
  var forms = document.querySelectorAll('form.footer__newsletter');
  if (!forms.length) return;

  // Stamp each form's load time for the server-side time-trap.
  forms.forEach(function(form) { form.dataset.loadedAt = String(Date.now()); });

  if (!TURNSTILE_SITE_KEY) return; // no key yet → skip Turnstile entirely

  // Load the Turnstile script once, then explicitly render a widget in
  // each form's captcha container.
  window.onloadTurnstileCallback = function() {
    forms.forEach(function(form) {
      var holder = form.querySelector('.footer__nl-captcha');
      if (!holder || !window.turnstile) return;
      var id = window.turnstile.render(holder, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'dark',
        appearance: 'interaction-only' // invisible unless a challenge is needed
      });
      _nhTurnstile.set(form, id);
    });
  };
  var s = document.createElement('script');
  s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
  s.async = true; s.defer = true;
  document.head.appendChild(s);
})();

function ghlNewsletterSubmit(e, form) {
  e.preventDefault();
  var input = form.querySelector('input[type="email"]');
  var email = input.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    input.focus();
    input.style.borderColor = '#ef4444';
    return;
  }
  input.style.borderColor = '';
  var btn = form.querySelector('button');
  btn.disabled = true;
  var originalBtnText = btn.textContent;
  btn.textContent = '...';

  var honey = form.querySelector('input[name="_hp"]');
  var tsId = _nhTurnstile.get(form);
  var tsToken = (window.turnstile && tsId != null) ? window.turnstile.getResponse(tsId) : '';

  var payload = {
    email: email,
    source: 'Footer Newsletter Form',
    site: 'nationwidehaul.com',
    page_url: location.href,
    submitted_at: new Date().toISOString(),
    _hp: honey ? honey.value : '',                                 // honeypot
    elapsed_ms: Date.now() - Number(form.dataset.loadedAt || 0),   // time-trap
    'cf-turnstile-response': tsToken                               // Turnstile token
  };

  fetch('/api/newsletter/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(function(res) {
    return res.json().catch(function(){ return {}; }).then(function(data) {
      return { ok: res.ok, data: data };
    });
  })
  .then(function(r) {
    if (!r.ok) throw new Error((r.data && r.data.error) || 'HTTP error');
    form.style.display = 'none';
    var cap = form.parentNode.querySelector('.footer__nl-captcha');
    if (cap) cap.style.display = 'none';
    var ok = form.parentNode.querySelector('.footer__nl-ok');
    if (ok) ok.style.display = 'block';
  })
  .catch(function(err) {
    console.error('Newsletter subscribe failed:', err);
    btn.disabled = false;
    btn.textContent = originalBtnText;
    input.style.borderColor = '#ef4444';
    if (window.turnstile && tsId != null) window.turnstile.reset(tsId);
    alert((err && err.message && err.message !== 'HTTP error')
      ? err.message
      : "Sorry, something went wrong. Please try again or email us at operations@nationwidehaul.com");
  });
}

// ── Intercom Chat Widget ────────────────────────────────
window.intercomSettings = {
  api_base: "https://api-iam.intercom.io",
  app_id: "v4qbge05",
};
(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/v4qbge05';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();

// ── Cookie Consent Banner ───────────────────────────────
(function () {
  var STORAGE_KEY = 'nh-cookie-consent';
  var banner = document.getElementById('nhCookieBanner');
  if (!banner) return;

  function setConsent(choice) {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
      localStorage.setItem(STORAGE_KEY + '-date', new Date().toISOString());
    } catch (e) {}
    banner.classList.remove('is-visible');
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'cookie_consent_update',
        consent: choice
      });
    }
  }

  var existing = null;
  try { existing = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  if (!existing) {
    setTimeout(function () { banner.classList.add('is-visible'); }, 900);
  }

  document.getElementById('nhCookieAccept').addEventListener('click', function () { setConsent('all'); });
  document.getElementById('nhCookieReject').addEventListener('click', function () { setConsent('essential'); });
  document.getElementById('nhCookieClose').addEventListener('click', function () { setConsent('essential'); });
})();
