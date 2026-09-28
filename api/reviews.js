// Vercel serverless function — live Google Business Profile reviews for
// the "What our customers say" sections (home + /team/<slug>/ pages).
//
// Uses the official Google Places API (New). Required env var:
//   GOOGLE_PLACES_API_KEY = API key with "Places API (New)" enabled
//                           (console.cloud.google.com → APIs & Services)
// Optional:
//   GOOGLE_PLACE_ID       = the listing's Place ID. If unset, it is looked
//                           up once per cold start by name (PLACE_QUERY).
//
// Responses are CDN-cached for 12h, so Google is hit a few times a day at
// most. If the key is missing or Google errors, the page keeps the static
// reviews already in its HTML.

// The sales dealership listing — NOT the separate "Truck & Trailer Repair"
// profile, which a plain name search tends to return first.
const PLACE_QUERY = 'Nationwide Haul Dealership Lakeland FL';
const FIELDS = 'id,displayName,rating,userRatingCount,googleMapsUri,reviews';

let cachedPlaceId = null;

async function findPlaceId(key) {
  if (process.env.GOOGLE_PLACE_ID) return process.env.GOOGLE_PLACE_ID;
  if (cachedPlaceId) return cachedPlaceId;
  const r = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'places.id,places.displayName'
    },
    body: JSON.stringify({ textQuery: PLACE_QUERY, maxResultCount: 10 })
  });
  if (!r.ok) throw new Error('searchText ' + r.status + ' ' + (await r.text()).slice(0, 300));
  const data = await r.json();
  const places = data.places || [];
  const name = (pl) => ((pl.displayName && pl.displayName.text) || '').toLowerCase();
  const pick = places.find(pl => name(pl).includes('dealership'))
    || places.find(pl => name(pl).includes('nationwide haul') && !/repair|rv|bus/.test(name(pl)));
  cachedPlaceId = pick && pick.id;
  if (!cachedPlaceId) throw new Error('place not found');
  return cachedPlaceId;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    res.setHeader('Cache-Control', 'public, s-maxage=300');
    return res.status(503).json({ error: 'not_configured' });
  }

  try {
    const placeId = await findPlaceId(key);
    const r = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`, {
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': FIELDS }
    });
    if (!r.ok) throw new Error('place details ' + r.status + ' ' + (await r.text()).slice(0, 300));
    const p = await r.json();

    const reviews = (p.reviews || [])
      .filter(rv => rv.text && rv.text.text)
      .map(rv => ({
        author: (rv.authorAttribution && rv.authorAttribution.displayName) || 'Google user',
        authorUrl: (rv.authorAttribution && rv.authorAttribution.uri) || null,
        photo: (rv.authorAttribution && rv.authorAttribution.photoUri) || null,
        rating: rv.rating || 5,
        text: rv.text.text,
        when: rv.relativePublishTimeDescription || '',
        time: rv.publishTime || ''
      }));

    res.setHeader('Cache-Control', 'public, s-maxage=43200, stale-while-revalidate=86400');
    return res.status(200).json({
      name: p.displayName && p.displayName.text,
      rating: p.rating || null,
      count: p.userRatingCount || 0,
      url: p.googleMapsUri || null,
      writeUrl: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(p.id || placeId)}`,
      reviews
    });
  } catch (err) {
    console.error('reviews:', err && err.message);
    res.setHeader('Cache-Control', 'public, s-maxage=300');
    return res.status(502).json({ error: 'upstream_failed' });
  }
}
