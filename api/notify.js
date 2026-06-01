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

  // Honeypot — silently drop bot submissions
  if (body._honey) {
    return res.status(200).json({ ok: true });
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

  // Build the CC list: always marketing, plus any team address(es) the form
  // passed in `_cc` (the contact form routes by topic this way). De-dupe and
  // drop anything that is already the primary recipient.
  const ccSet = new Set();
  if (route.to.toLowerCase() !== CC_ALL.toLowerCase()) ccSet.add(CC_ALL);
  String(body._cc || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .forEach(addr => {
      if (addr.toLowerCase() !== route.to.toLowerCase()) ccSet.add(addr);
    });
  const cc = ccSet.size ? Array.from(ccSet) : undefined;

  try {
    const apiResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: [route.to],
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
