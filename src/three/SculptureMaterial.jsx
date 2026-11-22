import { useMemo } from 'react'
import { getMaterialProfile } from './materials.js'
import { getMaterialTextures } from './textures.js'

/**
 * Traduce el material de la obra a un MeshPhysicalMaterial procedural.
 * Las texturas se generan una sola vez y se comparten.
 */
export default function SculptureMaterial({ materialType }) {
  const profile = useMemo(() => getMaterialProfile(materialType), [materialType])
  const textures = useMemo(
    () => getMaterialTextures(profile.id),
    [profile.id],
  )

  const bumpScale =
    profile.id === 'stone' ? 0.045 : profile.id === 'plaster' ? 0.012 : 0

  return (
    <meshPhysicalMaterial
      key={profile.id}
      {...profile.material}
      {...textures}
      bumpScale={bumpScale}
    />
  )
}
