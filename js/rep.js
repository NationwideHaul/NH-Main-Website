/* ══════════════════════════════════════════════════════
   NATIONWIDE HAUL — Sales rep landing pages (/team/<slug>/)
   The lead form itself is handled in forms.js (repLeadSubmit).
   ══════════════════════════════════════════════════════ */

(function() {
  var body = document.body;
  var rep = {
    slug: body.dataset.rep,
    name: body.dataset.repName,
    title: body.dataset.repTitle,
    phone: body.dataset.repPhone,
    email: body.dataset.repEmail
  };

  // ── Campaign tracking: copy utm_* from the link into the form ──
  // Reps can share e.g. /team/justin-brooks/?utm_source=linkedin&utm_campaign=fleet-oct
  // and the source shows up on the lead email + in nh_leads.
  var params;
  try { params = new URLSearchParams(location.search); } catch (e) { params = null; }
  var form = document.getElementById('repLeadForm');
  if (params && form) {
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach(function(k) {
      var input = form.querySelector('input[name="' + k + '"]');
      if (input && params.get(k)) input.value = params.get(k).slice(0, 120);
    });
  }

  // ── GTM events for every call / text / quote click ──
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', function(e) {
    var el = e.target.closest('[data-rep-cta]');
    if (!el) return;
    window.dataLayer.push({ event: 'rep_cta_click', rep: rep.slug, cta: el.getAttribute('data-rep-cta') });
  });

  // ── "Save My Contact" → downloads a vCard for the phone's contacts app ──
  var saveBtn = document.getElementById('repSaveContact');
  if (saveBtn) saveBtn.addEventListener('click', function() {
    var parts = rep.name.split(' ');
    var lines = [
      'BEGIN:VCARD', 'VERSION:3.0',
      'N:' + parts.slice(1).join(' ') + ';' + parts[0] + ';;;',
      'FN:' + rep.name,
      'ORG:Nationwide Haul',
      'TITLE:' + rep.title,
      'TEL;TYPE=WORK,VOICE:+1' + rep.phone,
      rep.email ? 'EMAIL;TYPE=WORK:' + rep.email : '',
      'URL:' + location.origin + location.pathname,
      'ADR;TYPE=WORK:;;5021 Frontage Road N.;Lakeland;FL;33810;USA',
      'END:VCARD'
    ].filter(Boolean);
    var blob = new Blob([lines.join('\r\n')], { type: 'text/vcard' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = rep.name.replace(/\s+/g, '-') + '-Nationwide-Haul.vcf';
    document.body.appendChild(a);
    a.click();
    setTimeout(function() { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  });

  // ── Hide the mobile sticky bar while the form is on screen ──
  var sticky = document.querySelector('.rep-sticky');
  var card = document.getElementById('rep-quote');
  if (sticky && card && 'IntersectionObserver' in window) {
    new IntersectionObserver(function(entries) {
      sticky.classList.toggle('is-hidden', entries[0].isIntersecting);
    }, { threshold: 0.15 }).observe(card);
  }
})();
