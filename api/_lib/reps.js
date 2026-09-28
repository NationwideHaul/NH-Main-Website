// ─────────────────────────────────────────────────────────────
// Sales rep roster for the personal landing pages at /team/<slug>/.
//
// This one file drives BOTH:
//   • the static pages  — `node scripts/build-rep-pages.mjs` regenerates
//     team/<slug>/index.html from scripts/rep-template.html
//   • lead routing      — api/notify.js looks the rep up by slug so the
//     lead is emailed to that rep (marketing@ is always CC'd).
//
// The recipient email is resolved SERVER-SIDE from the slug; the browser
// only ever sends the slug, so the form can't be used as an open relay.
//
// To add a rep: add an entry, drop a photo in team/photos/<slug>.jpg,
// run the build script, commit.
//   email  — where their leads go. Leave '' to route to marketing@ only.
//   phone  — their direct line / cell (digits only). '' = main line.
//   sms    — true if `phone` can receive texts (shows a "Text me" button).
//   photoPos — optional CSS object-position for off-center photos.
// ─────────────────────────────────────────────────────────────

export const MAIN_PHONE = '8775597039';

export const REPS = {
  'justin-brooks': {
    name: 'Justin Brooks',
    first: 'Justin',
    title: 'Sales Representative',
    email: 'justin@nationwidehaul.com',
    phone: '9543765661',
    sms: false,
    headline: 'Your direct line to the right equipment.',
    bio: "I work one-on-one with owner-operators, growing fleets and municipalities to find the right equipment at the right price — then make financing, insurance and delivery simple. Tell me what you're hauling and I'll put real options in front of you, fast."
  },
  'vanessa-kirk': {
    name: 'Vanessa Kirk',
    first: 'Vanessa',
    title: 'Sales Representative',
    email: 'vanessa@nationwidehaul.com',
    phone: '5616581075',
    sms: false,
    headline: 'Your direct line to the right equipment.',
    bio: "I work one-on-one with owner-operators and fleets to find the right equipment at the right price — then make financing, insurance and delivery simple. Tell me what you need and I'll get you real options, fast."
  },
  'pablo-rodriguez': {
    name: 'Pablo Rodriguez',
    first: 'Pablo',
    title: 'Sales Representative',
    email: '',
    phone: '',
    sms: false,
    headline: 'Your direct line to the right equipment.',
    bio: "I work one-on-one with owner-operators and fleets to find the right equipment at the right price — then make financing, insurance and delivery simple. Tell me what you need and I'll get you real options, fast."
  },
  'matthew-rock': {
    name: 'Matthew Rock',
    first: 'Matthew',
    title: 'Sales Representative',
    email: 'matt@nationwidehaul.com',
    phone: '9546789212',
    sms: false,
    headline: 'Your direct line to the right equipment.',
    bio: "I work one-on-one with owner-operators and fleets to find the right equipment at the right price — then make financing, insurance and delivery simple. Tell me what you need and I'll get you real options, fast."
  },
  'ray-lopez': {
    name: 'Ray Lopez',
    first: 'Ray',
    title: 'Sales Representative',
    email: 'ray@nationwidehaul.com',
    phone: '7543244610',
    sms: false,
    headline: 'Your direct line to the right equipment.',
    bio: "I work one-on-one with owner-operators and fleets to find the right equipment at the right price — then make financing, insurance and delivery simple. Tell me what you need and I'll get you real options, fast."
  }
};
