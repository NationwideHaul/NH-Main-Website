// Content for scripts/build-content-pages.mjs — locations + resources pages.
//
// Location NAP (name/address/phone/hours) must match each Google Business
// Profile exactly. If a GBP changes, change it here and in index.html's JSON-LD.

import wave2 from './content-pages-wave2.mjs';
import prices from './content-pages-prices.mjs';

export const SITE = 'https://www.nationwidehaul.com';
export const OG_IMAGE = `${SITE}/files/og/nationwide-haul-og.jpg`;
const ORG_ID = `${SITE}/#organization`;
const PUBLISHED = '2026-09-28';


export const LOCATIONS = [
  {
    slug: 'lakeland',
    city: 'Lakeland', state: 'FL', stateName: 'Florida',
    street: '5021 Frontage Road N.', zip: '33810',
    phone: '+1-877-559-7039', phoneDisplay: '(877) 559-7039',
    hq: true,
    blurb: 'Our headquarters and operations center on the I-4 corridor between Tampa and Orlando &mdash; central to Florida&rsquo;s distribution and warehousing freight.',
    region: 'Central Florida, Tampa Bay and Orlando',
    service: 'https://nhtrucktrailerrepair.com/'
  },
  {
    slug: 'pompano-beach',
    city: 'Pompano Beach', state: 'FL', stateName: 'Florida',
    street: '2221 NW 22nd St', zip: '33069',
    phone: '+1-877-559-7039', phoneDisplay: '(877) 559-7039',
    blurb: 'Serving South Florida, Broward, Palm Beach and the Miami metro with new and used trailers, financing and leasing.',
    region: 'South Florida, Broward, Palm Beach and Miami-Dade',
  },
  {
    slug: 'macon',
    city: 'Macon', state: 'GA', stateName: 'Georgia',
    street: '137 Debbie Ct', zip: '31206',
    phone: '+1-877-559-7039', phoneDisplay: '(877) 559-7039',
    blurb: 'Central Georgia coverage at the I-75 / I-16 crossroads, supporting regional and long-haul fleets across Georgia and the Southeast.',
    region: 'Central Georgia, Atlanta, Savannah and the Southeast',
  }
];

const HOURS = [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' }];

export const locationLd = (l) => ({
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  '@id': `${SITE}/locations/${l.slug}/#dealer`,
  name: `Nationwide Haul — ${l.city}, ${l.state}`,
  url: `${SITE}/locations/${l.slug}/`,
  image: OG_IMAGE,
  logo: `${SITE}/nh-logo.png`,
  telephone: l.phone,
  email: 'operations@nationwidehaul.com',
  priceRange: '$$$',
  address: { '@type': 'PostalAddress', streetAddress: l.street, addressLocality: l.city, addressRegion: l.state, postalCode: l.zip, addressCountry: 'US' },
  hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Nationwide Haul ${l.street} ${l.city} ${l.state} ${l.zip}`)}`,
  openingHoursSpecification: HOURS,
  areaServed: { '@type': 'Country', name: 'United States' },
  parentOrganization: { '@id': ORG_ID }
});

const mapsLink = (l) => `https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(`Nationwide Haul ${l.street} ${l.city} ${l.state} ${l.zip}`)}`;

const card = (h, p) => `    <div class="oem-whybuy__item">\n      <h4>${h}</h4>\n      <p>${p}</p>\n    </div>`;
const grid = (items) => `  <div class="oem-whybuy__grid" style="max-width:1000px;margin:0 auto;">\n${items.map(([h, p]) => card(h, p)).join('\n')}\n  </div>`;
const section = (inner, gray = false) => `
<section class="tt-section${gray ? ' tt-section--gray' : ''}"><div class="container"><div class="tt-section__inner">
${inner}
</div></div></section>
`;
const intro = (...ps) => `
<!-- QUICK ANSWER -->
<section class="oem-intro"><div class="container"><div class="oem-intro__inner">
${ps.map((p) => `  <p>${p}</p>`).join('\n')}
</div></div></section>
`;
const table = (label, head, rows) => `  <div style="overflow-x:auto;margin:24px 0;">
  <table class="lr-compare-table" aria-label="${label}">
    <thead><tr>${head.map((h, i) => i > 2 ? `<th style="background:#111111;color:#fff;text-align:center;">${h}</th>` : `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>
${rows.map((r) => `      <tr>${r.map((c, i) => i === 0 ? `<td><strong>${c}</strong></td>` : `<td style="text-align:center;">${c}</td>`).join('')}</tr>`).join('\n')}
    </tbody>
  </table>
  </div>`;

const articleLd = (path, headline, description) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline,
  description,
  url: SITE + path,
  mainEntityOfPage: SITE + path,
  image: OG_IMAGE,
  datePublished: PUBLISHED,
  dateModified: PUBLISHED,
  author: { '@type': 'Organization', '@id': ORG_ID, name: 'Nationwide Haul' },
  publisher: { '@type': 'Organization', '@id': ORG_ID, name: 'Nationwide Haul', logo: { '@type': 'ImageObject', url: `${SITE}/nh-logo.png` } }
});

// ───────────────────────── LOCATIONS ─────────────────────────

const locationPages = LOCATIONS.map((l) => ({
  path: `/locations/${l.slug}/`,
  crumbs: [{ name: 'Locations', path: '/locations/' }, { name: `${l.city}, ${l.state}`, path: `/locations/${l.slug}/` }],
  title: `Trailer Dealer in ${l.city}, ${l.state} | Nationwide Haul`,
  description: `Nationwide Haul ${l.city}, ${l.state}: new & used semi-trailers and trucks, financing, leasing and service at ${l.street}. Nationwide delivery. Call ${l.phoneDisplay}.`,
  h1: `Nationwide Haul ${l.city}, ${l.state}`,
  lede: `${l.hq ? 'Headquarters &mdash; ' : ''}New &amp; used semi-trailers and trucks, financing, leasing and service &mdash; with delivery anywhere in the U.S.`,
  schema: [locationLd(l)],
  body: intro(
    `<strong>Nationwide Haul ${l.city}</strong> is located at <strong>${l.street}, ${l.city}, ${l.state} ${l.zip}</strong>. Call <a href="tel:${l.phone.replace(/\D/g, '').slice(1)}">${l.phoneDisplay}</a>, Monday&ndash;Friday, 8am&ndash;5pm. ${l.blurb}`,
    `This yard is one of three Nationwide Haul locations (Lakeland, FL &middot; Pompano Beach, FL &middot; Macon, GA). Inventory is shared across all three, so every unit is available to buyers in ${l.region} &mdash; and we deliver trucks and trailers nationwide.`,
    `<a href="${mapsLink(l)}" target="_blank" rel="noopener">Get directions &rarr;</a>`
  ) + `
<section class="tt-section tt-section--gray"><div class="container">
  <div class="tt-section__inner" style="max-width:1000px;">
    <h2 style="text-align:center;">What We Offer in ${l.city}</h2>
  </div>
${grid([
  ['New &amp; Used Trailers', `Dry vans, reefers, flatbeds, dump trailers and lowboys from MAC, Vanguard, Dorsey, Pitts, XL Specialized and WADE. <a href="/trailers/">Browse trailer types</a>.`],
  ['Trucks', 'Semi-trucks plus Autocar yard trucks and severe-duty vocational trucks. <a href="/manufacturers/autocar/">Autocar lineup</a>.'],
  ['Financing', 'In-house financing through NEF NOW with 40+ lenders; credit scores as low as 500 and startup programs. <a href="/financing/">Financing details</a>.'],
  ['Leasing &amp; Rental', 'Leases from 12&ndash;72 months and rentals from a 6-month minimum; every unit DOT-inspected. <a href="/lease/">Lease &amp; rental</a>.'],
  l.service
    ? ['Service &amp; DOT Inspections', `Truck and trailer repair, plus free DOT inspections for life on equipment bought from us. <a href="/perks/dot-inspections/">DOT perk</a> &middot; <a href="${l.service}">Service shop</a>.`]
    : ['Free DOT Inspections', 'Free DOT inspections for life on equipment bought from Nationwide Haul, performed at our Lakeland service shop. <a href="/perks/dot-inspections/">DOT perk</a>.'],
  ['Sell or Trade', 'Sell, consign or auction your trucks and trailers. <a href="/perks/sell-your-equipment/">Sell your equipment</a>.']
])}
</div></section>
` + section(`  <h2>Nationwide Delivery from ${l.city}</h2>
  <p>You don&rsquo;t need to be near ${l.city} to buy here. Nationwide Haul sells to owner-operators, fleets and municipalities across the United States and arranges delivery to your yard. Pick the unit online, finance it remotely through NEF NOW, and we handle transport.</p>
  <p>Other locations: ${LOCATIONS.filter((o) => o !== l).map((o) => `<a href="/locations/${o.slug}/">${o.city}, ${o.state}</a>`).join(' &middot; ')}.</p>`),
  faq: [
    [`Where is Nationwide Haul in ${l.city}?`, `${l.street}, ${l.city}, ${l.state} ${l.zip}. Phone ${l.phoneDisplay}. Open Monday to Friday, 8am to 5pm.`],
    [`Do I have to live in ${l.stateName} to buy from Nationwide Haul?`, `No. Nationwide Haul sells to buyers in every state and delivers trucks and trailers nationwide. Financing can be completed remotely.`],
    [`Can I get financing at the ${l.city} location?`, `Yes. Financing runs through NEF NOW, which works with 40+ lenders and accepts credit scores as low as 500. Most applicants get a decision within 24&ndash;48 business hours.`],
    [`Does the ${l.city} location lease or rent trailers?`, `Yes. Leases run 12&ndash;72 months and rentals have a 6-month minimum. Every leased or rented unit leaves with a current DOT annual inspection.`]
  ],
  cta: { title: `Visit or Call Nationwide Haul ${l.city}`, text: `${l.street}, ${l.city}, ${l.state} ${l.zip} &middot; ${l.phoneDisplay} &middot; Mon&ndash;Fri 8am&ndash;5pm` }
}));

const locationsHub = {
  path: '/locations/',
  crumbs: [{ name: 'Locations', path: '/locations/' }],
  title: 'Locations: Lakeland, Pompano Beach & Macon | Nationwide Haul',
  description: 'Nationwide Haul truck and trailer locations in Lakeland FL, Pompano Beach FL and Macon GA — with sales, financing, leasing, service and nationwide delivery.',
  h1: 'Nationwide Haul Locations',
  lede: 'Three Southeast yards. One shared inventory. Delivery anywhere in the U.S.',
  schema: [{ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Nationwide Haul locations', itemListElement: LOCATIONS.map((l, i) => ({ '@type': 'ListItem', position: i + 1, name: `Nationwide Haul ${l.city}, ${l.state}`, url: `${SITE}/locations/${l.slug}/` })) }],
  body: intro(
    'Nationwide Haul operates three locations: <strong>Lakeland, FL</strong> (headquarters), <strong>Pompano Beach, FL</strong> and <strong>Macon, GA</strong>. All three sell new and used semi-trailers and trucks, offer financing and leasing, and ship equipment nationwide.'
  ) + `
<section class="tt-section"><div class="container"><div class="tt-section__inner" style="max-width:1000px;">
  <div class="tt-locations">
${LOCATIONS.map((l) => `    <div class="tt-locations__card">
      <h4><a href="/locations/${l.slug}/" style="color:inherit;">${l.city}, ${l.state}${l.hq ? ' (HQ)' : ''}</a></h4>
      <p>${l.street}<br>${l.city}, ${l.state} ${l.zip}<br><a href="tel:${l.phone.replace(/\D/g, '').slice(1)}">${l.phoneDisplay}</a></p>
      <p>${l.blurb}</p>
      <p><a href="/locations/${l.slug}/">Location details &rarr;</a></p>
    </div>`).join('\n')}
  </div>
</div></div></section>
`
};

// ───────────────────────── RESOURCES ─────────────────────────

const R = (slug) => `/resources/${slug}/`;
const articles = [];

articles.push({
  path: R('semi-trailer-financing-bad-credit'),
  title: 'Semi-Trailer Financing with Bad Credit | Nationwide Haul',
  description: 'Yes, you can finance a semi-truck or trailer with bad credit. How approval works with a 500+ score, what down payment to expect, and the documents you need.',
  h1: 'Can You Finance a Semi-Trailer with Bad Credit?',
  lede: 'Short answer: yes. Here&rsquo;s how approval works, what it costs you in down payment, and how to improve your odds.',
  ogType: 'article',
  body: intro(
    '<strong>Yes &mdash; you can finance a semi-truck or trailer with bad credit.</strong> Through NEF NOW, Nationwide Haul&rsquo;s financing partner, applicants with credit scores as low as <strong>500</strong> can be approved. Lenders look at the whole picture &mdash; business cash flow, time in business and down payment &mdash; not just the score.',
    'The biggest lever is the down payment: putting <strong>20&ndash;40% down</strong> significantly improves approval odds for challenged credit. Most applicants get a decision within <strong>24&ndash;48 business hours</strong>, and pre-qualification with a soft credit pull takes minutes.'
  ) + section(`  <h2>What Lenders Look At (Besides Your Score)</h2>
  <p>Commercial equipment lenders underwrite the business as much as the borrower. NEF NOW shops your application across 40+ lenders, so a &ldquo;no&rdquo; from one program doesn&rsquo;t end the process.</p>
${table('What affects approval', ['Factor', 'Why it matters', 'How to strengthen it'], [
  ['Down payment', 'Reduces lender risk directly', '20&ndash;40% for credit under ~600'],
  ['Bank statements', 'Shows real cash flow', '3&ndash;6 months of steady deposits'],
  ['Time in business', 'Proves the operation is stable', 'Startups: expect a higher down payment'],
  ['CDL &amp; experience', 'Operator risk', 'Include CDL and years driving'],
  ['The equipment', 'Collateral value', 'Newer, well-spec&rsquo;d units finance easier']
])}`) + section(`  <h2>Documents You&rsquo;ll Need</h2>
  <p>Typically: government-issued ID, 3&ndash;6 months of bank statements, CDL (if applicable), proof of insurance, and basic business information (EIN, business address). Startups may also need a personal financial statement.</p>
  <h2>Startups and New Authorities</h2>
  <p>New businesses can be approved too. NEF NOW has startup programs; expect a higher down payment than an established carrier. Many lender partners also offer loans with <strong>no prepayment penalty</strong>, so you can refinance or pay off early once your credit improves.</p>
  <h2>Leasing or Renting as an Alternative</h2>
  <p>If financing isn&rsquo;t a fit yet, a <a href="/lease/">rental</a> (6-month minimum) has less restrictive credit requirements and lets you build a payment history. See <a href="${R('lease-vs-buy-semi-trailer')}">lease vs. buy</a>.</p>
  <p><a href="https://www.nefnow.com/app/?co=1001" target="_blank" rel="noopener"><strong>Start a soft-pull pre-qualification with NEF NOW &rarr;</strong></a> &middot; <a href="/financing/">Financing overview</a></p>`, true),
  faq: [
    ['What is the minimum credit score to finance a semi-trailer?', 'Through NEF NOW, scores as low as 500 can be approved. Lower scores usually require a larger down payment, typically 20&ndash;40%.'],
    ['Does pre-qualifying hurt my credit?', 'No. Pre-qualification uses a soft credit pull, which does not affect your score, and takes minutes.'],
    ['How fast can I get approved?', 'Most applicants receive a decision within 24&ndash;48 business hours. Funding and paperwork can be completed in as little as 1&ndash;2 business days after approval.'],
    ['Can a brand-new trucking company get trailer financing?', 'Yes. Startup programs exist for new businesses, usually with higher down payment requirements.'],
    ['Can I finance a used trailer with bad credit?', 'Yes. Virtually all commercial equipment can be financed, including used dry vans, reefers, flatbeds and dump trailers.']
  ],
  schema: [articleLd(R('semi-trailer-financing-bad-credit'), 'Can You Finance a Semi-Trailer with Bad Credit?', 'How semi-truck and trailer financing works with a 500+ credit score.')],
  cta: { title: 'Get Pre-Qualified in Minutes', text: 'Soft credit pull, no impact on your score. Then pick your unit from current inventory.' }
});

articles.push({
  path: R('lease-vs-buy-semi-trailer'),
  title: 'Lease vs. Buy a Semi-Trailer | Nationwide Haul',
  description: 'Lease, rent or buy a semi-trailer? Compare term length, monthly cost, credit requirements, maintenance and ownership to decide what fits your operation.',
  h1: 'Lease vs. Buy a Semi-Trailer',
  lede: 'Buying builds equity. Leasing protects cash. Renting buys flexibility. Here&rsquo;s how to choose.',
  ogType: 'article',
  body: intro(
    '<strong>Buy</strong> if you&rsquo;ll run the trailer for many years and want to own the asset. <strong>Lease</strong> (12&ndash;72 months) if you want a fixed monthly payment without a large capital outlay. <strong>Rent</strong> (6-month minimum) if demand is seasonal, you&rsquo;re testing a new lane, or your credit isn&rsquo;t ready for financing yet.'
  ) + section(`  <h2>Side-by-Side Comparison</h2>
${table('Lease vs rent vs buy', ['', 'Buy (financed)', 'Lease', 'Rent'], [
  ['Term', 'You own it', '12&ndash;72 months', '6-month minimum'],
  ['Upfront cost', 'Down payment', 'Low', 'Low'],
  ['Monthly cost', 'Loan payment', 'Lower (longer term)', 'Higher (shorter term)'],
  ['Equity', '&#10003; Yes', 'Purchase option at end', 'No'],
  ['Credit requirements', 'Standard (500+ via NEF NOW)', 'Standard', 'Less restrictive'],
  ['Swap / upgrade', 'Sell or trade', 'At term end', '&#10003; More flexible'],
  ['DOT annual inspection', 'Free for life (NH perk)', '&#10003; Included', '&#10003; Included']
])}`) + section(`  <h2>When Buying Wins</h2>
  <p>If the trailer will be in service for years, ownership is usually cheaper over its life, and you keep the resale value. Equipment bought from Nationwide Haul comes with <a href="/perks/dot-inspections/">free DOT inspections for life</a>, and used units can add a <a href="/perks/warranty/">warranty plan</a>.</p>
  <h2>When Leasing Wins</h2>
  <p>Leasing keeps cash in the business, gives you a predictable payment, and lets fleets upgrade at term end. Multi-unit programs get volume pricing.</p>
  <h2>When Renting Wins</h2>
  <p>Seasonal surges, a new contract you&rsquo;re not sure will last, or credit you&rsquo;re still rebuilding. Rentals can swap equipment as needs change. See <a href="/lease/">leasing &amp; rental programs</a>.</p>`, true),
  faq: [
    ['Is it cheaper to lease or buy a semi-trailer?', 'Over a long service life, buying is usually cheaper because you keep the asset and its resale value. Leasing costs less upfront and gives a fixed monthly payment.'],
    ['What is the minimum term to rent a semi-trailer from Nationwide Haul?', 'Rentals have a 6-month minimum. Leases run from 12 to 72 months.'],
    ['Can I buy the trailer at the end of a lease?', 'Yes. At the end of a lease you can return the trailer or use the purchase option.'],
    ['Are leased trailers DOT inspected?', 'Yes. Every leased and rented unit leaves with a current DOT annual inspection.']
  ],
  schema: [articleLd(R('lease-vs-buy-semi-trailer'), 'Lease vs. Buy a Semi-Trailer', 'Compare leasing, renting and buying a semi-trailer.')]
});

articles.push({
  path: R('dry-van-vs-reefer-trailer'),
  title: 'Dry Van vs. Reefer Trailer: Which to Buy? | Nationwide Haul',
  description: 'Dry van vs. reefer trailer: what each hauls, cost of ownership, maintenance and which one fits your freight. A plain-English guide from a trailer dealer.',
  h1: 'Dry Van vs. Reefer Trailer',
  lede: 'Same footprint, very different businesses. How to choose between an enclosed dry van and a refrigerated trailer.',
  ogType: 'article',
  body: intro(
    'A <strong>dry van</strong> is an enclosed, unrefrigerated trailer for freight that only needs to stay dry &mdash; palletized goods, packaged food, paper, retail. A <strong>reefer</strong> is an insulated trailer with a refrigeration unit for temperature-controlled freight &mdash; produce, meat, dairy, pharmaceuticals, frozen food.',
    'Dry vans cost less to buy and maintain and run the most freight overall. Reefers cost more (insulated box plus a refrigeration unit that needs its own service), but temperature-controlled freight typically pays higher rates. Choose based on the freight you can reliably book.'
  ) + section(`  <h2>Side-by-Side Comparison</h2>
${table('Dry van vs reefer', ['', 'Dry Van', 'Reefer'], [
  ['Freight', 'General, palletized, dry goods', 'Temperature-controlled'],
  ['Purchase price', 'Lower', 'Higher'],
  ['Maintenance', 'Box, doors, floor, tires, brakes', 'All of that + refrigeration unit'],
  ['Interior space', 'More (thin walls)', 'Less (insulated walls)'],
  ['Freight rates', 'Standard', 'Typically higher'],
  ['Common lengths', '48 ft and 53 ft', '53 ft'],
  ['Seasonality', 'Steady', 'Produce seasons drive demand']
])}`) + section(`  <h2>What to Check on a Used Reefer</h2>
  <p>Beyond the box, look at the refrigeration unit&rsquo;s hours and service history, insulation condition (wet or delaminated walls lose efficiency), door seals, and the floor. Nationwide Haul offers a <a href="/perks/warranty/">used reefer unit trailer warranty</a>.</p>
  <h2>What to Check on a Used Dry Van</h2>
  <p>Floor condition (soft spots, rot), wall construction (plate vs. sheet-and-post), doors and seals, and roof leaks. Our <a href="/trailers/dry-vans/">dry van buyer&rsquo;s guide</a> covers the spec trade-offs.</p>
  <p>Shop: <a href="/trailers/dry-vans/">Dry vans</a> &middot; <a href="/trailers/reefer-trailers/">Reefer trailers</a> &middot; <a href="/manufacturers/vanguard/">Vanguard</a> &middot; <a href="/manufacturers/clear-mac/">MAC</a></p>`, true),
  faq: [
    ['Can a reefer trailer haul dry freight?', 'Yes. A reefer can run with the unit off and haul dry freight, which helps avoid empty miles. A dry van cannot haul temperature-controlled freight.'],
    ['Which is cheaper to maintain, a dry van or a reefer?', 'A dry van. A reefer has everything a dry van has plus a refrigeration unit that needs its own maintenance and fuel.'],
    ['Do reefer loads pay more than dry van loads?', 'Temperature-controlled freight typically pays higher rates than dry van freight, which offsets the higher cost of the equipment.'],
    ['What size are dry van and reefer trailers?', 'Most over-the-road dry vans and reefers are 53 ft; 48 ft dry vans are still common in regional and drop-yard work.']
  ],
  schema: [articleLd(R('dry-van-vs-reefer-trailer'), 'Dry Van vs. Reefer Trailer', 'Differences between dry van and refrigerated trailers.')]
});

articles.push({
  path: R('used-semi-trailer-inspection-checklist'),
  title: 'Used Semi-Trailer Inspection Checklist | Nationwide Haul',
  description: 'What to inspect before buying a used semi-trailer: brakes, tires, frame, suspension, lights, floor, doors and paperwork. Plus how DOT annual inspections work.',
  h1: 'Used Semi-Trailer Inspection Checklist',
  lede: 'What to check before you buy a used trailer &mdash; and what a DOT annual inspection covers.',
  ogType: 'article',
  body: intro(
    'Before buying a used semi-trailer, check the <strong>brakes, tires and wheels, frame and suspension, lights and wiring, coupling (kingpin and upper coupler), floor, walls, roof and doors</strong>, and confirm the <strong>title and current DOT annual inspection</strong>. Problems in the floor, frame or brakes are the most expensive to fix, so price them in before you buy.'
  ) + section(`  <h2>The Checklist</h2>
${table('Used trailer inspection checklist', ['Area', 'What to look for'], [
  ['Brakes', 'Lining thickness, drums/rotors, air leaks, slack adjusters'],
  ['Tires &amp; wheels', 'Tread depth, matching tires, cracks, rim damage'],
  ['Frame &amp; suspension', 'Cracks, rust-through, bent crossmembers, air-ride bags'],
  ['Coupling', 'Kingpin wear, upper coupler plate, landing gear'],
  ['Lights &amp; wiring', 'All lamps working, reflective tape, pigtail condition'],
  ['Floor', 'Soft spots, rot, delamination, forklift rating'],
  ['Walls, roof &amp; doors', 'Holes, leaks, door seals, hinges, latches'],
  ['Reefer only', 'Unit hours, service history, insulation condition'],
  ['Paperwork', 'Clean title, VIN match, last DOT annual inspection']
])}`) + section(`  <h2>What a DOT Annual Inspection Covers</h2>
  <p>The federal annual (periodic) inspection covers brake systems, fuel systems, frame and suspension, steering, exhaust and lighting, wheels, rims and tires, coupling devices and other safety systems. Every trailer on the road needs a current one.</p>
  <p>Equipment bought from Nationwide Haul gets <a href="/perks/dot-inspections/"><strong>free DOT inspections for life</strong></a> &mdash; and the benefit stays with the unit even if you sell it. Every leased or rented unit also leaves with a current inspection.</p>
  <h2>Protect a Used Purchase</h2>
  <p>Ask about <a href="/perks/warranty/">warranty plans for pre-owned equipment</a>, and see <a href="${R('semi-trailer-financing-bad-credit')}">financing options</a> if you&rsquo;re buying on credit.</p>`, true),
  faq: [
    ['What is the most expensive thing to fix on a used trailer?', 'Floor, frame and brake problems are usually the most expensive repairs, so inspect them closely and price them into your offer.'],
    ['How often does a semi-trailer need a DOT inspection?', 'At least once a year. Every commercial trailer must carry a current annual (periodic) inspection.'],
    ['Does Nationwide Haul inspect used trailers before sale?', 'Leased and rented units are DOT-inspected before delivery, and equipment purchased from Nationwide Haul gets free DOT inspections for life.']
  ],
  schema: [articleLd(R('used-semi-trailer-inspection-checklist'), 'Used Semi-Trailer Inspection Checklist', 'What to check before buying a used semi-trailer.')]
});

articles.push(...wave2({ R, intro, section, table, articleLd }));
articles.push(...prices({ R, intro, section, table, articleLd, SITE }));

const resourcesHub = {
  path: '/resources/',
  crumbs: [{ name: 'Resources', path: '/resources/' }],
  title: 'Truck & Trailer Buying Guides | Nationwide Haul Resources',
  description: 'Guides for buying, financing and leasing semi-trailers and trucks: bad-credit financing, lease vs. buy, dry van vs. reefer and used trailer inspections.',
  h1: 'Resources & Buying Guides',
  lede: 'Straight answers on buying, financing, leasing and maintaining commercial trailers.',
  schema: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Nationwide Haul Resources', url: `${SITE}/resources/`, hasPart: articles.map((a) => ({ '@type': 'Article', headline: a.h1, url: SITE + a.path })) }],
  body: `
<section class="tt-section"><div class="container">
  <div class="mfr-grid" style="max-width:1000px;padding:8px 0;">
${articles.map((a) => `    <a href="${a.path}" class="mfr-card">
      <h3>${a.h1}</h3>
      <p>${a.description}</p>
      <span class="mfr-card__link">Read Guide <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
    </a>`).join('\n')}
  </div>
</div></section>
` + section(`  <h2>Trailer Buyer&rsquo;s Guides by Type</h2>
  <p><a href="/trailers/dry-vans/">Dry vans</a> &middot; <a href="/trailers/reefer-trailers/">Reefer trailers</a> &middot; <a href="/trailers/flatbed-trailers/">Flatbed trailers</a> &middot; <a href="/trailers/dump-trailers/">Dump trailers</a> &middot; <a href="/trailers/lowboy-trailers/">Lowboy trailers</a></p>`, true)
};

const enFin = articles.find((a) => a.path === R('semi-trailer-financing-bad-credit'));
enFin.alternates = [{ lang: 'en', path: enFin.path }, { lang: 'es', path: R('es/financiamiento-trailer-mal-credito') }];

for (const a of articles) a.updated ??= 'October 2026';
for (const a of articles) a.crumbs = [{ name: a.crumbsName || 'Resources', path: '/resources/' }, { name: a.h1, path: a.path }];

export const PAGES = [locationsHub, ...locationPages, resourcesHub, ...articles];
