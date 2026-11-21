# Bonus 4 — `useSculptures` y persistencia en `localStorage`

> **Nota histórica:** esta entrada documenta la versión del bonus con `localStorage`. La
> aplicación actual guarda el catálogo en Neon y el contexto/hook vive en
> `src/SculpturesContext.jsx`.

## Qué pedía el bonus

Dos cosas relacionadas:

- Extraer la lógica de las esculturas a un hook propio, `useSculptures`, para dejar `App.jsx`
  limpio.
- Persistir los cambios en `localStorage` para que las altas, ediciones y borrados sobrevivan a
  una recarga.

## Punto de partida

`App.jsx` tenía el `useState` y los cuatro handlers CRUD. Todo funcionaba, pero la mezcla de
router, estado y persistencia empezaba a pesar en el mismo archivo.

## Implementación

Creé `src/hooks/useSculptures.js` y moví allí el estado y los handlers. La lectura inicial es
perezosa:

```jsx
export const STORAGE_KEY = 'sculptures-app:v1'

const [sculptures, setSculptures] = useState(loadSculptures)
```

`loadSculptures` comprueba que exista `window`, lee la clave, parsea el JSON y valida la forma de
los datos. Si algo falla, devuelve una copia del catálogo original:

```jsx
function loadSculptures() {
  if (typeof window === 'undefined') return [...sculptureList]

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return [...sculptureList]

    const parsed = JSON.parse(stored)

    if (!Array.isArray(parsed) || !parsed.every(isSculpture)) {
      return [...sculptureList]
    }

    return parsed
  } catch {
    return [...sculptureList]
  }
}
```

La escritura es un efecto sobre el array:

```jsx
useEffect(() => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sculptures))
  } catch {
    // Si el almacenamiento está lleno o bloqueado, la app sigue en memoria.
  }
}, [sculptures])
```

`App.jsx` queda así:

```jsx
const {
  sculptures,
  addSculpture,
  updateSculpture,
  deleteSculpture,
  resetSculptures,
} = useSculptures()
```

El resto de la aplicación no cambia: el `Outlet` sigue recibiendo las mismas props.

## Decisiones

- **Leer en el inicializador de `useState`, no en un `useEffect`.** Si leyera después del primer
  render, la aplicación pintaría las doce esculturas originales y, un instante después, las
  guardadas. Ese parpadeo se evita con `useState(loadSculptures)`.
- **`loadSculptures` como función, no como valor.** `useState(loadSculptures)` pasa la función y
  React la ejecuta solo en el primer render. `useState(loadSculptures())` la ejecutaría en cada
  render.
- **Validar la forma de lo guardado.** `JSON.parse` puede devolver cualquier cosa. Antes de
  confiar en el array compruebo que sea un array y que cada elemento tenga `id`, `name`, `artist`
  y `url`. Si no, vuelvo al catálogo original en lugar de romper la aplicación.
- **Clave versionada.** `sculptures-app:v1` deja espacio para cambiar el formato en el futuro sin
  mezclar datos antiguos. Si algún día cambia la forma de una escultura, se puede subir a `v2`.
- **Escribir también el catálogo inicial.** La primera visita guarda las doce esculturas. A
  partir de ahí, el archivo `data.js` sigue siendo la fuente de verdad para “Restore original
  data”, pero el estado normal vive en `localStorage`.
- **Restaurar escribe las originales.** `resetSculptures` hace `setSculptures([...sculptureList])`
  y el efecto se encarga de persistirlas. No hace falta tocar `localStorage` a mano.
- **Errores silenciosos.** Si el navegador bloquea el almacenamiento (modo privado, cuota llena),
  la aplicación sigue funcionando en memoria. Prefiero eso a un error que impida usar el CRUD.
- **El hook devuelve un objeto.** Es el mismo contrato que ya consumía `App.jsx`; así el refactor
  no obliga a cambiar páginas ni el contexto.

## Fallos que encontré

### La primera versión habría parpadeado

Mi primer esbozo era:

```jsx
const [sculptures, setSculptures] = useState(sculptureList)

useEffect(() => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) setSculptures(JSON.parse(stored))
}, [])
```

Funciona, pero en cada recarga se ven primero las esculturas originales y luego las guardadas.
Además, si el JSON está corrupto, el `JSON.parse` lanza una excepción dentro del efecto y la
aplicación se queda en blanco. Leer en el inicializador y envolver todo en `try/catch` resuelve
las dos cosas.

### `localStorage` no existe en todos los entornos

Aunque esta aplicación se ejecuta en el navegador, comprobar `typeof window === 'undefined'`
deja el hook preparado para un futuro renderizado en servidor y evita un `ReferenceError` si se
prueba en Node.

### El borrado se deshacía al recargar

Si se persiste solo al crear, las ediciones y los borrados se pierden al refrescar. El efecto
observa el array completo, así que cualquier cambio —alta, edición, borrado o restauración— se
guarda sin código extra.

## Verificación

`npm run lint` y `npm run build` pasan.

Probé el ciclo completo con recargas reales, almacenamiento corrupto y datos con forma inválida:

```text
inicio: localStorage sembrado con 12: true
persistencia: hay 13 en localStorage: true
persistencia: tras recargar siguen 13 y el nombre editado: true
persistencia: el borrado sobrevive a recargar: true
persistencia: borrado original persiste: true
persistencia: restaurar persiste tras recargar: true
storage corrupto: vuelve a las 12 y se reescribe válido: true
storage con forma inválida: vuelve a las 12: true
storage válido personalizado: carga su contenido: true
restaurar desde datos personalizados: 12 y persisten: true
vacío: mensaje de catálogo vacío: true
vacío: restaurar recupera las 12: true
estado final: 12 tarjetas, sin filtro y 12 guardadas: true
```

También comprobé que el catálogo vacío (`[]`) es un estado válido: la lista muestra su mensaje
en lugar de quedarse en blanco, y “Restore original data” recupera las doce esculturas.

## Fuentes

- Hooks personalizados: https://react.dev/learn/reusing-logic-with-custom-hooks
- `useState` con inicializador: https://react.dev/reference/react/useState
- `useEffect`: https://react.dev/reference/react/useEffect
- `localStorage`: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- `JSON.parse`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
- `StrictMode` y efectos dobles en desarrollo: https://react.dev/reference/react/StrictMode
