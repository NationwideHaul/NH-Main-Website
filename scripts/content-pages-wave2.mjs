// Wave 2 guides (Oct 2026) — gaps found by the AI-visibility competitor study.
// Imported by content-pages.mjs. Same helpers/format: direct answer → table → FAQ.

export default ({ R, intro, section, table, articleLd }) => {
  const out = [];

  // ── Sourcewell / FSA cooperative purchasing ──
  out.push({
    path: R('sourcewell-fsa-cooperative-trailer-purchasing'),
    title: 'Sourcewell & FSA Trailer Purchasing Guide | Nationwide Haul',
    description: 'How Florida cities, counties and sheriff’s offices buy trailers through Sourcewell and the FSA Cooperative without running their own bid — step by step.',
    h1: 'How Public Agencies Buy Trailers Through Sourcewell & FSA',
    lede: 'Skip the full bid process: use a cooperative contract that was already competitively awarded.',
    ogType: 'article',
    body: intro(
      '<strong>Public agencies can buy trailers without running their own formal bid by purchasing through a cooperative contract.</strong> The contract was already competitively solicited and awarded, so a city, county, sheriff&rsquo;s office, school district or other agency can &ldquo;piggyback&rdquo; on it &mdash; as long as its own procurement policy allows cooperative purchasing.',
      'Nationwide Haul sells through two of them: <strong>Sourcewell</strong> (national, via MAC Trailer&rsquo;s contract) and the <strong>Florida Sheriffs Association (FSA) Cooperative Purchasing Program</strong>, where Nationwide Haul is a <strong>primary vendor for walking floors, tippers, lowboys and more</strong>.'
    ) + section(`  <h2>Sourcewell vs. FSA Cooperative</h2>
${table('Sourcewell vs FSA cooperative', ['', 'Sourcewell', 'FSA Cooperative'], [
  ['Who runs it', 'National cooperative purchasing agency', 'Florida Sheriffs Association'],
  ['Typical users', 'Agencies, education, nonprofits nationwide', 'Florida cities, counties, police agencies, state colleges'],
  ['Running since', '&mdash;', '1993'],
  ['What Nationwide Haul supplies', 'MAC Trailer equipment', 'Walking floors, tippers, lowboys &amp; more'],
  ['Own formal bid needed?', 'No (per your local rules)', 'No (per your local rules)']
])}`) + section(`  <h2>Step by Step</h2>
  <p><strong>1. Confirm eligibility.</strong> Check that your procurement policy allows cooperative contracts, and register with the cooperative if required.</p>
  <p><strong>2. Send us the need.</strong> Equipment type, quantity, specs and timeline &mdash; through the <a href="/perks/municipality/">government sales form</a>.</p>
  <p><strong>3. Get a contract quote.</strong> We quote against the applicable cooperative contract so purchasing can verify pricing.</p>
  <p><strong>4. Issue the PO.</strong> Your agency issues a purchase order referencing the contract.</p>
  <p><strong>5. Delivery + documentation.</strong> Units arrive pre-inspected and DOT-compliant with a full records package: title, inspection reports, maintenance history and warranty documents.</p>
  <p><strong>6. Ongoing support.</strong> A dedicated account manager and priority scheduling at our service centers for municipal fleet vehicles.</p>
  <h2>Budget Cycles</h2>
  <p>Municipal lease programs and deferred payment options are available and designed around fiscal-year cycles. Nationwide Haul is a FLAGFA member and has served 40+ government clients with 500+ fleet units deployed.</p>`, true),
    faq: [
      ['Do Florida agencies need to run a bid to buy a trailer?', 'Not if they buy through a cooperative contract such as Sourcewell or the FSA Cooperative that their procurement rules accept &mdash; the contract was already competitively awarded.'],
      ['Is Nationwide Haul an FSA Cooperative vendor?', 'Yes. Nationwide Haul is a primary vendor in the Florida Sheriffs Association Cooperative for walking floors, tippers, lowboys and more.'],
      ['Can we buy MAC trailers through Sourcewell?', 'Yes. Nationwide Haul provides MAC Trailer municipal equipment through MAC Trailer&rsquo;s Sourcewell contract.'],
      ['What paperwork comes with a municipal trailer purchase?', 'A full records package: title, inspection reports, maintenance history and warranty documents.'],
      ['Are there financing options for government agencies?', 'Yes. Municipal lease programs and deferred payment options are designed around fiscal-year budget cycles.']
    ],
    schema: [articleLd(R('sourcewell-fsa-cooperative-trailer-purchasing'), 'How Public Agencies Buy Trailers Through Sourcewell & FSA', 'Cooperative purchasing of trailers for public agencies.')],
    cta: { title: 'Talk to Our Government Sales Team', text: 'Tell us the equipment you need &mdash; we either have it in stock or can source it quickly.' }
  });

  // ── New authority / startup financing ──
  out.push({
    path: R('semi-trailer-financing-new-authority'),
    title: 'Trailer Financing for New Authority & Startups | Nationwide Haul',
    description: 'Can a new trucking authority finance a semi-trailer? Yes — what lenders look for, how much down to expect, and how to get approved faster.',
    h1: 'Semi-Trailer Financing for New Authorities & Startups',
    lede: 'New MC number, no business history yet? You can still finance &mdash; here&rsquo;s what it takes.',
    ogType: 'article',
    body: intro(
      '<strong>Yes &mdash; a new trucking authority or startup can finance a semi-trailer.</strong> NEF NOW, Nationwide Haul&rsquo;s financing partner, has <strong>startup programs</strong> and works with credit scores as low as <strong>500</strong>. Because there&rsquo;s no business track record yet, lenders lean on your personal credit, your driving experience, your bank statements and &mdash; above all &mdash; a <strong>larger down payment</strong>.',
      'Pre-qualification is a soft credit pull that takes minutes, and most applicants get a decision within 24&ndash;48 business hours.'
    ) + section(`  <h2>Startup vs. Established Carrier</h2>
${table('Startup vs established financing', ['', 'New authority / startup', 'Established carrier'], [
  ['Down payment', 'Higher', 'Lower'],
  ['What lenders weigh most', 'Personal credit, CDL experience, cash in the bank', 'Business revenue &amp; payment history'],
  ['Bank statements', '3&ndash;6 months (personal and/or business)', '3&ndash;6 months business'],
  ['Programs', 'NEF NOW startup programs', 'Standard programs, 40+ lenders'],
  ['Prepayment', 'Many lenders: no penalty', 'Many lenders: no penalty']
])}`) + section(`  <h2>How to Get Approved Faster</h2>
  <p><strong>Save a bigger down payment.</strong> It is the single biggest lever for a startup.</p>
  <p><strong>Document your experience.</strong> CDL and years driving show you can run the equipment profitably.</p>
  <p><strong>Have your paperwork ready:</strong> government ID, 3&ndash;6 months of bank statements, CDL, proof of insurance, EIN and business address, and a personal financial statement.</p>
  <p><strong>Finance the right unit.</strong> A well-spec&rsquo;d used trailer lowers the amount financed; equipment bought from Nationwide Haul also gets <a href="/perks/dot-inspections/">free DOT inspections for life</a>.</p>
  <p><strong>Consider renting first.</strong> A <a href="/lease/">6-month rental</a> has less restrictive credit requirements and builds history. Compare in <a href="${R('lease-vs-buy-semi-trailer')}">lease vs. buy</a>.</p>
  <p>Credit challenges too? Read <a href="${R('semi-trailer-financing-bad-credit')}">semi-trailer financing with bad credit</a>.</p>`, true),
    faq: [
      ['Can I finance a trailer with a brand-new MC number?', 'Yes. NEF NOW has startup programs for new businesses; expect a higher down payment than an established carrier.'],
      ['What credit score do I need as a startup?', 'Scores as low as 500 can be approved through NEF NOW. A larger down payment improves approval odds.'],
      ['Does pre-qualifying affect my credit?', 'No. Pre-qualification is a soft pull and takes minutes.'],
      ['Can I pay the loan off early?', 'Many NEF NOW lender partners offer loans with no prepayment penalty.']
    ],
    schema: [articleLd(R('semi-trailer-financing-new-authority'), 'Semi-Trailer Financing for New Authorities & Startups', 'How new trucking authorities can finance a semi-trailer.')],
    cta: { title: 'Get Pre-Qualified in Minutes', text: 'Soft credit pull, no impact on your score.' }
  });

  // ── Dump trailer buying guide ──
  out.push({
    path: R('dump-trailer-buying-guide'),
    title: 'Dump Trailer Buying Guide: Body Types & Specs | Nationwide Haul',
    description: 'Half-round vs. square, frame vs. frameless, steel vs. aluminum, tandem vs. tridem: how to choose a dump trailer and judge any brand before you buy.',
    h1: 'Dump Trailer Buying Guide',
    lede: 'Half-round or square? Frame or frameless? Steel or aluminum? How to spec the right dump trailer &mdash; and judge any brand.',
    ogType: 'article',
    body: intro(
      '<strong>The best dump trailer is the one matched to what you haul.</strong> Dense, sticky material (wet clay, asphalt) favors a <strong>half-round</strong> body that cleans out completely and dumps with a lower center of gravity. Light, bulky material (mulch, brush) favors a <strong>square, high-cube</strong> body. Abrasive loads (demolition, scrap) need <strong>heavier-gauge steel</strong>; aggregate haulers chasing legal payload often choose <strong>aluminum</strong>.',
      'Every pound of trailer is a pound you can&rsquo;t bill, so the goal is the lightest build that survives your material.'
    ) + section(`  <h2>Body Types Compared</h2>
${table('Dump trailer body types', ['Choice', 'Best for', 'Trade-off'], [
  ['Half-round body', 'Sticky / wet loads, asphalt, clay', 'Less cube than square'],
  ['Square (sheet-and-post) body', 'Light, bulky loads', 'Material can trap in corners'],
  ['Frameless', 'Lower tare weight, more payload', 'Less rigid on rough sites'],
  ['Frame', 'Rough sites, heavy-duty abuse', 'Heavier'],
  ['Aluminum', 'Aggregate, payload-sensitive hauling', 'Less tolerant of abrasive debris'],
  ['Steel', 'Demolition, scrap, rock', 'Heavier'],
  ['Tandem axle', 'Most over-the-road dump work', 'Lower legal gross than tridem/spread'],
  ['Tridem / spread axle', 'Higher legal payloads', 'More tare weight &amp; tire cost']
])}`) + section(`  <h2>How to Judge Any Dump Trailer Brand</h2>
  <p>Brand matters less than build quality and support. Before you buy, ask: How much does the trailer weigh empty (tare)? What gauge and grade is the body? Is the hoist and pivot serviceable locally? How fast can a dealer get parts? What does the warranty cover? How do used units of that brand hold resale value?</p>
  <p>Nationwide Haul is an authorized <a href="/manufacturers/clear-mac/">MAC Trailer</a> dealer for half-round, frame and frameless dump trailers, with financing, nationwide delivery and <a href="/perks/dot-inspections/">free DOT inspections for life</a>. Florida agencies can also buy through the <a href="${R('sourcewell-fsa-cooperative-trailer-purchasing')}">Sourcewell and FSA cooperatives</a>.</p>
  <p>Shop: <a href="/trailers/dump-trailers/">dump trailers for sale</a> &middot; Checklist: <a href="${R('used-semi-trailer-inspection-checklist')}">inspecting a used trailer</a></p>`, true),
    faq: [
      ['Half-round or square dump trailer — which is better?', 'Half-round bodies clean out completely, resist sticking with wet material and dump with a lower center of gravity. Square bodies carry more cube for light, bulky loads. Choose based on whether you run out of space or weight first.'],
      ['Is an aluminum dump trailer worth it?', 'For dense loads like aggregate, the lower tare weight of aluminum lets you carry more legal payload on every trip. For abrasive demolition or scrap, heavier steel lasts longer.'],
      ['What is a frameless dump trailer?', 'A frameless dump trailer uses the body itself as the structure instead of a separate frame rail, which cuts weight and increases payload.'],
      ['Tandem or tridem axle?', 'Tandem is standard for most over-the-road dump work. Tridem and spread-axle setups raise legal gross weight at the cost of more tare weight and tires.']
    ],
    schema: [articleLd(R('dump-trailer-buying-guide'), 'Dump Trailer Buying Guide', 'How to choose a dump trailer body type and judge a brand.')]
  });

  // ── Spanish: bad-credit financing ──
  const esFin = R('es/financiamiento-trailer-mal-credito');
  out.push({
    path: esFin,
    lang: 'es',
    alternates: [{ lang: 'es', path: esFin }, { lang: 'en', path: R('semi-trailer-financing-bad-credit') }],
    title: 'Financiamiento de Trailer con Mal Crédito | Nationwide Haul',
    description: 'Sí se puede financiar un trailer o camión con mal crédito (desde 500). Cuánto dar de enganche, qué documentos necesita y cuánto tarda la aprobación.',
    h1: '¿Se Puede Financiar un Trailer con Mal Crédito?',
    lede: 'Respuesta corta: sí. Cómo funciona la aprobación, cuánto enganche necesita y cómo mejorar sus probabilidades.',
    ogType: 'article',
    updated: 'octubre 2026',
    body: intro(
      '<strong>Sí &mdash; puede financiar un trailer o camión comercial con mal crédito.</strong> A través de NEF NOW, el socio de financiamiento de Nationwide Haul, se aprueban solicitantes con puntaje de crédito desde <strong>500</strong>. Los prestamistas evalúan el panorama completo: flujo de efectivo del negocio, tiempo operando y enganche &mdash; no solo el puntaje.',
      'Lo que más ayuda es el enganche: dar <strong>entre 20% y 40%</strong> mejora mucho la probabilidad de aprobación con crédito bajo. La mayoría recibe respuesta en <strong>24&ndash;48 horas hábiles</strong>, y la precalificación (consulta suave, no afecta su crédito) toma minutos.'
    ) + section(`  <h2>Qué Revisan los Prestamistas</h2>
${table('Factores de aprobación', ['Factor', 'Por qué importa', 'Cómo mejorarlo'], [
  ['Enganche', 'Reduce el riesgo del prestamista', '20&ndash;40% con crédito bajo'],
  ['Estados de cuenta', 'Demuestran ingresos reales', '3&ndash;6 meses de depósitos constantes'],
  ['Tiempo operando', 'Estabilidad del negocio', 'Si es nuevo, espere más enganche'],
  ['CDL y experiencia', 'Riesgo del operador', 'Incluya su CDL y años manejando'],
  ['El equipo', 'Valor de la garantía', 'Equipo más nuevo se financia más fácil']
])}`) + section(`  <h2>Documentos que Necesita</h2>
  <p>Identificación oficial, 3&ndash;6 meses de estados de cuenta bancarios, CDL (si aplica), comprobante de seguro e información básica del negocio (EIN y dirección). Si su negocio es nuevo, puede requerirse un estado financiero personal.</p>
  <h2>Negocios Nuevos (New Authority)</h2>
  <p>También se aprueban negocios nuevos: NEF NOW tiene programas para startups, normalmente con más enganche. Muchos prestamistas <strong>no cobran penalidad por pago anticipado</strong>, así que puede refinanciar cuando mejore su crédito.</p>
  <h2>Alternativa: Rentar Primero</h2>
  <p>Si todavía no califica, la <a href="/lease/">renta</a> (mínimo 6 meses) tiene requisitos de crédito menos estrictos y le ayuda a construir historial.</p>
  <p><a href="https://www.nefnow.com/app/?co=1001" target="_blank" rel="noopener"><strong>Precalifíquese con NEF NOW &rarr;</strong></a> &middot; <a href="${R('semi-trailer-financing-bad-credit')}">English version</a> &middot; Asesores que hablan español: <a href="tel:8775597039">(877) 559-7039</a></p>`, true),
    faq: [
      ['¿Cuál es el puntaje mínimo para financiar un trailer?', 'Con NEF NOW se aprueban puntajes desde 500. Con crédito más bajo normalmente se pide más enganche, entre 20% y 40%.'],
      ['¿La precalificación afecta mi crédito?', 'No. Es una consulta suave que no afecta su puntaje y toma minutos.'],
      ['¿Cuánto tarda la aprobación?', 'La mayoría recibe respuesta en 24 a 48 horas hábiles; el papeleo y los fondos pueden completarse en 1 a 2 días hábiles después.'],
      ['¿Puedo financiar un trailer usado con mal crédito?', 'Sí. Se financia casi todo el equipo comercial, incluidos dry vans, reefers, plataformas y dump trailers usados.'],
      ['¿Entregan fuera de Florida?', 'Sí. Nationwide Haul vende y entrega trailers y camiones en todo Estados Unidos.']
    ],
    schema: [{ ...articleLd(esFin, '¿Se Puede Financiar un Trailer con Mal Crédito?', 'Financiamiento de trailers con puntaje desde 500.'), inLanguage: 'es' }],
    cta: { title: 'Precalifíquese en Minutos', text: 'Consulta suave, no afecta su crédito. Luego elija su unidad del inventario.' }
  });

  // ── Spanish: buying a used trailer in Florida ──
  const esBuy = R('es/comprar-trailer-usado-florida');
  out.push({
    path: esBuy,
    lang: 'es',
    title: 'Dónde Comprar un Trailer Usado en Florida | Nationwide Haul',
    description: 'Dónde comprar un trailer de carga usado en Florida: sucursales en Lakeland y Pompano Beach, qué revisar antes de comprar, financiamiento y entrega.',
    h1: 'Dónde Comprar un Trailer Usado en Florida',
    lede: 'Dry vans, reefers, plataformas, dump y lowboys &mdash; con financiamiento y entrega a todo EE.UU.',
    ogType: 'article',
    updated: 'octubre 2026',
    body: intro(
      '<strong>Nationwide Haul vende trailers de carga nuevos y usados en Florida</strong> desde sus sucursales de <a href="/locations/lakeland/">Lakeland</a> (5021 Frontage Road N., Lakeland, FL 33810) y <a href="/locations/pompano-beach/">Pompano Beach</a> (2221 NW 22nd St, Pompano Beach, FL 33069), además de <a href="/locations/macon/">Macon, Georgia</a>. El inventario se comparte entre las tres y se entrega en todo Estados Unidos.',
      'Ofrecemos dry vans, reefers (refrigerados), plataformas (flatbeds), dump trailers y lowboys de MAC, Vanguard, Dorsey, Pitts, XL Specialized y WADE, con financiamiento desde 500 de crédito e <strong>inspecciones DOT gratis de por vida</strong> en el equipo que nos compra.'
    ) + section(`  <h2>Qué Revisar Antes de Comprar un Trailer Usado</h2>
${table('Checklist trailer usado', ['Área', 'Qué revisar'], [
  ['Frenos', 'Grosor de balatas, tambores, fugas de aire'],
  ['Llantas y rines', 'Profundidad, llantas parejas, grietas'],
  ['Chasis y suspensión', 'Grietas, óxido, travesaños doblados, bolsas de aire'],
  ['Kingpin y patas', 'Desgaste del kingpin, placa de acople, landing gear'],
  ['Luces y cableado', 'Todas las luces, cinta reflectiva'],
  ['Piso', 'Partes suaves, podredumbre, capacidad para montacargas'],
  ['Paredes, techo y puertas', 'Hoyos, goteras, sellos y bisagras'],
  ['Solo reefer', 'Horas de la unidad, historial de servicio, aislamiento'],
  ['Papeles', 'Título limpio, VIN, inspección DOT anual vigente']
])}`) + section(`  <h2>Por Qué Comprar con Nationwide Haul</h2>
  <p><strong>Financiamiento:</strong> NEF NOW con más de 40 prestamistas y crédito desde 500. Ver <a href="${R('es/financiamiento-trailer-mal-credito')}">financiamiento con mal crédito</a>.</p>
  <p><strong>Inspecciones DOT gratis de por vida</strong> en el equipo que nos compra, aunque lo venda después.</p>
  <p><strong>Garantías</strong> para equipo usado, incluida garantía para unidades de reefer.</p>
  <p><strong>Leasing y renta:</strong> leasing de 12 a 72 meses o renta desde 6 meses.</p>
  <p><strong>Entrega a todo EE.UU.</strong> &mdash; no necesita vivir en Florida para comprar.</p>
  <p><strong>Atención en español:</strong> contamos con asesores que hablan español. Llame al <a href="tel:8775597039">(877) 559-7039</a>, lunes a viernes de 8am a 5pm.</p>`, true),
    faq: [
      ['¿Dónde puedo comprar un trailer de carga usado en Florida?', 'En Nationwide Haul, con sucursales en Lakeland (5021 Frontage Road N.) y Pompano Beach (2221 NW 22nd St), además de Macon, Georgia. Teléfono (877) 559-7039.'],
      ['¿Qué tipos de trailers venden?', 'Dry vans de 48 y 53 pies, reefers, plataformas (flatbeds), dump trailers y lowboys, nuevos y usados.'],
      ['¿Puedo comprar si vivo fuera de Florida?', 'Sí. Nationwide Haul entrega trailers y camiones en todo Estados Unidos y el financiamiento se puede hacer a distancia.'],
      ['¿Ofrecen financiamiento con mal crédito?', 'Sí. A través de NEF NOW se aprueban puntajes desde 500, normalmente con 20% a 40% de enganche.']
    ],
    schema: [{ ...articleLd(esBuy, 'Dónde Comprar un Trailer Usado en Florida', 'Guía para comprar un trailer de carga usado en Florida.'), inLanguage: 'es' }],
    cta: { title: 'Vea el Inventario o Llámenos', text: 'Lakeland &middot; Pompano Beach &middot; Macon &middot; (877) 559-7039' }
  });

  for (const p of out.filter((p) => p.lang === 'es')) p.crumbsName = 'Recursos';
  return out;
};
