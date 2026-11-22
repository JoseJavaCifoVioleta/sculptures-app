const PROFILES = {
  bronze: {
    id: 'bronze',
    label: 'Bronze',
    description: 'Dark patinated bronze',
    swatch: ['#4a392b', '#7d8d73'],
    material: {
      color: '#ffffff',
      metalness: 0.64,
      roughness: 0.64,
      clearcoat: 0.04,
      clearcoatRoughness: 0.72,
      envMapIntensity: 1,
    },
  },
  steel: {
    id: 'steel',
    label: 'Polished metal',
    description: 'Mirror-polished steel and aluminium',
    swatch: ['#c7ced1', '#ffffff'],
    material: {
      color: '#e4e9eb',
      metalness: 1,
      roughness: 0.08,
      envMapIntensity: 2.6,
    },
  },
  stone: {
    id: 'stone',
    label: 'Volcanic stone',
    description: 'Matte, porous volcanic stone',
    swatch: ['#3f403e', '#77766f'],
    material: {
      color: '#ffffff',
      metalness: 0,
      roughness: 0.94,
      envMapIntensity: 0.35,
      flatShading: true,
    },
  },
  plaster: {
    id: 'plaster',
    label: 'Travertine',
    description: 'Cream travertine and gallery plaster',
    swatch: ['#d8cdb8', '#f4efe4'],
    material: {
      color: '#ffffff',
      metalness: 0,
      roughness: 0.78,
      clearcoat: 0.06,
      envMapIntensity: 0.45,
    },
  },
}

/**
 * Traduce el campo material de la obra a una familia visual. No pretendemos
 * identificar la roca exacta: agrupamos por comportamiento óptico.
 */
export function getMaterialProfile(material) {
  const value = String(material ?? '').toLocaleLowerCase()

  if (/bronze|brass|copper|patina/.test(value)) return PROFILES.bronze
  if (/steel|aluminium|aluminum|chrome|mirror|metal/.test(value)) {
    return PROFILES.steel
  }
  if (/basalt|stone|granite|marble|volcanic|rock|slate/.test(value)) {
    return PROFILES.stone
  }

  return PROFILES.plaster
}

/**
 * Etiqueta corta para el chip de las tarjetas: "Stainless steel and
 * aluminium" se queda entero, pero "Polyester, mosaic and paint" se reduce a
 * "Polyester".
 */
export function getMaterialLabel(material) {
  const value = String(material ?? '').trim()
  if (!value) return 'Mixed media'

  return value.split(/[,/]/)[0].trim() || value
}

export { PROFILES }
