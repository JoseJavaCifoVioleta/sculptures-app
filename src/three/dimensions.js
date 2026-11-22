const DEFAULT_PROPORTIONS = {
  height: 1.9,
  width: 1.25,
  depth: 1.05,
  plinthHeight: 0.42,
  plinthWidth: 1.05,
  plinthDepth: 0.85,
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

/**
 * Convierte strings como "420 × 310 × 280 cm" o "2,300 × 3,200 × 3,200 cm"
 * en una lista de números. También acepta decimales con coma.
 */
export function parseDimensionNumbers(dimensions) {
  if (typeof dimensions !== 'string') return []

  const tokens =
    dimensions.match(/\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?/g) ?? []

  return tokens
    .map((token) => {
      if (/^\d{1,3}(?:[.,]\d{3})+$/.test(token)) {
        return Number(token.replace(/[.,]/g, ''))
      }

      return Number(token.replace(',', '.'))
    })
    .filter((value) => Number.isFinite(value) && value > 0)
}

/**
 * Normaliza las medidas reales a una escala de escena. La altura se mantiene
 * constante para que todas las obras se vean bien encuadradas; el ancho y la
 * profundidad conservan la proporción real de la pieza.
 */
export function getSculptureProportions(dimensions) {
  const [heightCm, widthCm, depthCm] = parseDimensionNumbers(dimensions)

  if (!heightCm) return DEFAULT_PROPORTIONS

  const height = DEFAULT_PROPORTIONS.height
  const width = clamp(((widthCm ?? heightCm) / heightCm) * height, 0.55, 2.6)
  const depth = clamp(
    ((depthCm ?? widthCm ?? heightCm) / heightCm) * height,
    0.45,
    2.6,
  )

  return {
    height,
    width,
    depth,
    plinthHeight: DEFAULT_PROPORTIONS.plinthHeight,
    plinthWidth: Math.max(1.05, width * 0.72),
    plinthDepth: Math.max(0.85, depth * 0.72),
  }
}

/**
 * Hash estable para que cada obra tenga siempre la misma variante geométrica.
 */
export function hashString(value) {
  let hash = 2166136261

  for (let index = 0; index < String(value).length; index += 1) {
    hash ^= String(value).charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return Math.abs(hash)
}
