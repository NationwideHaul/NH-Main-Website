// Generates the content pages (locations + resources) from scripts/content-pages.mjs
//
//   node scripts/build-content-pages.mjs && node scripts/build-sitemap.mjs
//
// Chrome (head assets, top bar, header/nav, footer, cookie banner) is copied
// from trailers/dry-vans/index.html so these pages always match the live design.
// Only <title>, meta, canonical, OG/Twitter, JSON-LD and <main> are generated.
//
// The generated pages are committed, so Vercel needs no build step.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { PAGES, SITE, OG_IMAGE } from './content-pages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const chrome = await readFile(path.join(root, 'trailers/dry-vans/index.html'), 'utf8');

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const [headPart, rest] = chrome.split('<main id="main-content">');
const footPart = rest.slice(rest.indexOf('</main>') + '</main>'.length);

for (const page of PAGES) {
  const url = SITE + page.path;
  const crumbs = [{ name: 'Home', path: '/' }, ...page.crumbs];

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: SITE + c.path }))
  };
  const ld = [breadcrumbLd, ...(page.schema || [])];
  if (page.faq?.length) {
    ld.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } }))
    });
  }
  const ldHtml = ld.map((o) => `  <script type="application/ld+json">\n  ${JSON.stringify(o, null, 2).replace(/\n/g, '\n  ')}\n  </script>`).join('\n');

  let head = headPart
    .replace(/<title>.*?<\/title>/, `<title>${esc(page.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(page.description)}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(page.title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(page.description)}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<meta property="og:image" content=")[^"]*/, `$1${OG_IMAGE}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${esc(page.title)}`)
    .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${esc(page.description)}`)
    .replace(/(<meta name="twitter:image" content=")[^"]*/, `$1${OG_IMAGE}`)
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
    .replace('</head>', `${ldHtml}\n</head>`);
  if (page.ogType) head = head.replace(/(<meta property="og:type" content=")[^"]*/, `$1${page.ogType}`);

  const crumbHtml = crumbs.map((c, i) => i === crumbs.length - 1
    ? `<span class="tt-breadcrumb__current">${esc(c.name)}</span>`
    : `<a href="${c.path}">${esc(c.name)}</a>`).join('<span>/</span>');

  const faqHtml = page.faq?.length ? `
<!-- FAQ -->
<section class="tt-section tt-section--gray"><div class="container"><div class="tt-section__inner">
  <h2>Frequently Asked Questions</h2>
${page.faq.map(([q, a]) => `  <h3>${esc(q)}</h3>\n  <p>${a}</p>`).join('\n')}
</div></div></section>
` : '';

  const main = `<main id="main-content">

<!-- BREADCRUMB -->
<nav class="tt-breadcrumb" aria-label="Breadcrumb">
  <div class="container">
    ${crumbHtml}
  </div>
</nav>

<!-- HERO -->
<section class="oem-hero"><div class="container">
  <h1>${esc(page.h1)}</h1>
  <p>${page.lede}</p>
</div></section>
${page.body}${faqHtml}
<!-- CTA -->
<section class="oem-cta"><div class="container">
  <h2>${esc(page.cta?.title || 'Ready to Talk Equipment?')}</h2>
  <p>${page.cta?.text || 'Browse current new and used inventory, or talk to a sales rep about financing, leasing and nationwide delivery.'}</p>
  <div class="oem-cta__btns">
    <a href="https://inventory.nationwidehaul.com/inventory/?/listings/for-sale/equipment/all?bgn=Nationwide+Haul+Web&amp;dlr=1&amp;settingscrmid=16824364" style="background:var(--red);color:#fff;">View Inventory</a>
    <a href="/contact/" style="border:2px solid rgba(255,255,255,0.5);color:#fff;">Contact Sales</a>
  </div>
  <div class="tt-cta-links">
    <a href="/financing/">Explore Financing</a>
    <a href="/lease/">Leasing &amp; Rental</a>
    <a href="tel:8775597039">(877) 559-7039</a>
  </div>
</div></section>

</main>`;

  const outDir = path.join(root, page.path);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'index.html'), head + main + footPart);
  console.log(`✓ ${page.path}`);
}
