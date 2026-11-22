import * as THREE from 'three'

const TEXTURE_SIZE = 256
const TEXTURE_CACHE = new Map()

function createRandom(seed) {
  let state = seed >>> 0

  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
}

function paintBase(context, color) {
  context.fillStyle = color
  context.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE)
}

function paintSpeckles(context, random, count, colors, maxRadius = 2.2) {
  for (let index = 0; index < count; index += 1) {
    const color = colors[Math.floor(random() * colors.length)]
    context.fillStyle = color
    context.beginPath()
    context.arc(
      random() * TEXTURE_SIZE,
      random() * TEXTURE_SIZE,
      0.3 + random() * maxRadius,
      0,
      Math.PI * 2,
    )
    context.fill()
  }
}

function paintBlotches(context, random, count, colors, maxRadius = 48) {
  for (let index = 0; index < count; index += 1) {
    const radius = 10 + random() * maxRadius
    const x = random() * TEXTURE_SIZE
    const y = random() * TEXTURE_SIZE
    const color = colors[Math.floor(random() * colors.length)]
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius)

    gradient.addColorStop(0, color)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    context.fillStyle = gradient
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2)
  }
}

function paintBronze(context, random) {
  paintBase(context, '#665139')
  paintBlotches(
    context,
    random,
    28,
    ['rgba(96, 139, 105, 0.6)', 'rgba(154, 115, 70, 0.3)'],
    58,
  )
  paintSpeckles(
    context,
    random,
    1800,
    ['rgba(45, 35, 26, 0.32)', 'rgba(116, 150, 120, 0.42)'],
    2.8,
  )
  paintBlotches(context, random, 18, ['rgba(46, 36, 27, 0.26)'], 30)
}

function paintBronzeRoughness(context, random) {
  paintBase(context, '#8a8a8a')
  paintBlotches(context, random, 26, ['rgba(236, 236, 236, 0.72)'], 46)
  paintSpeckles(context, random, 900, ['rgba(40, 40, 40, 0.5)'], 2)
}

function paintStone(context, random) {
  paintBase(context, '#4b4b47')
  paintBlotches(context, random, 20, ['rgba(28, 28, 27, 0.34)'], 40)
  paintSpeckles(
    context,
    random,
    2600,
    [
      'rgba(160, 157, 147, 0.35)',
      'rgba(19, 19, 18, 0.42)',
      'rgba(110, 107, 99, 0.32)',
    ],
    1.8,
  )
}

function paintStoneBump(context, random) {
  paintBase(context, '#808080')
  paintSpeckles(
    context,
    random,
    2200,
    ['rgba(245, 245, 245, 0.4)', 'rgba(28, 28, 28, 0.45)'],
    2.4,
  )
}

function paintPlaster(context, random) {
  paintBase(context, '#d8cdb8')

  for (let index = 0; index < 14; index += 1) {
    const y = random() * TEXTURE_SIZE
    context.strokeStyle = `rgba(139, 120, 91, ${0.04 + random() * 0.05})`
    context.lineWidth = 1 + random() * 3
    context.beginPath()
    context.moveTo(0, y)
    context.bezierCurveTo(
      TEXTURE_SIZE * 0.3,
      y + random() * 12 - 6,
      TEXTURE_SIZE * 0.7,
      y + random() * 12 - 6,
      TEXTURE_SIZE,
      y + random() * 8 - 4,
    )
    context.stroke()
  }

  paintSpeckles(
    context,
    random,
    900,
    ['rgba(255, 252, 243, 0.3)', 'rgba(126, 108, 82, 0.16)'],
    1.6,
  )
}

function paintPlasterBump(context, random) {
  paintBase(context, '#8c8c8c')
  paintSpeckles(
    context,
    random,
    1100,
    ['rgba(220, 220, 220, 0.35)', 'rgba(90, 90, 90, 0.22)'],
    1.4,
  )
}

function makeTexture(paint, seed, { color = false } = {}) {
  if (typeof document === 'undefined') return null

  const canvas = document.createElement('canvas')
  canvas.width = TEXTURE_SIZE
  canvas.height = TEXTURE_SIZE

  const context = canvas.getContext('2d')
  if (!context) return null

  paint(context, createRandom(seed))

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1.6, 1.6)

  if (color) {
    texture.colorSpace = THREE.SRGBColorSpace
  }

  return texture
}

const BUILDERS = {
  bronze: () => ({
    map: makeTexture(paintBronze, 11, { color: true }),
    roughnessMap: makeTexture(paintBronzeRoughness, 29),
  }),
  stone: () => ({
    map: makeTexture(paintStone, 37, { color: true }),
    bumpMap: makeTexture(paintStoneBump, 41),
  }),
  plaster: () => ({
    map: makeTexture(paintPlaster, 53, { color: true }),
    bumpMap: makeTexture(paintPlasterBump, 59),
  }),
}

/**
 * Las texturas se generan una vez y se comparten entre obras. Son mapas
 * procedurales pequeños (256 px), no imágenes externas.
 */
export function getMaterialTextures(profileId) {
  const build = BUILDERS[profileId]
  if (!build) return {}
  if (TEXTURE_CACHE.has(profileId)) return TEXTURE_CACHE.get(profileId)

  const textures = build()
  TEXTURE_CACHE.set(profileId, textures)
  return textures
}
