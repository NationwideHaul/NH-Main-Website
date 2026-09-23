// Vercel serverless function — receives website form submissions
// and dispatches them via Resend to the correct team email,
// always CC'ing marketing@nationwidehaul.com.
//
// Required env var (set in Vercel project settings):
//   RESEND_API_KEY = your Resend API key (https://resend.com/api-keys)
//
// Optional env var:
//   RESEND_FROM    = e.g. "Nationwide Haul Website <noreply@nationwidehaul.com>"
//                    Defaults to "onboarding@resend.dev" (works without DNS verification
//                    but only for testing — verify your domain at resend.com/domains
//                    for production use).

import { insertRow } from './_lib/supabase.js';
import {
  validateEmail, verifyTurnstile, rateLimit, clientIp
} from './_lib/newsletter-utils.js';

const MIN_ELAPSED_MS = 3000;   // time-trap: humans can't fill a lead form in <3s
const MAX_PER_HOUR = 5;        // lead submissions per IP per hour
const MAX_FIELD_LEN = 5000;    // truncate any single field beyond this

// Hosts allowed to POST here. Browsers always send Origin on a fetch POST,
// so a missing/foreign Origin means a script hitting the endpoint directly.
function originAllowed(req) {
  const origin = req.headers.origin || req.headers.referer || '';
  let host;
  try { host = new URL(origin).hostname; } catch { return false; }
  return host === 'nationwidehaul.com' || host.endsWith('.nationwidehaul.com')
    || host.endsWith('.vercel.app') || host === 'localhost' || host === '127.0.0.1';
}

// Content heuristics for the spam that gets past the bot traps. Returns a
// reason string when the submission looks like spam, otherwise null.
// Flagged leads are still saved to Supabase (status 'spam') — just not emailed —
// so a false positive can be recovered from the dashboard.
const LINK_RE = /(https?:\/\/|www\.|\[url|<a\s|\.(ru|cn|xyz|top|click|site|online|shop)\b)/gi;
const FOREIGN_SCRIPT_RE = /[\u0400-\u04FF\u0600-\u06FF\u0E00-\u0E7F\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]/;
const SPAM_WORDS_RE = /\b(seo|backlinks?|crypto|bitcoin|casino|viagra|cialis|porn|loan offer|web ?design services|rank (your|higher)|guest post|increase (your )?traffic|lead generation services)\b/i;

function looksRandom(word) {
  // Bot-generated names like "hYtRkLqPzW": many lower→UPPER flips in one word.
  const flips = (String(word).match(/[a-z][A-Z]/g) || []).length;
  return flips >= 3;
}

function spamReason(body) {
  const names = [body.first_name, body.last_name, body.full_name, body.organization]
    .filter(Boolean).map(String);
  const text = [body.message, body.notes, body.equipment_details, body.accessories]
    .filter(Boolean).join(' ');
  const all = Object.entries(body)
    .filter(([k]) => !k.startsWith('_'))
    .map(([, v]) => String(v ?? '')).join(' ');

  if (names.some(n => (n.match(LINK_RE) || []).length)) return 'link_in_name';
  if ((text.match(LINK_RE) || []).length >= 2) return 'links_in_message';
  if (FOREIGN_SCRIPT_RE.test(all)) return 'foreign_script';
  if (SPAM_WORDS_RE.test(text)) return 'spam_keywords';
  if (names.some(n => n.split(/\s+/).some(looksRandom))) return 'random_name';
  return null;
}

// ──────────────────────────────────────────────────
// Routing map — form_type → primary recipient + subject
// ──────────────────────────────────────────────────
const ROUTES = {
  contact: {
    to: 'marketing@nationwidehaul.com',
    subject: 'New Contact Form Submission — Nationwide Haul Website'
  },
  financing: {
    to: 'info@nefnow.com',
    subject: 'New Financing Inquiry — Nationwide Haul Website'
  },
  lease: {
    to: 'info@oakwoodef.com',
    subject: 'New Lease/Rental Quote Request — Nationwide Haul Website'
  },
  municipality: {
    to: 'govbid@nationwidehaul.com',
    subject: 'New Municipality Equipment Request — Nationwide Haul Website'
  },
  sell: {
    to: 'marketing@nationwidehaul.com',
    subject: 'New Equipment Sell/Consign Submission — Nationwide Haul Website'
  },
  dot: {
    to: 'lakelandservice@nationwidehaul.com',
    subject: 'New DOT Inspection Request — Nationwide Haul Website'
  }
};

const CC_ALL = 'marketing@nationwidehaul.com'; // CC marketing on EVERY form

// Contact form only: the selected topic (the `subject` field) decides the
// PRIMARY recipient (To). marketing@ then rides along as CC. Topics not
// listed here (General Question, Buying, Delivery, Other) fall through to
// the contact route's default To (marketing@).
const CONTACT_TOPIC_ROUTES = {
  'Financing Options': 'info@nefnow.com',
  'Lease & Rental':    'info@oakwoodef.com',
  'Service & Repair':  'lakelandservice@nationwidehaul.com',
  'Municipality Bids': 'govbid@nationwidehaul.com'
};

const FIELD_LABELS = {
  first_name: 'First Name', last_name: 'Last Name', full_name: 'Full Name',
  email: 'Email', phone: 'Phone', organization: 'Organization', subject: 'Subject',
  message: 'Message', notes: 'Notes', topic: 'Topic',
  equipment_type: 'Equipment Type', program_type: 'Program Type', duration: 'Duration',
  number_of_units: 'Number of Units', operating_region: 'Operating Region',
  equipment_details: 'Equipment Details', make: 'Make', model: 'Model', year: 'Year',
  miles_hours: 'Miles / Hours', accessories: 'Accessories', sale_method: 'Sale Method',
  vin: 'VIN', stock_number: 'Stock Number'
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

function renderEmail(formType, fields, subject) {
  const rows = Object.entries(fields)
    .filter(([k, v]) => v && !k.startsWith('_') && k !== 'form_type')
    .map(([k, v]) => {
      const label = FIELD_LABELS[k] || k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const val = String(v).replace(/\n/g, '<br>');
      return `<tr><td style="padding:10px 14px;border-bottom:1px solid #eee;color:#888;width:160px;vertical-align:top;font-size:13px;">${escapeHtml(label)}</td><td style="padding:10px 14px;border-bottom:1px solid #eee;color:#1a1a1a;font-size:14px;">${escapeHtml(val)}</td></tr>`;
    })
    .join('');

  return `<!DOCTYPE html><html><body style="font-family:-apple-system,'Segoe UI',Arial,sans-serif;background:#f5f5f5;margin:0;padding:32px;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
      <div style="background:#1a1a1a;color:#fff;padding:24px 28px;">
        <div style="display:inline-block;background:#c8181f;color:#fff;padding:4px 12px;border-radius:14px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px;">New Lead — ${escapeHtml(formType)}</div>
        <h1 style="margin:0;font-size:20px;font-weight:800;color:#fff;">${escapeHtml(subject)}</h1>
      </div>
      <table style="width:100%;border-collapse:collapse;padding:0;">${rows}</table>
      <div style="background:#fafafa;padding:16px 28px;border-top:1px solid #eee;font-size:11px;color:#999;">
        Submitted from nationwidehaul.com — replied directly to the lead's email if you reply to this notification.
      </div>
    </div>
  </body></html>`;
}

export default async function handler(req, res) {
  // Allow CORS for same-origin (Vercel handles same-domain automatically)
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  }
  body = body || {};

  // Every hard bot signal below returns a fake 200 so bots can't tell
  // they were caught (and never retry / adapt).
  const drop = (reason) => {
    console.log('notify: dropped bot submission —', reason, '| form:', body.form_type);
    return res.status(200).json({ ok: true });
  };

  // ── Layer 1: Origin — must come from our own site. ──
  if (!originAllowed(req)) return drop('bad_origin');

  // ── Layer 2: Honeypot — hidden field humans never fill. ──
  if ((body._honey && String(body._honey).trim()) || (body._hp && String(body._hp).trim())) {
    return drop('honeypot');
  }

  // ── Layer 3: Time-trap — missing or near-instant submission. ──
  const elapsed = Number(body.elapsed_ms);
  if (!Number.isFinite(elapsed) || elapsed < MIN_ELAPSED_MS) return drop('too_fast');

  const ip = clientIp(req);

  // ── Layer 4: Cloudflare Turnstile (fail-open until TURNSTILE_SECRET_KEY is set). ──
  const captcha = await verifyTurnstile(body['cf-turnstile-response'], ip);
  if (!captcha.ok) {
    return res.status(400).json({ error: 'Please complete the verification and try again.' });
  }

  // ── Layer 5: Rate limit per IP. ──
  const rl = await rateLimit(ip, { prefix: 'leadrl', max: MAX_PER_HOUR });
  if (!rl.allowed) {
    return res.status(429).json({ error: 'Too many submissions from this network. Please call us at (877) 559-7039.' });
  }

  // Strip client-controlled meta fields (never trust _cc etc. from the
  // browser) and cap field sizes.
  for (const k of Object.keys(body)) {
    if (k.startsWith('_') || k === 'elapsed_ms' || k === 'cf-turnstile-response') { delete body[k]; continue; }
    if (typeof body[k] === 'string' && body[k].length > MAX_FIELD_LEN) body[k] = body[k].slice(0, MAX_FIELD_LEN);
  }

  // ── Layer 6: Email must be real-looking (fake 200 on failure). ──
  if (body.email) {
    const v = validateEmail(body.email);
    if (!v.ok) return drop('email_' + v.reason);
  }

  const formType = body.form_type;
  const route = ROUTES[formType];
  if (!route) {
    return res.status(400).json({ error: `Unknown form_type: ${formType || '(missing)'}` });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'Email service not configured. Set RESEND_API_KEY in Vercel env vars.'
    });
  }

  const from = process.env.RESEND_FROM || 'Nationwide Haul Website <onboarding@resend.dev>';
  const replyTo = body.email || undefined;
  const html = renderEmail(formType, body, route.subject);

  // Primary recipient (To). For the contact form, the chosen topic routes
  // the lead directly to the owning team; every other form uses its own
  // route. marketing@ is always CC'd (below), never dropped.
  let toAddr = route.to;
  if (formType === 'contact') {
    const teamEmail = CONTACT_TOPIC_ROUTES[String(body.subject || '').trim()];
    if (teamEmail) toAddr = teamEmail;
  }

  // CC is decided server-side ONLY. (Accepting a `_cc` from the browser
  // let anyone make our verified domain email arbitrary addresses.)
  const cc = toAddr.toLowerCase() !== CC_ALL.toLowerCase() ? [CC_ALL] : undefined;

  // ── Layer 7: Content heuristics — save as spam, don't email. ──
  const spam = spamReason(body);

  // ── Store the lead in Supabase FIRST (fails soft) ──
  // Runs before the email so the lead is captured even if delivery fails.
  // A DB hiccup never blocks the notification — insertRow logs and returns.
  const pageUrl = body['Page URL'] || body.page_url || null;
  const cleanPayload = Object.fromEntries(
    Object.entries(body).filter(([k]) => !k.startsWith('_') && k !== 'form_type')
  );
  await insertRow('nh_leads', {
    site: 'nationwidehaul.com',
    form_type: formType,
    first_name: body.first_name || null,
    last_name: body.last_name || null,
    full_name: body.full_name || null,
    email: body.email || null,
    phone: body.phone || null,
    organization: body.organization || null,
    subject: body.subject || route.subject,
    message: body.message || body.notes || null,
    page_url: pageUrl,
    recipient: toAddr,
    payload: spam ? { ...cleanPayload, spam_reason: spam, ip } : cleanPayload,
    status: spam ? 'spam' : 'new'
  });

  if (spam) {
    console.log('notify: flagged as spam (saved, not emailed) —', spam, '| form:', formType);
    return res.status(200).json({ ok: true });
  }

  try {
    const apiResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: [toAddr],
        cc,
        reply_to: replyTo,
        subject: route.subject,
        html
      })
    });

    const respText = await apiResp.text();
    if (!apiResp.ok) {
      console.error('Resend error:', apiResp.status, respText);
      return res.status(502).json({ error: 'Email delivery failed', detail: respText });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Notify function exception:', err);
    return res.status(500).json({ error: 'Server error', detail: String(err && err.message || err) });
  }
}
