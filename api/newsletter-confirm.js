// ─────────────────────────────────────────────────────────────
// GET /api/newsletter-confirm?token=...
// The link in the double-opt-in email points here. On a valid,
// unexpired token we push the (now confirmed) subscriber to the
// GoHighLevel webhook and show a branded confirmation page.
// ─────────────────────────────────────────────────────────────
import { verifyToken, GHL_WEBHOOK, clientIp } from './_lib/newsletter-utils.js';

function page({ title, heading, message, showCta }) {
  const cta = showCta
    ? `<a href="https://nationwidehaul.com/" style="display:inline-block;background:#c8181f;color:#fff;text-decoration:none;padding:13px 30px;border-radius:8px;font-weight:700;font-size:15px;margin-top:8px;">Back to nationwidehaul.com</a>`
    : `<a href="https://nationwidehaul.com/" style="color:#c8181f;font-weight:700;text-decoration:none;">Return to nationwidehaul.com</a>`;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="robots" content="noindex">
    <title>${title} — Nationwide Haul</title></head>
    <body style="font-family:-apple-system,'Segoe UI',Arial,sans-serif;background:#f5f5f5;margin:0;padding:40px 20px;">
      <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
        <div style="background:#1a1a1a;color:#fff;padding:30px 28px;text-align:center;">
          <h1 style="margin:0;font-size:23px;font-weight:800;color:#fff;">${heading}</h1>
        </div>
        <div style="padding:34px 28px;color:#1a1a1a;font-size:16px;line-height:1.6;text-align:center;">
          <p style="margin:0 0 24px;">${message}</p>
          ${cta}
        </div>
      </div>
    </body></html>`;
}

function send(res, status, html) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).send(html);
}

export default async function handler(req, res) {
  const token = (req.query && req.query.token) || '';

  const result = verifyToken(token);
  if (!result.ok) {
    const expired = result.reason === 'expired';
    return send(res, expired ? 410 : 400, page({
      title: expired ? 'Link expired' : 'Invalid link',
      heading: expired ? 'This link has expired' : 'This link is invalid',
      message: expired
        ? 'Your confirmation link is no longer valid. Please sign up again from our website to receive a fresh link.'
        : 'We couldn\'t verify this confirmation link. Please sign up again from our website.',
      showCta: true
    }));
  }

  // Push the confirmed subscriber to GoHighLevel.
  try {
    const ghlResp = await fetch(GHL_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: result.email,
        source: result.source || 'Footer Newsletter Form',
        site: 'nationwidehaul.com',
        double_optin: 'confirmed',
        sms_email_consent: 'yes',
        confirmed_at: new Date().toISOString(),
        ip: clientIp(req)
      })
    });
    if (!ghlResp.ok) {
      console.error('GHL webhook failed on confirm:', ghlResp.status, await ghlResp.text());
      // The user did their part — show success, but log for us to reconcile.
    }
  } catch (err) {
    console.error('GHL webhook exception on confirm:', err);
  }

  return send(res, 200, page({
    title: 'Subscription confirmed',
    heading: "You're subscribed! ✓",
    message: 'Thanks for confirming. You\'ll now receive industry news, limited-time promos, and new-equipment alerts from Nationwide Haul.',
    showCta: true
  }));
}
