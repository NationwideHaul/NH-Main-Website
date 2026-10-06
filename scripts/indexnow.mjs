// Pings IndexNow (Bing, Yandex, Seznam, Naver…) with URLs from the LIVE sitemap.
// ChatGPT search and Copilot are powered by Bing, so this gets new/updated pages
// in front of them within hours instead of weeks.
//
//   node scripts/indexnow.mjs            # URLs whose <lastmod> is within the last 8 days
//   node scripts/indexnow.mjs --all      # every URL in the sitemap
//   node scripts/indexnow.mjs <url> ...  # specific URLs
//
// Run only AFTER the change is live on www.nationwidehaul.com (merged + deployed).

import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOST = 'www.nationwidehaul.com';
const keyFile = (await readdir(root)).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error('IndexNow key file (<32 hex>.txt) missing at repo root');
const key = (await readFile(path.join(root, keyFile), 'utf8')).trim();

const args = process.argv.slice(2);
let urls;
if (args.length && args[0] !== '--all') {
  urls = args;
} else {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  const entries = [...xml.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)];
  const cutoff = Date.now() - 8 * 864e5;
  urls = entries.filter(([, , d]) => args[0] === '--all' || Date.parse(d) >= cutoff).map(([, u]) => u);
}
if (!urls.length) { console.log('Nothing new to submit.'); process.exit(0); }

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${keyFile}`, urlList: urls })
});
console.log(`IndexNow ${res.status} ${res.statusText} — ${urls.length} URL(s)`);
if (res.status >= 300) process.exit(1);
