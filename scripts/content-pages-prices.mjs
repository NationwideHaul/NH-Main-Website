// Price guide pages built from data/inventory-prices.json (real asking prices
// from Nationwide Haul's live Sandhills inventory). Refresh the JSON weekly with
// scripts/inventory-extract.browser.js, then rebuild.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = JSON.parse(readFileSync(path.join(root, 'data/inventory-prices.json'), 'utf8'));

const NAMES = {
  'Reefer Trailers': ['Reefer trailer (53 ft)', 'Trailer refrigerado (reefer, 53 ft)'],
  'Dry Van Trailers': ['Dry van trailer', 'Dry van (caja seca)'],
  'End': ['End dump trailer', 'End dump (volteo trasero)'],
  'Bottom': ['Bottom dump trailer', 'Bottom dump (volteo inferior)'],
  'Lowboy Trailers': ['Lowboy / RGN trailer', 'Lowboy / RGN'],
  'Flatbed Trailers': ['Flatbed trailer', 'Plataforma (flatbed)'],
  'Drop Deck Trailers': ['Drop deck / step deck trailer', 'Drop deck / step deck'],
  'Refuse Trailers': ['Refuse / transfer trailer', 'Trailer de basura / transferencia'],
  'Pneumatic / Dry Bulk': ['Pneumatic dry bulk tanker', 'Tanque neumático (dry bulk)'],
  'Curtain Side / Roll Tarp Trailers': ['Curtain side / roll tarp trailer', 'Curtain side / roll tarp'],
  'Live Floor Trailers': ['Live floor (walking floor) trailer', 'Walking floor (live floor)'],
  'Traveling Axle Trailers': ['Traveling axle trailer', 'Traveling axle'],
  'Log Trailers': ['Log trailer', 'Trailer maderero'],
  'Hopper / Grain Trailers': ['Hopper / grain trailer', 'Tolva / granos'],
  'Moving': ['Moving van trailer', 'Trailer de mudanza'],
  'Tag Trailers': ['Tag (equipment) trailer', 'Tag trailer (equipo)'],
  'Dump Trailers': ['Light-duty dump trailer (14K–16K)', 'Dump ligero (14K–16K)'],
  'Tilt Trailers': ['Tilt equipment trailer (14K)', 'Tilt trailer (14K)'],
  'Flatbed / Tag Trailers': ['Flatbed tag trailer (16K)', 'Flatbed tag (16K)'],
  'Sleeper Trucks': ['Sleeper truck (tractor)', 'Tractocamión con dormitorio'],
  'Day Cab Trucks': ['Day cab truck (tractor)', 'Tractocamión day cab'],
  'Yard Spotter Trucks': ['Yard spotter truck', 'Yard spotter (terminal)'],
  'Cargo / Straight': ['Straight / box truck', 'Camión de caja (straight truck)']
};

const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');
const range = (g) => (g[3] === g[5] ? usd(g[3]) : `${usd(g[3])}&ndash;${usd(g[5])}`);
const years = (g) => (g[6] === g[7] ? `${g[6]}` : `${g[6]}&ndash;${g[7]}`);
const KEEP = new Set(['MAC', 'XL', 'CIE', 'WADE']);
const brand = (s) => s.split('/').map((b) => b.replace(' TRAILER MFG', '').split(' ').map((w) => KEEP.has(w) ? w : w.charAt(0) + w.slice(1).toLowerCase()).join(' ')).join(', ');
const find = (cat, cond) => DATA.groups.find((g) => g[0] === cat && g[1] === cond);
const monthYear = (lang) => new Date(DATA.snapshot + 'T12:00:00Z').toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const dateLong = (lang) => new Date(DATA.snapshot + 'T12:00:00Z').toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export default ({ R, intro, section, table, articleLd, SITE }) => {
  const enPath = R('semi-trailer-prices');
  const esPath = R('es/precios-de-trailers');
  const groups = [...DATA.groups].filter((g) => NAMES[g[0]]);
  const trailers = groups.filter((g) => !/Trucks|Straight/.test(g[0]));
  const trucks = groups.filter((g) => /Trucks|Straight/.test(g[0]));
  const row = (li) => (g) => [NAMES[g[0]][li], li ? (g[1] === 'New' ? 'Nuevo' : 'Usado') : g[1], range(g), usd(g[4]), years(g), brand(g[8]), String(g[2])];

  const k = {
    reeferNew: find('Reefer Trailers', 'New'), reeferUsed: find('Reefer Trailers', 'Used'),
    dryNew: find('Dry Van Trailers', 'New'), dryUsed: find('Dry Van Trailers', 'Used'),
    endNew: find('End', 'New'), lowboyNew: find('Lowboy Trailers', 'New'),
    flatNew: find('Flatbed Trailers', 'New'), dropNew: find('Drop Deck Trailers', 'New'),
    sleeperUsed: find('Sleeper Trucks', 'Used')
  };
  const line = (label, g, li = 0) => g ? `<li><strong>${label}:</strong> ${range(g)} (${li ? 'mediana' : 'median'} ${usd(g[4])}, ${g[2]} ${li ? 'unidades' : 'units'}, ${years(g)})</li>` : '';

  const dataset = (lang) => ({
    '@context': 'https://schema.org', '@type': 'Dataset',
    name: lang === 'es' ? `Precios de trailers en inventario de Nationwide Haul — ${dateLong('es')}` : `Nationwide Haul inventory trailer prices — ${dateLong('en')}`,
    description: `Asking-price ranges and medians by equipment type and condition, computed from ${DATA.priced_units} priced units in Nationwide Haul's live inventory.`,
    url: SITE + (lang === 'es' ? esPath : enPath),
    distribution: { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${SITE}/data/inventory-prices.json` },
    temporalCoverage: DATA.snapshot, dateModified: DATA.snapshot,
    creator: { '@type': 'Organization', '@id': `${SITE}/#organization`, name: 'Nationwide Haul' },
    variableMeasured: ['asking price (USD)', 'model year', 'condition', 'equipment type']
  });

  const en = {
    path: enPath,
    alternates: [{ lang: 'en', path: enPath }, { lang: 'es', path: esPath }],
    title: `Semi-Trailer Prices ${DATA.snapshot.slice(0, 4)}: Real Dealer Data | Nationwide Haul`,
    description: `How much does a semi-trailer cost? Real asking prices from ${DATA.priced_units} units in our inventory: reefers, dry vans, flatbeds, lowboys, dumps. Updated weekly.`,
    h1: `Semi-Trailer Prices (${monthYear('en')})`,
    lede: `Real asking prices from ${DATA.priced_units} trucks and trailers in Nationwide Haul&rsquo;s inventory &mdash; updated weekly.`,
    ogType: 'article',
    updated: dateLong('en'),
    body: intro(
      `<strong>As of ${dateLong('en')}, a new 53 ft reefer trailer costs ${range(k.reeferNew)} at Nationwide Haul (median ${usd(k.reeferNew[4])}), and a new dry van costs ${range(k.dryNew)}.</strong> Prices below are actual asking prices across ${DATA.priced_units} priced units in our live inventory, grouped by equipment type and condition.`,
      `<ul style="display:inline-block;text-align:left;margin:8px auto 0;padding-left:18px;">${line('New reefer trailer', k.reeferNew)}${line('Used reefer trailer', k.reeferUsed)}${line('New dry van', k.dryNew)}${line('Used dry van', k.dryUsed)}${line('New MAC end dump', k.endNew)}${line('New lowboy / RGN', k.lowboyNew)}${line('New flatbed', k.flatNew)}${line('New drop deck', k.dropNew)}${line('Used sleeper truck', k.sleeperUsed)}</ul>`
    ) + section(`  <h2>Trailer Prices by Type</h2>
${table('Trailer prices by type', ['Equipment', 'Condition', 'Price range', 'Median', 'Model years', 'Brands', 'Units'], trailers.map(row(0)))}
  <h2>Truck Prices</h2>
${table('Truck prices', ['Equipment', 'Condition', 'Price range', 'Median', 'Model years', 'Brands', 'Units'], trucks.map(row(0)))}`) + section(`  <h2>What Moves the Price</h2>
  <p><strong>New vs. used:</strong> a 2019&ndash;2020 used reefer lists around ${k.reeferUsed ? usd(k.reeferUsed[4]) : 'a third of new'} versus ${usd(k.reeferNew[4])} for a new one. <strong>Spec:</strong> axle count, deck length, aluminum vs. steel, and (for reefers) the refrigeration unit drive most of the spread within a type. <strong>Brand and build:</strong> see our <a href="${R('dump-trailer-buying-guide')}">dump trailer</a> and <a href="${R('dry-van-vs-reefer-trailer')}">dry van vs. reefer</a> guides.</p>
  <h2>How These Numbers Are Calculated</h2>
  <p>Every week we read the asking price of every priced unit in our live inventory, group units by equipment type and condition, and publish the low, median and high. Prices exclude taxes, fees and delivery, and change as units sell. Units listed as &ldquo;call for price&rdquo; are not included. Raw data: <a href="/data/inventory-prices.json">inventory-prices.json</a>.</p>
  <p>Finance any of these with <a href="/financing/">NEF NOW</a> (credit from 500) or compare <a href="${R('lease-vs-buy-semi-trailer')}">lease vs. buy</a>. <a href="${esPath}">Versión en español</a>.</p>`, true),
    faq: [
      ['How much does a new reefer trailer cost?', `As of ${dateLong('en')}, new 53 ft reefer trailers at Nationwide Haul list for ${range(k.reeferNew)}, with a median of ${usd(k.reeferNew[4])} (${brand(k.reeferNew[8])}, model year ${years(k.reeferNew)}).`],
      ['How much does a used reefer trailer cost?', k.reeferUsed ? `Used reefers in our inventory (model years ${years(k.reeferUsed)}) list for ${range(k.reeferUsed)}.` : 'Used reefer pricing varies by year and refrigeration unit hours; call for current units.'],
      ['How much does a 53 ft dry van trailer cost?', `New dry vans list for ${range(k.dryNew)}${k.dryUsed ? `; used ${years(k.dryUsed)} dry vans list around ${usd(k.dryUsed[4])}` : ''}.`],
      ['How much does a lowboy trailer cost?', `New lowboy / RGN trailers list for ${range(k.lowboyNew)}, median ${usd(k.lowboyNew[4])}, depending on capacity and neck type.`],
      ['How much does an end dump trailer cost?', `New MAC end dump trailers list for ${range(k.endNew)}, median ${usd(k.endNew[4])}.`],
      ['How often are these prices updated?', 'Weekly, from Nationwide Haul&rsquo;s live inventory. Prices exclude taxes, fees and delivery.']
    ],
    schema: [articleLd(enPath, `Semi-Trailer Prices (${monthYear('en')})`, 'Real asking prices from Nationwide Haul inventory.'), dataset('en')],
    cta: { title: 'See Today’s Inventory', text: 'Prices change as units sell &mdash; browse live inventory or call (877) 559-7039.' }
  };
  const es = {
    path: esPath, lang: 'es',
    alternates: [{ lang: 'es', path: esPath }, { lang: 'en', path: enPath }],
    title: `Precios de Trailers ${DATA.snapshot.slice(0, 4)}: Datos Reales | Nationwide Haul`,
    description: `¿Cuánto cuesta un trailer? Precios reales de ${DATA.priced_units} unidades en nuestro inventario: reefers, dry vans, plataformas, lowboys y dumps. Se actualiza cada semana.`,
    h1: `Precios de Trailers (${monthYear('es')})`,
    lede: `Precios reales de ${DATA.priced_units} camiones y trailers del inventario de Nationwide Haul &mdash; actualizados cada semana.`,
    ogType: 'article', updated: dateLong('es'), crumbsName: 'Recursos',
    body: intro(
      `<strong>Al ${dateLong('es')}, un trailer refrigerado (reefer) nuevo de 53 pies cuesta ${range(k.reeferNew)} en Nationwide Haul (mediana ${usd(k.reeferNew[4])}), y un dry van nuevo cuesta ${range(k.dryNew)}.</strong> Son precios de lista reales de ${DATA.priced_units} unidades con precio en nuestro inventario.`,
      `<ul style="display:inline-block;text-align:left;margin:8px auto 0;padding-left:18px;">${line('Reefer nuevo', k.reeferNew, 1)}${line('Reefer usado', k.reeferUsed, 1)}${line('Dry van nuevo', k.dryNew, 1)}${line('Dry van usado', k.dryUsed, 1)}${line('End dump MAC nuevo', k.endNew, 1)}${line('Lowboy / RGN nuevo', k.lowboyNew, 1)}${line('Plataforma nueva', k.flatNew, 1)}${line('Tractocamión usado', k.sleeperUsed, 1)}</ul>`
    ) + section(`  <h2>Precios por Tipo de Trailer</h2>
${table('Precios por tipo', ['Equipo', 'Condición', 'Rango', 'Mediana', 'Años', 'Marcas', 'Unidades'], trailers.map(row(1)))}
  <h2>Precios de Camiones</h2>
${table('Precios camiones', ['Equipo', 'Condición', 'Rango', 'Mediana', 'Años', 'Marcas', 'Unidades'], trucks.map(row(1)))}`) + section(`  <h2>Cómo Calculamos Estos Precios</h2>
  <p>Cada semana leemos el precio de cada unidad con precio en nuestro inventario, las agrupamos por tipo y condición, y publicamos el mínimo, la mediana y el máximo. No incluyen impuestos, cargos ni entrega, y cambian conforme se venden las unidades. Datos: <a href="/data/inventory-prices.json">inventory-prices.json</a>.</p>
  <p>Financie cualquiera con <a href="${R('es/financiamiento-trailer-mal-credito')}">NEF NOW (crédito desde 500)</a>. Contamos con asesores que hablan español: llame al <a href="tel:8775597039">(877) 559-7039</a>. <a href="${enPath}">English version</a>.</p>`, true),
    faq: [
      ['¿Cuánto cuesta un trailer refrigerado (reefer) nuevo?', `Al ${dateLong('es')}, los reefers nuevos de 53 pies en Nationwide Haul cuestan ${range(k.reeferNew)}, con mediana de ${usd(k.reeferNew[4])}.`],
      ['¿Cuánto cuesta un dry van de 53 pies?', `Los dry vans nuevos cuestan ${range(k.dryNew)}${k.dryUsed ? `; los usados ${years(k.dryUsed)} rondan ${usd(k.dryUsed[4])}` : ''}.`],
      ['¿Cuánto cuesta un lowboy?', `Los lowboys / RGN nuevos cuestan ${range(k.lowboyNew)}, mediana ${usd(k.lowboyNew[4])}.`],
      ['¿Cada cuánto se actualizan los precios?', 'Cada semana, a partir del inventario real de Nationwide Haul. No incluyen impuestos, cargos ni entrega.']
    ],
    schema: [{ ...articleLd(esPath, `Precios de Trailers (${monthYear('es')})`, 'Precios reales del inventario de Nationwide Haul.'), inLanguage: 'es' }, dataset('es')],
    cta: { title: 'Vea el Inventario de Hoy', text: 'Los precios cambian conforme se venden las unidades &mdash; llame al (877) 559-7039.' }
  };
  return [en, es];
};
