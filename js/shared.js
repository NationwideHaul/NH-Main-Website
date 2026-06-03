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

// ── GHL Newsletter Submission ───────────────────────────
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

  var payload = {
    email: email,
    source: 'Footer Newsletter Form',
    site: 'nationwidehaul.com',
    page_url: location.href,
    submitted_at: new Date().toISOString(),
    sms_email_consent: 'yes'
  };

  fetch('https://services.leadconnectorhq.com/hooks/IEs4Gwg925sPu0AYNpdS/webhook-trigger/9baf6b13-b5b2-4724-8f60-c1bc65ce50c3', {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(function(res) {
    if (!res.ok) throw new Error('webhook failed: HTTP ' + res.status);
    form.style.display = 'none';
    var ok = form.nextElementSibling;
    if (ok) ok.style.display = 'block';
  })
  .catch(function(err) {
    console.error('Newsletter subscribe failed:', err);
    btn.disabled = false;
    btn.textContent = originalBtnText;
    input.style.borderColor = '#ef4444';
    alert("Sorry, something went wrong. Please try again or email us at operations@nationwidehaul.com");
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
