// Ficha editorial de las obras y los artistas.
// Los datos del catálogo viven en data.js; estos campos son presentación y
// contexto. Si una obra editada ya trae material o dimensiones, se respetan.

const WORK_DETAILS = {
  1: {
    material: 'Bronze, unique cast',
    dimensions: '420 × 310 × 280 cm',
    status: 'Available on request',
    credit: 'Studio cast, 2023',
  },
  2: {
    material: 'Stainless steel and aluminium',
    dimensions: '2,300 × 3,200 × 3,200 cm',
    status: 'Permanent public collection',
    credit: 'Site-specific commission',
  },
  3: {
    material: 'Bronze',
    dimensions: '213 × 120 × 110 cm',
    status: 'Available on request',
    credit: 'Edition 1 of 3',
  },
  4: {
    material: 'Basalt',
    dimensions: '420 × 160 × 180 cm',
    status: 'Monumental heritage work',
    credit: 'Rapa Nui, anonymous',
  },
  5: {
    material: 'Polyester, mosaic and paint',
    dimensions: '450 × 220 × 180 cm',
    status: 'Available on request',
    credit: 'Unique work',
  },
  6: {
    material: 'Bronze',
    dimensions: '290 × 110 × 90 cm',
    status: 'Available on request',
    credit: 'Cast from the artist’s studio edition',
  },
  7: {
    material: 'Carved iroko wood',
    dimensions: '185 × 70 × 55 cm',
    status: 'Available on request',
    credit: 'Unique carving',
  },
  8: {
    material: 'Polyester and pigment',
    dimensions: '300 × 150 × 120 cm',
    status: 'Available on request',
    credit: 'Unique work',
  },
  9: {
    material: 'Terracotta',
    dimensions: '180 × 70 × 60 cm (each figure)',
    status: 'Museum collection',
    credit: 'Excavated funerary ensemble',
  },
  10: {
    material: 'Painted wood assemblage',
    dimensions: '240 × 180 × 50 cm',
    status: 'Available on request',
    credit: 'Unique work',
  },
  11: {
    material: 'Wood, wire and wax',
    dimensions: '320 × 400 × 250 cm',
    status: 'Available on request',
    credit: 'Site-responsive installation',
  },
  12: {
    material: 'Bronze',
    dimensions: '140 × 80 × 60 cm (each)',
    status: 'Permanent public collection',
    credit: 'Commissioned by Taipei Zoo',
  },
}

const ARTIST_PROFILES = {
  'Marta Colvin Andrade': {
    years: '1915–1995',
    origin: 'Chile',
    bio: 'A central figure of modern Latin American sculpture, Colvin moved between stone, bronze and public commissions. Her abstract forms draw on pre-Hispanic symbols, landscape and the body, and her public works can be found across Chile and Europe.',
  },
  'Eduardo Catalano': {
    years: '1917–2010',
    origin: 'Argentina',
    bio: 'An architect and sculptor who studied and taught in the United States, Catalano is known for structures that combine engineering precision with a sculptural sense of movement. Floralis Genérica is his best-known public work.',
  },
  'John Woodrow Wilson': {
    years: '1922–2015',
    origin: 'United States',
    bio: 'A Boston-born sculptor, painter and printmaker, Wilson addressed equality, social justice and the spiritual dimensions of human presence. His monumental heads and figures combine political conviction with a quiet, enduring dignity.',
  },
  'Unknown Artist': {
    years: 'Authorship unrecorded',
    origin: 'Anonymous traditions',
    bio: 'The author of this work has not been recorded. It belongs to a lineage of anonymous monumental practice, where collective memory, ritual and place matter more than the name of an individual maker.',
  },
  'Niki de Saint Phalle': {
    years: '1930–2002',
    origin: 'France / United States',
    bio: 'Painter and sculptor, Saint Phalle is known for the Nanas: exuberant, larger-than-life feminine figures that celebrate maternity, freedom and joy. Her work moved from assemblage and painting to monumental public sculpture.',
  },
  'Barbara Hepworth': {
    years: '1903–1975',
    origin: 'United Kingdom',
    bio: 'One of the defining sculptors of British modernism, Hepworth developed a vocabulary of abstract, pierced and stacked forms shaped by landscape, people and the physical presence of materials. Her work is held in major collections worldwide.',
  },
  'Lamidi Olonade Fakeye': {
    years: '1928–2009',
    origin: 'Nigeria',
    bio: 'A fourth-generation Yoruba carver, Fakeye worked between traditional forms and contemporary commissions. His carved figures and equestrian scenes carry the visual memory of Yoruba ceremony into modern sculpture.',
  },
  'Alina Szapocznikow': {
    years: '1926–1973',
    origin: 'Poland',
    bio: 'Szapocznikow used casts of her own body, polyester and found materials to explore fragility, memory and impermanence. Her fragmented forms are among the most influential contributions to post-war sculpture.',
  },
  'Louise Nevelson': {
    years: '1899–1988',
    origin: 'Ukraine / United States',
    bio: 'Nevelson collected discarded wood and assembled it into monumental, monochrome walls. Her black and white environments transformed the debris of New York into a precise, almost architectural language of shadow and space.',
  },
  'Ranjani Shettar': {
    years: '1977–',
    origin: 'India',
    bio: 'Shettar creates sculptures and installations that bring together the handmade and the industrial, the natural and the constructed. Her delicate, gravity-defying forms ask how human labour and ecological systems meet.',
  },
  'Taipei Zoo': {
    years: 'Founded 1914',
    origin: 'Taiwan',
    bio: 'Taipei Zoo is a public institution and commissioner of site-specific works. Its Hippo Square turns a functional pathway into a playful encounter with bronze animals, placing sculpture at the centre of everyday public life.',
  },
}

const DEFAULT_WORK = {
  material: 'Mixed media',
  dimensions: 'Dimensions on request',
  status: 'Available on request',
  credit: 'Catalogue entry',
}

const DEFAULT_ARTIST = {
  years: 'Contemporary practice',
  origin: 'Artist biography on request',
  bio: 'A concise biography for this artist is being prepared. The work is presented here as part of the gallery’s evolving index of contemporary sculpture.',
}

export function getWorkDetails(sculpture) {
  const known = WORK_DETAILS[sculpture?.id] ?? {}

  return {
    material: sculpture?.material?.trim() || known.material || DEFAULT_WORK.material,
    dimensions:
      sculpture?.dimensions?.trim() ||
      known.dimensions ||
      DEFAULT_WORK.dimensions,
    status: known.status || DEFAULT_WORK.status,
    credit: known.credit || DEFAULT_WORK.credit,
  }
}

export function getArtistProfile(artist) {
  return ARTIST_PROFILES[artist] ?? DEFAULT_ARTIST
}
