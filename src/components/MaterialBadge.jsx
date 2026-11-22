import { getMaterialLabel, getMaterialProfile } from '../three/materials.js'

/**
 * Chip ligero para el hover de las tarjetas. Muestra un pequeño orbe CSS con
 * los colores del material y evita montar un canvas 3D por tarjeta.
 */
export default function MaterialBadge({ material }) {
  const profile = getMaterialProfile(material)
  const label = getMaterialLabel(material)

  return (
    <span
      className={`material-chip material-chip--${profile.id}`}
      style={{
        '--swatch-a': profile.swatch[0],
        '--swatch-b': profile.swatch[1],
      }}
      title={`${material || profile.description} · 3D material study available in the gallery`}
    >
      <span className="material-chip__orb" aria-hidden="true" />
      <span className="material-chip__label">{label}</span>
    </span>
  )
}
