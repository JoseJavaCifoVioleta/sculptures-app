import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  RoundedBox,
} from '@react-three/drei'
import { getMaterialProfile } from './materials.js'
import { getSculptureProportions } from './dimensions.js'
import ParametricSculpture from './ParametricSculpture.jsx'

function Plinth({ proportions }) {
  const { plinthHeight, plinthWidth, plinthDepth } = proportions

  return (
    <group>
      <RoundedBox
        args={[plinthWidth, plinthHeight, plinthDepth]}
        radius={0.018}
        smoothness={4}
        position={[0, plinthHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#e6e0d4" roughness={0.86} />
      </RoundedBox>

      <mesh
        position={[0, plinthHeight + 0.002, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[plinthWidth, plinthDepth]} />
        <meshStandardMaterial color="#efeae0" roughness={0.72} />
      </mesh>
    </group>
  )
}

function SculptureStage({ sculpture, material, dimensions }) {
  const proportions = useMemo(
    () => getSculptureProportions(dimensions),
    [dimensions],
  )

  return (
    <group>
      <Plinth proportions={proportions} />
      <group position={[0, proportions.plinthHeight, 0]}>
        <ParametricSculpture
          material={material}
          dimensions={dimensions}
          seed={`${sculpture.id}-${sculpture.name}`}
        />
      </group>
    </group>
  )
}

export default function GalleryViewer({ sculpture, material, dimensions }) {
  const profile = useMemo(() => getMaterialProfile(material), [material])
  const label = `Interactive 3D study of ${sculpture.name}`

  return (
    <div className="gallery-3d" role="group" aria-label={label}>
      <Canvas
        shadows="basic"
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.6, 5], fov: 32, near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        fallback={
          <p className="gallery-3d-fallback">
            This browser cannot display the 3D study. The photograph is still
            available in the catalogue.
          </p>
        }
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.45} />
          <directionalLight
            position={[3.6, 6, 4.2]}
            intensity={2.1}
            color="#fffaf0"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0004}
          />
          <spotLight
            position={[-4, 5, -3]}
            intensity={1.5}
            angle={0.7}
            penumbra={1}
            color="#f1e6d3"
          />

          <SculptureStage
            sculpture={sculpture}
            material={material}
            dimensions={dimensions}
          />

          <mesh
            position={[0, 0.001, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[14, 14]} />
            <shadowMaterial transparent opacity={0.1} color="#3b352c" />
          </mesh>

          <ContactShadows
            position={[0, 0.004, 0]}
            opacity={0.3}
            scale={5.5}
            blur={2.8}
            far={4}
          />

          <Environment resolution={256} frames={1}>
            <Lightformer
              form="rect"
              intensity={1.4}
              color="#f6f0e4"
              position={[0, 0, -6]}
              scale={[20, 14, 1]}
            />
            <Lightformer
              form="rect"
              intensity={0.72}
              color="#e8e2d6"
              position={[-6, 0, 0]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[14, 10, 1]}
            />
            <Lightformer
              form="rect"
              intensity={1.05}
              color="#ffffff"
              position={[6, 1, 0]}
              rotation={[0, -Math.PI / 2, 0]}
              scale={[14, 10, 1]}
            />
            <Lightformer
              form="rect"
              intensity={1.15}
              color="#fff7e9"
              position={[0, 6, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[14, 14, 1]}
            />
            <Lightformer
              form="rect"
              intensity={0.35}
              color="#cfc7b8"
              position={[0, -5, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={[14, 14, 1]}
            />
            <Lightformer
              form="rect"
              intensity={3.2}
              color="#fff7e9"
              position={[0, 5.2, -4.5]}
              scale={[7, 4, 1]}
            />
            <Lightformer
              form="circle"
              intensity={1.5}
              color="#ffffff"
              position={[0, 4, 4]}
              scale={[3.5, 3.5, 1]}
            />
          </Environment>

          <OrbitControls
            makeDefault
            enablePan={false}
            enableDamping
            dampingFactor={0.06}
            rotateSpeed={0.65}
            zoomSpeed={0.7}
            minDistance={2.8}
            maxDistance={6.8}
            minPolarAngle={Math.PI * 0.18}
            maxPolarAngle={Math.PI * 0.52}
            target={[0, 1.02, 0]}
          />
        </Suspense>
      </Canvas>

      <p className="gallery-3d-spec">
        <span>Interactive material study</span>
        <span>
          {profile.label} · {dimensions}
        </span>
      </p>

      <p className="gallery-3d-hint">Drag to orbit · Scroll to zoom</p>
    </div>
  )
}
