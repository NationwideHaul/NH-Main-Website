// Generates the sales rep landing pages: team/<slug>/index.html
//
//   node scripts/build-rep-pages.mjs
//
// Data:     api/_lib/reps.js   (same roster api/notify.js routes leads with)
// Template: scripts/rep-template.html  ({{TOKEN}} placeholders)
// Photos:   team/photos/<slug>.jpg  (square-ish, ~800px, <200KB)
//
// The generated pages are committed, so Vercel needs no build step.

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { REPS, MAIN_PHONE } from '../api/_lib/reps.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const template = await readFile(path.join(root, 'scripts/rep-template.html'), 'utf8');

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

const fmtPhone = (d) => d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : d;

const SMS_ICON = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>';

for (const [slug, rep] of Object.entries(REPS)) {
  const phone = (rep.phone || MAIN_PHONE).replace(/\D/g, '');
  const sms = rep.sms && rep.phone;
  const first = esc(rep.first);

  const tokens = {
    SLUG: slug,
    NAME: esc(rep.name),
    FIRST: first,
    TITLE: esc(rep.title),
    HEADLINE: esc(rep.headline),
    BIO: esc(rep.bio),
    EMAIL: esc(rep.email || ''),
    PHONE_TEL: phone,
    PHONE_DISPLAY: fmtPhone(phone),
    SPECIALTIES: rep.specialties.map((s) => `<li>${esc(s)}</li>`).join('\n          '),
    SMS_BUTTON: sms
      ? `<a href="sms:${phone}" class="rep-btn rep-btn--dark" data-rep-cta="hero_text">${SMS_ICON} Text ${first}</a>`
      : '',
    SMS_STICKY: sms ? `<a href="sms:${phone}" data-rep-cta="sticky_text">${SMS_ICON} Text</a>` : ''
  };

  const html = template.replace(/\{\{([A-Z_]+)\}\}/g, (m, key) => {
    if (!(key in tokens)) throw new Error(`Unknown template token ${m}`);
    return tokens[key];
  });

  try {
    await access(path.join(root, `team/photos/${slug}.jpg`));
  } catch {
    console.warn(`⚠  missing photo: team/photos/${slug}.jpg`);
  }

  const outDir = path.join(root, 'team', slug);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'index.html'), html);
  console.log(`✓ /team/${slug}/${rep.email ? '' : '   (no email set → leads go to marketing@)'}`);
}
