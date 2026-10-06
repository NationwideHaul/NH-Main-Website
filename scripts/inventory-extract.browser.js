// Run in a REAL browser tab (Claude in Chrome javascript tool) on
//   https://inventory.nationwidehaul.com/inventory/?/listings/for-sale/equipment/all?bgn=Nationwide+Haul+Web&dlr=1&settingscrmid=16824364
// (Sandhills blocks curl/bots with Cloudflare, so this can't run from Node.)
// It walks every results page, reads the Product/AggregateOffer JSON-LD and returns
// the JSON to paste into data/inventory-prices.json. Then:
//   node scripts/build-content-pages.mjs && node scripts/build-sitemap.mjs
// Output can be long — if the tool truncates, read window.__nhOut in slices.
(async () => {
  const base = location.href.replace(/&page=\d+/, '');
  const parse = (html) => {
    const d = new DOMParser().parseFromString(html, 'text/html');
    const j = [...d.querySelectorAll('script[type="application/ld+json"]')]
      .map((s) => { try { return JSON.parse(s.textContent); } catch { return null; } })
      .find((x) => x && x.offers);
    return (j?.offers?.offers || []).map((o) => {
      const i = o.itemOffered || {};
      return { name: i.name || '', cat: i.category || '', mfr: typeof i.manufacturer === 'object' ? i.manufacturer?.name : i.manufacturer,
        cond: (i.itemCondition || '').split('/').pop().replace('Condition', ''), price: +o.price };
    });
  };
  const rows = [];
  for (let p = 1; p <= 40; p++) {
    const r = parse(await (await fetch(`${base}&page=${p}`, { credentials: 'include' })).text());
    if (!r.length) break;
    rows.push(...r);
  }
  const total = +((document.body.innerText.match(/([\d,]+)\s+Listings/i) || [])[1] || '0').replace(/,/g, '');
  const year = new Date().getFullYear();
  const excluded = [];
  const g = {};
  for (const r of rows) {
    const y = +(r.name.match(/^(\d{4})/) || [])[1] || 0;
    if (!r.price) continue;
    if (r.cond === 'Used' && y > year) { excluded.push(`${r.name} listed as Used (likely listing error)`); continue; }
    const k = `${r.cat}|${r.cond}`;
    const o = (g[k] ??= { c: r.cat, k: r.cond, p: [], y: [], m: new Set() });
    o.p.push(r.price); if (y) o.y.push(y); if (r.mfr) o.m.add(r.mfr);
  }
  const med = (a) => { a = [...a].sort((x, z) => x - z); const h = a.length >> 1; return a.length % 2 ? a[h] : Math.round((a[h - 1] + a[h]) / 2); };
  const groups = Object.values(g).sort((a, b) => b.p.length - a.p.length)
    .map((v) => [v.c, v.k, v.p.length, Math.min(...v.p), med(v.p), Math.max(...v.p), Math.min(...v.y), Math.max(...v.y), [...v.m].join('/')]);
  window.__nhOut = JSON.stringify({ snapshot: new Date().toISOString().slice(0, 10), source: 'https://inventory.nationwidehaul.com/ (Product/AggregateOffer JSON-LD, all pages)',
    listings_total: total, priced_units: groups.reduce((s, x) => s + x[2], 0), excluded, groups }, null, 2);
  return window.__nhOut;
})();
