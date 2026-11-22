import { useMemo } from 'react'
import { getMaterialProfile } from './materials.js'
import SculptureMaterial from './SculptureMaterial.jsx'
import { getSculptureProportions, hashString } from './dimensions.js'

function BronzeForm({ material, proportions, seed }) {
  const height = proportions.height
  const width = proportions.width
  const depth = proportions.depth
  const turn = useMemo(() => (seed % 2 === 0 ? 2 : 3), [seed])
  const rotation = useMemo(() => ((seed % 90) * Math.PI) / 720, [seed])

  return (
    <group rotation={[0, rotation, 0]}>
      <mesh
        position={[0, height * 0.14, 0]}
        scale={[width * 0.3, height * 0.1, depth * 0.3]}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[1, 48, 32]} />
        <SculptureMaterial materialType={material} />
      </mesh>

      <mesh
        position={[0, height * 0.54, 0]}
        scale={[width * 0.38, height * 0.35, depth * 0.38]}
        rotation={[0.08, 0, 0.03]}
        castShadow
        receiveShadow
      >
        <torusKnotGeometry args={[0.88, 0.22, 180, 36, turn, 3]} />
        <SculptureMaterial materialType={material} />
      </mesh>
    </group>
  )
}

function SteelFlowerForm({ material, proportions, seed }) {
  const height = proportions.height
  const width = proportions.width
  const depth = proportions.depth

  const petals = useMemo(() => {
    const count = 6 + (seed % 2)

    return Array.from({ length: count }, (_, index) => {
      const angle = (index / count) * Math.PI * 2
      return { angle, key: `petal-${index}` }
    })
  }, [seed])

  const stamens = useMemo(
    () =>
      Array.from({ length: 9 }, (_, index) => {
        const angle = (index / 9) * Math.PI * 2
        const radius = width * (0.06 + (index % 3) * 0.016)

        return {
          key: `stamen-${index}`,
          x: Math.cos(angle) * radius,
          z: Math.sin(angle) * radius,
          scale: 0.8 + (index % 3) * 0.14,
        }
      }),
    [width],
  )

  return (
    <group>
      {petals.map((petal) => (
        <group key={petal.key} rotation={[0, petal.angle, 0]}>
          <mesh
            position={[width * 0.2, height * 0.58, 0]}
            rotation={[0.06, 0, -0.62]}
            scale={[width * 0.3, height * 0.28, 0.052]}
            castShadow
            receiveShadow
          >
            <sphereGeometry args={[1, 40, 24]} />
            <SculptureMaterial materialType={material} />
          </mesh>
        </group>
      ))}

      <mesh
        position={[0, height * 0.5, 0]}
        scale={[width * 0.14, height * 0.15, depth * 0.14]}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[1, 48, 32]} />
        <SculptureMaterial materialType={material} />
      </mesh>

      {stamens.map((stamen) => (
        <mesh
          key={stamen.key}
          position={[stamen.x, height * 0.71, stamen.z]}
          scale={[0.012, height * 0.18 * stamen.scale, 0.012]}
          castShadow
        >
          <cylinderGeometry args={[1, 1, 1, 8]} />
          <SculptureMaterial materialType={material} />
        </mesh>
      ))}
    </group>
  )
}

function StoneForm({ material, proportions, seed }) {
  const height = proportions.height
  const width = proportions.width
  const depth = proportions.depth
  const rotation = useMemo(() => ((seed % 70) * Math.PI) / 700, [seed])

  return (
    <group>
      <mesh
        position={[0, height * 0.5, 0]}
        scale={[width * 0.55, height * 0.5, depth * 0.55]}
        rotation={[0.05, rotation, 0.03]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[1, 1]} />
        <SculptureMaterial materialType={material} />
      </mesh>

      <mesh
        position={[width * 0.44, height * 0.08, depth * 0.1]}
        scale={[width * 0.14, height * 0.08, depth * 0.14]}
        rotation={[0.2, rotation * 2, 0.1]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[1, 0]} />
        <SculptureMaterial materialType={material} />
      </mesh>
    </group>
  )
}

function PlasterForm({ material, proportions }) {
  const height = proportions.height
  const width = proportions.width
  const depth = proportions.depth

  return (
    <group>
      <mesh
        position={[0, height * 0.12, 0]}
        scale={[width * 0.42, height * 0.12, depth * 0.42]}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[1, 48, 32]} />
        <SculptureMaterial materialType={material} />
      </mesh>

      <mesh
        position={[0, height * 0.42, 0]}
        scale={[width * 0.23, height * 0.3, depth * 0.23]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.62, 1, 1, 36]} />
        <SculptureMaterial materialType={material} />
      </mesh>

      <mesh
        position={[0, height * 0.71, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <torusGeometry args={[width * 0.2, width * 0.062, 24, 64]} />
        <SculptureMaterial materialType={material} />
      </mesh>

      <mesh
        position={[0, height * 0.87, 0]}
        scale={[width * 0.16, height * 0.12, depth * 0.16]}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[1, 48, 32]} />
        <SculptureMaterial materialType={material} />
      </mesh>
    </group>
  )
}

/**
 * Estudio abstracto generado a partir de la familia del material y de la
 * proporción real de la obra. Cada pieza conserva su forma entre visitas.
 */
export default function ParametricSculpture({
  material,
  dimensions,
  seed = 'sculpture',
}) {
  const profile = useMemo(() => getMaterialProfile(material), [material])
  const proportions = useMemo(
    () => getSculptureProportions(dimensions),
    [dimensions],
  )
  const hash = useMemo(() => hashString(seed), [seed])

  if (profile.id === 'bronze') {
    return (
      <BronzeForm
        material={material}
        proportions={proportions}
        seed={hash}
      />
    )
  }

  if (profile.id === 'steel') {
    return (
      <SteelFlowerForm
        material={material}
        proportions={proportions}
        seed={hash}
      />
    )
  }

  if (profile.id === 'stone') {
    return (
      <StoneForm
        material={material}
        proportions={proportions}
        seed={hash}
      />
    )
  }

  return <PlasterForm material={material} proportions={proportions} />
}
