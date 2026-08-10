// ─────────────────────────────────────────────────────────────
// Shared helpers for the newsletter double-opt-in flow.
// Files/folders under /api that start with "_" are NOT exposed as
// routes by Vercel, so this is a safe place for shared code.
// ─────────────────────────────────────────────────────────────
import crypto from 'node:crypto';

// The GoHighLevel (LeadConnector) webhook the confirmed subscriber is
// finally pushed to. Overridable via env; falls back to the existing URL.
export const GHL_WEBHOOK =
  process.env.GHL_NEWSLETTER_WEBHOOK ||
  'https://services.leadconnectorhq.com/hooks/IEs4Gwg925sPu0AYNpdS/webhook-trigger/9baf6b13-b5b2-4724-8f60-c1bc65ce50c3';

// ── Email-to-SMS / MMS carrier gateways (spam magnets) ───────────
// Matched on the exact domain (or a sub-domain of it).
const SMS_GATEWAYS = new Set([
  'vtext.com', 'vzwpix.com',                       // Verizon
  'txt.att.net', 'mms.att.net', 'cingularme.com',  // AT&T
  'tmomail.net',                                   // T-Mobile
  'messaging.sprintpcs.com', 'pm.sprint.com',      // Sprint
  'mymetropcs.com', 'metropcs.sms.us',             // MetroPCS
  'myboostmobile.com', 'sms.myboostmobile.com',    // Boost
  'sms.cricketwireless.net', 'mms.cricketwireless.net', 'mmsmtp.cricketwireless.net', // Cricket
  'msg.fi.google.com',                             // Google Fi
  'email.uscc.net', 'mms.uscc.net',                // US Cellular
  'vmobl.com', 'vmpix.com',                        // Virgin Mobile
  'mailmymobile.net', 'text.republicwireless.com', // misc
  'sms.mint.com', 'mailmymobile.net', 'qwestmp.com', 'txt.bell.ca', 'pcs.rogers.com',
  'msg.telus.com', 'fido.ca', 'txt.freedommobile.ca'
]);

// ── Disposable / throwaway inbox providers ───────────────────────
// These rotate through many domains, so we match on a keyword being
// present anywhere in the domain (e.g. "mailinator2.com", "grr.la").
const DISPOSABLE_KEYWORDS = [
  'mailinator', 'yopmail', 'guerrillamail', 'guerrilla', 'grr.la',
  '10minutemail', '10minute', 'tempmail', 'temp-mail', 'tmpmail',
  'trashmail', 'trash-mail', 'sharklasers', 'getnada', 'nada',
  'maildrop', 'dispostable', 'fakeinbox', 'throwaway', 'throwawaymail',
  'mailnesia', 'mohmal', 'moakt', 'emailondeck', 'spamgourmet',
  'discard.email', 'mailcatch', 'mintemail', 'einrot', 'getairmail',
  'yopmail.fr', 'jetable', 'mytemp', 'burnermail'
];

/**
 * Validate an email against format, dot-trick, SMS gateways, and
 * disposable providers. Returns { ok:true, email } on success or
 * { ok:false, reason } on rejection. `email` is normalized (trimmed,
 * lowercased).
 */
export function validateEmail(raw) {
  const email = String(raw || '').trim().toLowerCase();

  if (!email) return { ok: false, reason: 'empty' };
  if (email.length > 254) return { ok: false, reason: 'too_long' };

  // Basic syntax: local@domain.tld with a plausible alphabetic TLD.
  const m = email.match(/^([^\s@]+)@([^\s@]+\.[^\s@]+)$/);
  if (!m) return { ok: false, reason: 'format' };

  const local = m[1];
  const domain = m[2];

  // TLD must look real: 2–24 letters, no digits/hyphens.
  const tld = domain.split('.').pop();
  if (!/^[a-z]{2,24}$/.test(tld)) return { ok: false, reason: 'tld' };

  // Consecutive dots are invalid anywhere in a normal address.
  if (email.includes('..')) return { ok: false, reason: 'format' };
  // A leading/trailing dot in the local part is invalid too.
  if (local.startsWith('.') || local.endsWith('.')) return { ok: false, reason: 'format' };

  // Dot-trick abuse: 3 or more dots in the local part.
  const dotCount = (local.match(/\./g) || []).length;
  if (dotCount >= 3) return { ok: false, reason: 'dot_trick' };

  // Carrier email-to-SMS gateways (exact domain or sub-domain match).
  for (const g of SMS_GATEWAYS) {
    if (domain === g || domain.endsWith('.' + g)) {
      return { ok: false, reason: 'sms_gateway' };
    }
  }

  // Disposable providers (keyword anywhere in the domain).
  for (const k of DISPOSABLE_KEYWORDS) {
    if (domain.includes(k)) return { ok: false, reason: 'disposable' };
  }

  return { ok: true, email };
}

// ── Stateless double-opt-in token (signed, no database) ──────────
// token = base64url(payload).base64url(HMAC-SHA256(payload, secret))
// payload = JSON { e: email, s: source, t: issuedAtMs }

function signingSecret() {
  // Prefer a dedicated secret; fall back to the Resend key (always
  // present when email works) so no extra env var is strictly required.
  return process.env.NEWSLETTER_SECRET || process.env.RESEND_API_KEY || 'nh-dev-secret-change-me';
}

function b64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlDecode(str) {
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}

export function makeToken(email, source, issuedAtMs) {
  const payload = b64url(JSON.stringify({ e: email, s: source || '', t: issuedAtMs }));
  const sig = b64url(crypto.createHmac('sha256', signingSecret()).update(payload).digest());
  return `${payload}.${sig}`;
}

/**
 * Verify a token. Returns { ok:true, email, source } if the signature
 * is valid and the token is younger than maxAgeMs (default 3 days),
 * otherwise { ok:false, reason }.
 */
export function verifyToken(token, maxAgeMs = 3 * 24 * 60 * 60 * 1000) {
  if (!token || typeof token !== 'string' || token.indexOf('.') === -1) {
    return { ok: false, reason: 'malformed' };
  }
  const [payload, sig] = token.split('.');
  const expected = b64url(crypto.createHmac('sha256', signingSecret()).update(payload).digest());

  // Constant-time comparison.
  const a = Buffer.from(sig || '');
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, reason: 'bad_signature' };
  }

  let data;
  try { data = JSON.parse(b64urlDecode(payload)); } catch { return { ok: false, reason: 'malformed' }; }
  if (!data || !data.e || !data.t) return { ok: false, reason: 'malformed' };

  // We can't call Date.now() at import time in some sandboxes, but at
  // request time it's fine.
  if (Date.now() - Number(data.t) > maxAgeMs) return { ok: false, reason: 'expired' };

  return { ok: true, email: data.e, source: data.s || '' };
}

// ── Cloudflare Turnstile verification ────────────────────────────
// Fail-OPEN when no secret is configured (so the form keeps working
// before you paste your keys); fail-CLOSED once a secret is set.
export async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true, skipped: true }; // not configured yet

  if (!token) return { ok: false, reason: 'missing_captcha' };

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.append('remoteip', ip);
    const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    const data = await resp.json();
    return data.success ? { ok: true } : { ok: false, reason: 'captcha_failed' };
  } catch (err) {
    console.error('Turnstile verify error:', err);
    // Network hiccup contacting Cloudflare — don't punish the user.
    return { ok: true, skipped: true };
  }
}

// ── Rate limiting: 3 submissions / IP / hour ─────────────────────
// Uses Upstash Redis (via REST, no npm dependency) when configured —
// this is the only option that holds up across serverless instances.
// Falls back to a per-instance in-memory limiter otherwise (best-effort:
// catches rapid-fire bursts hitting the same warm instance).

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 3;

const memStore = new Map(); // ip -> [timestamps]

async function upstash(command) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const tok = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !tok) return null;
  const resp = await fetch(`${url}/${command.map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${tok}` }
  });
  if (!resp.ok) throw new Error('upstash ' + resp.status);
  return resp.json();
}

/**
 * Returns { allowed:boolean, remaining:number }. Never throws — on any
 * backend error it fails open (allows the request) so a limiter outage
 * can't block real signups.
 */
export async function rateLimit(ip) {
  const key = 'nlrl:' + (ip || 'unknown');

  // Upstash path (cross-instance, reliable).
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const incr = await upstash(['INCR', key]);
      const count = incr && incr.result;
      if (count === 1) await upstash(['EXPIRE', key, String(Math.ceil(WINDOW_MS / 1000))]);
      return { allowed: count <= MAX_PER_WINDOW, remaining: Math.max(0, MAX_PER_WINDOW - count) };
    } catch (err) {
      console.error('Rate-limit (upstash) error, failing open:', err);
      return { allowed: true, remaining: MAX_PER_WINDOW };
    }
  }

  // In-memory fallback (best-effort per warm instance).
  const now = Date.now();
  const hits = (memStore.get(key) || []).filter(ts => now - ts < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) {
    memStore.set(key, hits);
    return { allowed: false, remaining: 0 };
  }
  hits.push(now);
  memStore.set(key, hits);
  return { allowed: true, remaining: MAX_PER_WINDOW - hits.length };
}

// ── Client IP extraction (Vercel) ────────────────────────────────
export function clientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (xff) return String(xff).split(',')[0].trim();
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || '';
}
