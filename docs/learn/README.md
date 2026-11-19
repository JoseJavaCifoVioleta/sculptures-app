# Material de estudio

Esta carpeta reúne apuntes y material complementario de la práctica. No es documentación de la
aplicación: para el diario de desarrollo está [`../bitacora/`](../bitacora/).

## Material incluido

- [`React_estudio16112026.pdf`](React_estudio16112026.pdf) — apuntes de React.
- [`image_4752326.jpg`](image_4752326.jpg), [`image_631f0261.jpg`](image_631f0261.jpg),
  [`image_b7a96c78.jpg`](image_b7a96c78.jpg), [`image_f28cd9f4.jpg`](image_f28cd9f4.jpg) y
  [`image_f9e3af9e.jpg`](image_f9e3af9e.jpg) — capturas de estudio.

## Conceptos de los bonus

### 1. Confirmar con `<dialog>`

Un `<dialog>` abierto con `showModal()` entra en la *top layer*, oscurece el fondo con
`::backdrop`, cierra con Escape y deja inerte el resto de la página. Es mucho menos código que un
modal casero y menos accesibilidad que romper.

Lo importante:

- `showModal()` lanza una excepción si el diálogo ya está abierto; hay que comprobar `dialog.open`.
- El evento `close` sirve para limpiar el estado pendiente.
- El foco debe empezar en la acción segura, no en la destructiva.
- Un `onKeyDown` con `Tab` y `Shift+Tab` cierra el ciclo si se quiere un foco estrictamente
  atrapado.
- `html:has(dialog[open]) { overflow: hidden }` evita que la página de detrás haga scroll.

Bitácora: [Bonus 1 — Confirmar el borrado](../bitacora/bonus-01-confirmacion-borrado.md)

Fuentes: [HTMLDialogElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement),
[`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal),
[patrón Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

### 2. Validación de formularios

Validar no es solo “que no esté vacío”. Hay que decidir cuándo validar, cómo mostrar el error y
cómo anunciarlo.

Lo importante:

- `noValidate` desactiva los globos del navegador para poder mostrar mensajes propios.
- `aria-invalid="true"` marca el campo y `aria-describedby` lo une a su mensaje.
- El foco debe ir al primer campo inválido.
- `trim()` evita que un nombre de solo espacios cuente como válido.
- `new URL()` permite comprobar el formato y el protocolo de una URL.
- Los errores se limpian al escribir, no hace falta esperar a otro envío.
- Un resumen con `role="alert"` ayuda a los lectores de pantalla.

Bitácora: [Bonus 2 — Validación del formulario](../bitacora/bonus-02-validacion-formulario.md)

Fuentes: [formularios en React](https://react.dev/reference/react-dom/components/input),
[`aria-invalid`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-invalid),
[`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby).

### 3. El filtro vive en la URL

Con `useSearchParams`, el texto del filtro no se guarda en un `useState`: se lee de la URL. Eso
hace que el enlace sea compartible y que Atrás/Adelante funcionen sin sincronizaciones manuales.

Lo importante:

- `searchParams.get('artist')` devuelve `null` o una cadena, nunca un array.
- Para modificar un parámetro se copia el objeto: `new URLSearchParams(searchParams)`.
- `setSearchParams(next, { replace: true })` evita llenar el historial con cada tecla.
- Filtrar con `toLocaleLowerCase()` y `normalize('NFD')` permite ignorar mayúsculas y acentos.
- Un `role="status"` anuncia cuántos resultados quedan.
- Hay que decidir qué pasa con el filtro al borrar, restaurar o volver del formulario.

Bitácora: [Bonus 3 — Filtro por artista](../bitacora/bonus-03-filtro-artista.md)

Fuentes: [`useSearchParams`](https://reactrouter.com/api/hooks/useSearchParams),
[`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams),
[`String.normalize`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize).

El Anexo 2 generaliza este filtro a varios campos (`?field=...&q=...`), manteniendo `?artist=...`
como enlace heredado. Lo explico en la sección 6.

### 4. Hook propio y `localStorage`

Un hook personalizado es una función que empieza por `use` y llama a otros hooks. Sirve para
sacar lógica de un componente sin perder reactividad.

Lo importante:

- `useState(loadSculptures)` ejecuta la lectura solo en el primer render.
- `useState(loadSculptures())` la ejecutaría en cada render: no es lo mismo.
- `useEffect` con `[sculptures]` persiste cualquier cambio: alta, edición, borrado o restauración.
- `JSON.parse` puede lanzar; `localStorage` puede fallar; ambas cosas van en `try/catch`.
- Validar la forma de los datos guardados evita romper la interfaz con un storage manipulado.
- Una clave versionada (`sculptures-app:v1`) deja sitio para migraciones futuras.
- En desarrollo, `StrictMode` puede ejecutar los efectos dos veces. Escribir dos veces el mismo
  valor no rompe nada, pero conviene saberlo.

Bitácora: [Bonus 4 — `useSculptures` y `localStorage`](../bitacora/bonus-04-hook-localstorage.md)

Fuentes: [hooks personalizados](https://react.dev/learn/reusing-logic-with-custom-hooks),
[`useState`](https://react.dev/reference/react/useState),
[`useEffect`](https://react.dev/reference/react/useEffect),
[`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

### 5. Paginación sin duplicar estado

La vista paginada no guarda una copia de las esculturas ni un `useState` con la página. Todo se
deriva de dos cosas: el array filtrado y los parámetros de la URL.

Lo importante:

- `view=pages` activa la vista; sin ese parámetro se muestra el catálogo completo.
- `page` se lee como número y se limita a `totalPages` con `Math.min`. La URL no puede dejar la
  pantalla en una página inexistente.
- `slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)` obtiene solo las tarjetas de esa página.
- El filtro se aplica **antes** de paginar, y al cambiar el filtro se borra `page` para volver a
  la primera página.
- Cambiar de página usa `setSearchParams(next)`, sin `replace`, para que Atrás regrese a la
  página anterior. Escribir en el filtro sí usa `replace` para no llenar el historial.
- `aria-current="page"` marca el número activo y los botones Previous/Next se deshabilitan en los
  extremos.
- El paginador se oculta cuando solo hay una página: no aporta nada.
- Si un borrado deja la página actual fuera de rango, un `useEffect` corrige la URL. El efecto
  comprueba primero si hay algo que corregir para no entrar en un bucle.

Bitácora: [Anexo 1 — Vista paginada](../bitacora/anexo-01-vista-paginada.md)

Fuentes: [`useSearchParams`](https://reactrouter.com/api/hooks/useSearchParams),
[`Array.prototype.slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice),
[`aria-current`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current).

### 6. Un filtro, varios campos

El campo sobre el que se busca también vive en la URL: `field` dice cuál es y `q` guarda la
consulta. La interfaz solo dibuja un grupo de botones a partir de una lista de configuración.

Lo importante:

- `?field=name&q=moai` es explícito y compartible. Sin `field`, se asume `artist`.
- Antes de usar el campo se comprueba que esté en la lista blanca; un valor inventado cae en el
  campo por defecto en vez de romper.
- Cada campo define un `getValue(sculpture)`. Añadir uno nuevo es añadir un objeto, no duplicar
  condiciones por toda la página.
- Los botones usan `aria-pressed` dentro de un `role="group"` con `aria-labelledby="Filter by"`.
- Al cambiar de campo se borra la consulta: evita buscar “Hepworth” dentro de `year`.
- “Clear filter” vacía la consulta pero conserva el campo seleccionado.
- Los enlaces antiguos `?artist=...` se siguen leyendo; al escribir se normalizan a `?q=...`.
- Year se compara como texto, así que `202` encuentra 2023, 2024 y 2025.
- El resumen nombra el campo (“where year matches…”) para que el resultado no sea ambiguo.

Bitácora: [Anexo 2 — Filtro por campo](../bitacora/anexo-02-filtro-por-campo.md)

Fuentes: [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams),
[`aria-pressed`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-pressed),
[renderizar listas](https://react.dev/learn/rendering-lists).

## Preguntas para repasar

1. ¿Por qué el filtro no se guarda en un `useState` si al final el input parece un campo
   controlado normal?
2. ¿Qué diferencia hay entre `useState(loadSculptures)` y `useState(loadSculptures())`?
3. ¿Por qué el borrado sigue siendo inmutable aunque ahora haya un modal por medio?
4. ¿Qué pasa si `localStorage` contiene `[{"foo":"bar"}]` y por qué?
5. ¿Por qué el foco inicial del modal está en Cancel y no en el botón rojo?
6. ¿Qué anuncia un lector de pantalla al enviar el formulario vacío?
7. ¿Por qué `replace: true` es importante al escribir en el filtro?
8. ¿Qué habría que cambiar para que el filtro se conservara al volver del formulario?
9. ¿Por qué la página actual se deriva de la URL en lugar de guardarse en un `useState`?
10. ¿Qué ocurre si alguien abre `/?view=pages&page=99` y por qué?
11. ¿Por qué cambiar de página no usa `replace: true` y el filtro sí?
12. ¿Por qué se usa un solo par `field` + `q` en lugar de un parámetro por campo?
13. ¿Qué ventaja tiene que cada campo defina su propio `getValue`?
14. ¿Por qué se limpia la consulta al cambiar de campo y no al pulsar “Clear filter”?

## Mapa rápido del código

| Archivo | Qué mirar |
| --- | --- |
| `src/components/ConfirmDialog.jsx` | `<dialog>`, foco, Escape, ciclo de Tab |
| `src/components/Pagination.jsx` | Previous/Next, números, `aria-current`, una sola página |
| `src/pages/SculptureListPage.jsx` | acciones pendientes, filtro por campo y paginación con `useSearchParams`, estados vacíos |
| `src/pages/SculptureFormPage.jsx` | validación, errores en línea, foco en el primer error |
| `src/hooks/useSculptures.js` | estado, CRUD y persistencia |
| `src/App.jsx` | router y composición del hook |
| `src/index.css` | variables de tema, incluidos los colores de peligro |
