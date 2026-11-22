# Anexo 4 — Visor 3D de la galería

## Qué añade este anexo

La galería de `/gallery` gana un interruptor **3D view** junto a **Loop** y **Animate image**.
Al activarlo, la fotografía de la obra se sustituye por un estudio tridimensional navegable con
React Three Fiber. La fotografía sigue siendo la vista principal: el canvas solo se monta cuando
se pide.

El catálogo de las tarjetas también recibe un tratamiento táctil: una luz radial sigue al cursor
sobre la imagen y un chip muestra el material de la obra. No se crea un canvas por tarjeta.

## Archivos

| Archivo | Papel |
|---|---|
| `src/three/GalleryViewer.jsx` | Canvas, cámara, luces de galería, plinto y OrbitControls |
| `src/three/ParametricSculpture.jsx` | Formas abstractas estables según el material |
| `src/three/SculptureMaterial.jsx` | `MeshPhysicalMaterial` procedural por familia |
| `src/three/materials.js` | Clasificación del campo `material` y etiquetas del chip |
| `src/three/textures.js` | Texturas de canvas 256 px cacheadas |
| `src/three/dimensions.js` | Lectura de `dimensions` y escala de la escena |
| `src/components/MaterialBadge.jsx` | Chip ligero de material en el catálogo |

## Decisiones

### Una sola escena, bajo demanda

Montar 13 canvas WebGL en el listado habría multiplicado los contextos gráficos y el coste de
render. La solución separa dos niveles:

- **Galería:** un único canvas, cargado con `lazy(() => import('../three/GalleryViewer.jsx'))`
  cuando se activa **3D view**. Three.js queda en un chunk aparte.
- **Catálogo:** el hover usa variables CSS (`--pointer-x`, `--pointer-y`) y un gradiente radial.
  No hay estado de React por cada movimiento del ratón ni geometría 3D.

### Material antes que modelo

No hay archivos `.glb` en el catálogo, así que la pieza se genera de forma paramétrica. La semilla
es `id + name`: la misma obra conserva su forma entre visitas. La familia del material decide la
forma y el acabado:

| Material | Forma | Acabado |
|---|---|---|
| Bronce | Nudo toroidal sobre una base | Pátina verde, rugosidad variable |
| Acero / aluminio | Flor de pétalos | Espejo, `metalness: 1`, `roughness: 0.08` |
| Basalto / piedra | Monolito facetado | Mate y poroso, `roughness: 0.94` |
| Resto | Volúmenes apilados | Travertino / yeso crema |

### Escala y museo

`getSculptureProportions()` extrae los números de medidas como
`2,300 × 3,200 × 3,200 cm`, normaliza la altura y conserva la proporción de ancho y profundidad.
El plinto adapta su huella a la pieza.

La iluminación usa `Environment` con `Lightformer` (claraboya, paredes y suelo de estudio),
`ContactShadows` y una luz direccional con sombra. El fondo del canvas es transparente para
integrarse con el `#f4f3ef` de la web. `OrbitControls` desactiva el paneo, limita distancias y
ángulos y aplica amortiguación.

## Comprobación

- `npm run lint` y `npm run build` pasan.
- El chunk del visor se genera aparte (`GalleryViewer-*.js`), con Three.js dentro.
- Prueba renderizada en Chrome headless con SwiftShader:
  - Bronce, metal, piedra y yeso se montan y cambian al navegar por la galería.
  - El canvas mide 709 × 531 en el panel de escritorio.
  - El listado no monta ningún canvas.
  - El hover actualiza las variables CSS y el chip de material.
- Única advertencia de consola: `THREE.Clock` está obsoleto en Three.js 0.187; procede de una
  dependencia de drei, no del código de la aplicación.
