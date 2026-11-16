# Parte 2 — Preparar los datos

## Qué pedía el enunciado

Copiar el array `sculptureList` en `src/data.js` y corregir dos “trampas”:

1. **No hay `id`**: un CRUD necesita una clave estable para identificar cada escultura.
2. **`location` es opcional**: solo algunas esculturas la tienen, así que no se debe
   inventar ni asumir que existe.

## Análisis previo

Antes de tocar nada comprobé el estado real del proyecto:

- `src/data.js` ya contenía las 12 esculturas, pero **ningún objeto tenía `id`**.
- Solo la primera escultura (`Homenaje a la Neurocirugía`) tiene `location`.
- `data.js` **no se importaba desde ningún sitio todavía**, así que el cambio no podía
  romper la aplicación.
- El resto de campos (`name`, `artist`, `description`, `year`, `url`, `alt`) estaban
  completos en las 12 entradas.

## Decisión: `id` numérico manual (1–12) para los datos semilla

El enunciado permitía dos caminos: añadir el `id` a mano o generarlo al cargar con
`crypto.randomUUID()`. Elegí **añadir manualmente ids numéricos del 1 al 12**, por estos
motivos:

- **Estabilidad**: los ids forman parte de la URL (`/sculptures/:id`). Si se generan con
  `crypto.randomUUID()` al cargar el módulo, cambian en cada recarga y cualquier enlace
  directo a una escultura dejaría de funcionar (acabaría en la página 404).
- **Depuración más sencilla**: con ids `1`–`12` es inmediato comprobar a qué escultura
  apunta una ruta mientras se desarrolla.
- **Trabajo con `localStorage`**: si más adelante se añade el bonus de persistencia, los
  ids guardados siguen siendo válidos tras refrescar.
- **Simplicidad**: no requiere ninguna función extra; el dataset queda legible y explícito.

Que los datos semilla tengan ids numéricos **no impide** que las esculturas creadas desde el
formulario usen `crypto.randomUUID()` en la parte 6: ahí sí necesito generar un id único que
no colisione con los existentes. Si se acaba mezclando ambos tipos, la comparación en las
rutas se hará como texto (`String(s.id) === id`), porque `useParams()` siempre devuelve el
parámetro como string.

Descarté también la opción de añadir el `id` con un `.map()` al final del archivo porque el
resultado sería menos explícito para quien lea el dataset y, en el caso de
`randomUUID()`, arrastraría el problema de los ids cambiantes.

## Cambios realizados

- **`src/data.js`**: añadido `id: 1` … `id: 12` como primera propiedad de cada uno de los 12
  objetos. No se ha modificado ningún otro campo.
- **`location`**: se ha dejado tal cual. Solo la primera escultura la conserva; el
  renderizado condicional se resolverá en la página de detalle (parte 5).
- **Resto del proyecto**: sin cambios. `App.jsx`, los estilos y la configuración siguen
  intactos porque esta parte solo prepara los datos.

## Comprobación

- El array sigue teniendo 12 elementos y todos los `id` son únicos.
- `npm run lint` termina sin errores.
- La aplicación sigue arrancando sin cambios visibles: `data.js` todavía no se consume.

## Implicaciones para las siguientes partes

- Las rutas de detalle y edición podrán buscar por `id` (`/sculptures/3`,
  `/sculptures/3/edit`).
- `deleteSculpture(id)` y `updateSculpture(id, ...)` podrán actualizar el estado con
  `filter`/`map` sin mutar el array original.
- En los listados se podrá usar `key={s.id}`.
- Al comparar el `id` de la URL con el del objeto habrá que convertir el parámetro a número
  (`Number(id)`), porque `useParams()` devuelve strings.
