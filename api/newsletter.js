// ─────────────────────────────────────────────────────────────
// POST /api/newsletter  — newsletter signup with layered anti-spam.
//
// Flow: validate everything server-side, then send a double-opt-in
// confirmation email. The subscriber is only pushed to GoHighLevel
// AFTER they click the link (see api/newsletter-confirm.js).
//
// Env vars used (all optional except email delivery):
//   RESEND_API_KEY        required to send the confirmation email
//   RESEND_FROM           from-address (defaults to onboarding@resend.dev)
//   TURNSTILE_SECRET_KEY  enables Cloudflare Turnstile verification
//   NEWSLETTER_SECRET     HMAC secret for the confirm link (falls back to RESEND_API_KEY)
//   GHL_NEWSLETTER_WEBHOOK  override the GoHighLevel webhook
//   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN  reliable rate limiting
// ─────────────────────────────────────────────────────────────
import {
  validateEmail, verifyTurnstile, rateLimit, clientIp, makeToken
} from './_lib/newsletter-utils.js';

const MIN_ELAPSED_MS = 3000; // time-trap: reject submissions faster than 3s

function baseUrl(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'nationwidehaul.com';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${host}`;
}

function confirmEmailHtml(confirmUrl) {
  return `<!DOCTYPE html><html><body style="font-family:-apple-system,'Segoe UI',Arial,sans-serif;background:#f5f5f5;margin:0;padding:32px;">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
      <div style="background:#1a1a1a;color:#fff;padding:28px;text-align:center;">
        <h1 style="margin:0;font-size:22px;font-weight:800;color:#fff;">Confirm your subscription</h1>
      </div>
      <div style="padding:32px 28px;color:#1a1a1a;font-size:15px;line-height:1.6;">
        <p style="margin:0 0 20px;">Thanks for signing up for Nationwide Haul news, promos, and new-equipment alerts. Please confirm your email to finish subscribing:</p>
        <p style="text-align:center;margin:28px 0;">
          <a href="${confirmUrl}" style="display:inline-block;background:#c8181f;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;">Confirm subscription</a>
        </p>
        <p style="margin:20px 0 0;font-size:13px;color:#888;">If the button doesn't work, copy and paste this link:<br><span style="color:#c8181f;word-break:break-all;">${confirmUrl}</span></p>
        <p style="margin:24px 0 0;font-size:13px;color:#888;">If you didn't request this, you can safely ignore this email — you will not be subscribed.</p>
      </div>
    </div>
  </body></html>`;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }
  }
  body = body || {};

  // ── Layer 1: Honeypot — bots fill it, humans never see it. ──
  // Silently accept (look successful) so bots don't learn they were caught.
  if (body.company_website && String(body.company_website).trim() !== '') {
    return res.status(200).json({ ok: true, pending: true });
  }

  // ── Layer 2: Time-trap — reject near-instant submissions. ──
  const elapsed = Number(body.elapsed_ms);
  if (!Number.isFinite(elapsed) || elapsed < MIN_ELAPSED_MS) {
    return res.status(200).json({ ok: true, pending: true }); // silent drop
  }

  const ip = clientIp(req);

  // ── Layer 3: Cloudflare Turnstile (server-side verify). ──
  const captcha = await verifyTurnstile(body['cf-turnstile-response'] || body.turnstile_token, ip);
  if (!captcha.ok) {
    return res.status(400).json({ error: 'Please complete the verification and try again.' });
  }

  // ── Layer 4: Email validation. ──
  const v = validateEmail(body.email);
  if (!v.ok) {
    // Generic message — don't tell spammers exactly which rule tripped.
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  const email = v.email;

  // ── Layer 5: Rate limit per IP (3 / hour). ──
  const rl = await rateLimit(ip);
  if (!rl.allowed) {
    return res.status(429).json({ error: 'Too many signups from this connection. Please try again later.' });
  }

  // ── Layer 6: Double opt-in — send confirmation email, do NOT
  //             push to the mailing list yet. ──
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Email service not configured. Set RESEND_API_KEY in Vercel env vars.' });
  }

  const source = String(body.source || 'Footer Newsletter Form').slice(0, 120);
  const token = makeToken(email, source, Date.now());
  const confirmUrl = `${baseUrl(req)}/api/newsletter-confirm?token=${encodeURIComponent(token)}`;
  const from = process.env.RESEND_FROM || 'Nationwide Haul <onboarding@resend.dev>';

  try {
    const apiResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [email],
        subject: 'Confirm your Nationwide Haul subscription',
        html: confirmEmailHtml(confirmUrl)
      })
    });

    if (!apiResp.ok) {
      const detail = await apiResp.text();
      console.error('Resend error (confirmation email):', apiResp.status, detail);
      return res.status(502).json({ error: 'Could not send confirmation email. Please try again.' });
    }

    return res.status(200).json({ ok: true, pending: true });
  } catch (err) {
    console.error('Newsletter handler exception:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
