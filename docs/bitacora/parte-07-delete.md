# Parte 7 — Delete

## Qué pedía esta parte

Añadir un botón de borrar en cada fila del listado que llame a `deleteSculpture(id)` del
contexto del `Outlet`.

El enunciado insiste en dos cosas:

- El borrado debe ser **inmutable**: `filter` sobre el array, nunca `splice` ni modificar el
  estado original.
- Como bonus, se puede añadir también el borrado desde el detalle y una confirmación con
  `window.confirm()`.

Esa confirmación acabó siendo un modal propio con `<dialog>`, documentado aparte en el
[Bonus 1](bonus-01-confirmacion-borrado.md).

## Punto de partida

`deleteSculpture` existía desde la parte 4, pero no lo usaba ninguna página. La lista ya tenía
los enlaces **View** y **Edit**, así que el botón de borrar era la última pieza del CRUD.

## Implementación

En `SculptureListPage` añadí `deleteSculpture` al `useOutletContext()` y un botón dentro de
`.sculpture-actions`:

```jsx
const { sculptures, deleteSculpture } = useOutletContext()

// ...

<button
  className="button-ghost button-danger"
  type="button"
  onClick={() => deleteSculpture(sculpture.id)}
  aria-label={`Delete ${sculpture.name}`}
>
  Delete
</button>
```

Decisiones:

- **`type="button"`**: aunque ahora mismo el botón no está dentro de un formulario, dejarlo
  explícito evita que en el futuro se comporte como un botón de envío si alguien reutiliza el
  componente. Un `<button>` sin `type` dentro de un `<form>` envía el formulario.
- **Es un botón, no un enlace**: borrar no es navegar. Un `<Link to="/">` cambiaría de página
  sin ejecutar el borrado, y un `<a>` con `href="#"` ensuciaría la URL. El botón ejecuta la
  función y React vuelve a dibujar la lista.
- **`aria-label` con el nombre**: hay doce botones con el texto “Delete”. Para alguien que use
  un lector de pantalla, “Delete Homenaje a la Neurocirugía” es mucho más útil que doce
  “Delete” iguales. MDN lo explica en la referencia de `aria-label`:
  https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label
- **Clase `button-danger`**: la dejo puesta como gancho para el pase visual. En este commit no
  hay reglas nuevas, así que el botón se ve como los demás `.button-ghost`.

## El handler ya era inmutable

No hizo falta tocar `App.jsx`, porque `deleteSculpture` ya estaba preparado desde la parte 4:

```jsx
function deleteSculpture(id) {
  setSculptures((current) =>
    current.filter((sculpture) => String(sculpture.id) !== String(id)),
  )
}
```

`filter` devuelve un array nuevo y no toca el anterior. Además compara los ids con `String()`
para que convivan los ids numéricos de las esculturas iniciales y los `crypto.randomUUID()` de
las que se crean desde el formulario. La documentación de React insiste en no mutar el estado:

- https://react.dev/learn/updating-arrays-in-state

## Por qué la `key` estable importa al borrar

Al borrar una escultura, React tiene que quitar **esa** tarjeta y conservar las demás. La
`key={sculpture.id}` de la parte 5 es lo que le permite identificar cada tarjeta sin ambigüedad.

Si hubiera usado el índice (`key={index}`), al eliminar la primera escultura todas las
siguientes cambiarían de índice. React podría reutilizar el nodo de la tarjeta equivocada y
mezclar la información o las animaciones. Con el id, cada tarjeta sigue siendo la misma aunque
cambie de posición. Es la misma idea de *Rendering Lists*:

- https://react.dev/learn/rendering-lists

## Fallo que evité: borrar mientras se navega

Mi primera idea fue poner el botón dentro de la tarjeta y envolver la tarjeta entera en un
`<Link>` para que fuera clicable. Eso habría sido un problema: al pulsar Delete también se
dispararía la navegación al detalle, y el usuario vería una pantalla de “not found” justo
después de borrar.

Lo dejé como estaba en la parte 5: la tarjeta no es un enlace, y las acciones (View, Edit,
Delete) son elementos independientes dentro de `.sculpture-actions`.

## Extra: restaurar el catálogo original

Al probar el borrado eché de menos poder deshacerlo sin recargar la página. Como el estado se
inicializa desde `sculptureList`, la solución es volver a copiar ese array:

```jsx
function resetSculptures() {
  setSculptures([...sculptureList])
}
```

Ese handler vive en `App.jsx`, junto a los demás, y viaja por el contexto del `Outlet` como
`resetSculptures`. En la lista añadí un botón secundario al lado de “Add a sculpture”:

```jsx
<button className="button-ghost" type="button" onClick={resetSculptures}>
  Restore original data
</button>
```

Decisiones:

- **Copia con `[...sculptureList]`**: no paso el array importado tal cual para no compartir la
  misma referencia con el módulo. El estado siempre trabaja con su propio array.
- **Restaura todo, no solo los borrados**: vuelven las doce esculturas originales, se deshacen
  las ediciones y desaparecen las esculturas creadas. Es lo que se espera de un botón que dice
  “Restore original data”.
- **`data.js` sigue siendo la fuente de verdad**: si en el futuro se añade una escultura al
  archivo, el botón también la recuperará.
- **Confirmación compartida**: tanto borrar como restaurar pasan por el mismo modal
  reutilizable, documentado en el [Bonus 1](bonus-01-confirmacion-borrado.md).
- **Sin estilos nuevos**: el botón reutiliza `.button-ghost`. El pase visual de la parte 7
  puede darle un tratamiento secundario si hace falta.

Comprobé que funciona después de borrar, de editar y de crear:

```
tras borrar dos: quedan 10: true
restaurar tras borrar: vuelven las 12 y los nombres originales: true
restaurar tras editar: vuelve el nombre original: true
restaurar tras crear: vuelve a 12 y desaparece la nueva: true
```

Así se ve el botón en escritorio y en ancho estrecho:

![Botón Restore original data en escritorio y móvil](../Add_button_restore_original_data.jpg)

## Pase de estilos (commit aparte)

Con la funcionalidad cerrada y commiteada, apliqué el color de peligro que llevaba pendiente
desde la parte 4. No toqué la lógica: solo `index.css` y `App.css`.

### Qué cambié

- **Variables nuevas en `index.css`**:
  - `--danger: #b91c1c` en modo claro y `#f87171` en oscuro;
  - `--danger-bg` para el fondo del hover;
  - `--danger-border` para el borde en reposo.

  Así el color no queda repartido en reglas sueltas y el modo oscuro se adapta solo.
- **`.button-danger`**: hereda la forma de `.button-ghost`, pero con borde y texto en rojo. No
  lo hice un botón rojo lleno para que no compita con “Add a sculpture” y siga siendo una
  acción secundaria.
- **Hover**: al pasar el ratón, el borde se vuelve rojo sólido y aparece un fondo rojo muy
  suave. Mantiene la elevación de `.button-ghost:hover`.
- **Foco**: el `outline` pasa a usar `--danger`, para que el foco del teclado también sea rojo
  en este botón.
- **Restore original data**: lo dejé como `.button-ghost` normal. Es una acción de recuperación,
  no de peligro, y no quería dos botones rojos en la misma zona.

El modo oscuro sigue siendo automático: no hay interruptor en la interfaz. Se activa con la
preferencia del sistema (`prefers-color-scheme`). Para comprobarlo forcé el modo oscuro en
Chrome headless; si quieres verlo en tu navegador, se puede emular desde DevTools → Rendering →
*Emulate CSS media feature prefers-color-scheme*.

### Verificación

- `npm run lint` y `npm run build` pasan.
- Capturas en modo claro y oscuro: el botón Delete se distingue sin romper la paleta.
- Comprobé los estilos calculados con Chrome:
  - en reposo: `rgb(185, 28, 28)` y borde `rgba(185, 28, 28, 0.38)`;
  - con hover: fondo `rgba(185, 28, 28, 0.09)` y borde `rgb(185, 28, 28)`.
- Después del cambio visual, el botón sigue borrando: al pulsarlo quedan 11 tarjetas.

## Lo que dejo para el bonus

- ~~**Confirmación antes de borrar** con `window.confirm()`~~: hecha con un `<dialog>` nativo
  en el [Bonus 1](bonus-01-confirmacion-borrado.md).
- ~~**Confirmación antes de restaurar**~~: hecha reutilizando ese mismo modal.
- **Borrar desde el detalle**, con `navigate("/")` después.
- **Estado vacío** cuando no queda ninguna escultura: la lista se queda sin tarjetas y el
  contador marca 0. No es un fallo, pero se podría mostrar una tarjeta de “no hay esculturas”.

## Verificación

`npm run lint` y `npm run build` pasan.

Probé el borrado con Chrome headless y el protocolo de DevTools, pulsando los botones como lo
haría una persona:

```
inicio: 12 tarjetas, 12 botones Delete y contador 12: true
borrar: sigue en la lista: true
borrar: quedan 11 tarjetas y contador 11: true
borrar: la escultura desaparece: true
borrar otra: quedan 10 y desaparece: true
las tarjetas restantes conservan View/Edit/Delete: true
```

Es decir: el borrado no navega, actualiza el contador, quita la tarjeta correcta y deja intactas
las acciones de las demás. El script de prueba era temporal y lo borré.

## Fuentes

- Actualizar arrays en estado: https://react.dev/learn/updating-arrays-in-state
- Listas y `key`: https://react.dev/learn/rendering-lists
- `aria-label`: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label
