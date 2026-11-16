# Parte 3 — Pensar el diseño antes de codificar

## Qué pedía esta parte

Antes de escribir componentes, el enunciado plantea cuatro preguntas:

1. ¿Dónde debe vivir el estado `sculptures`?
2. ¿Cómo acceden las rutas hijas a ese estado?
3. ¿Puede un solo formulario servir para crear y editar?
4. ¿Qué debe pasar después de guardar o borrar?

Esta parte no cambia el código de la aplicación: sirve para decidir la estructura. Aun así,
hice un par de pruebas pequeñas con un componente temporal para no escribir aquí cosas que
no hubiera comprobado. Ese archivo lo borré después; no forma parte del proyecto.

## 1. Dónde viven las esculturas

Mi primera idea fue guardar la lista dentro de `SculptureListPage`, porque es la página donde
se ven las esculturas. Pero al pensar en la página de detalle me di cuenta de que esa página
también necesitaría los datos, y no los tendría si el estado se quedaba en la lista.

Busqué en la documentación de React y encontré el capítulo *Sharing State Between
Components*, que explica justo eso: cuando dos componentes necesitan el mismo estado, hay
que subirlo al padre común. Como `App` envuelve todas las rutas, decidí poner allí
`useState(sculptureList)`.

También pensé en `Layout`, que es el padre de las páginas que se muestran dentro. Podría
haber funcionado, pero el esqueleto del enunciado ya coloca el estado en `App` y me pareció
más claro no cambiarlo: `App` es quien declara las rutas y quien puede pasar los datos hacia
abajo.

**Resultado:** esta parte me salió a la primera. El estado va en `App` y los handlers
(`addSculpture`, `updateSculpture`, `deleteSculpture`) también, para que los cambios se hagan
en un solo sitio.

## 2. Cómo llegan los datos a las páginas

Mi primera idea fue pasar `sculptures` como prop a `Layout` y que `Layout` se lo pasara a la
página. Escribí algo así:

```jsx
<Outlet sculptures={sculptures} />
```

Hice una prueba con un componente temporal y en la página `props.sculptures` era
`undefined`. Ahí me di cuenta de que `Outlet` no reenvía props cualquiera.

Busqué “pasar datos a rutas hijas react router” y vi que `Outlet` tiene una prop `context`.
Lo cambié a:

```jsx
<Outlet context={{ sculptures, addSculpture, updateSculpture, deleteSculpture }} />
```

y en la página se lee con `useOutletContext()`. En la prueba, el contexto llegaba
correctamente.

También probé la otra opción que conocía: crear un `Context` con `createContext` y envolver
todo con un `Provider`. Funcionaba, pero me obligaba a importar el contexto en cada página y
a envolver la aplicación; para lo que pide el ejercicio me pareció más lío. Me quedo con
`Outlet context`, que es lo que sugiere el enunciado.

**Resultado:** parece que funciona, pero todavía no lo he usado en la aplicación real. Lo
comprobaré en la parte 4.

## 3. Un formulario para crear y editar

La idea de usar un solo formulario me parecía buena porque los campos son los mismos. El
problema era saber si estaba creando o editando.

Primero probé a mirar la URL:

```js
const isEdit = window.location.pathname.includes('/edit')
```

Funcionaba, pero me pareció poco limpio y muy atado al texto de la ruta. En el tutorial del
router vi que se usa `useParams()`. Lo puse y comprobé qué devolvía con una prueba:

- en `/sculptures/new` devolvía `{}`;
- en `/sculptures/5/edit` devolvía `{ id: '5' }`.

Es decir, al desestructurar `id`, en creación es `undefined` y en edición es un **string**.
Con eso puedo hacer `const isEdit = Boolean(id)`.

Aquí vino otro fallo: para buscar la escultura escribí `id === 5` y no entraba nunca en modo
edición. Había olvidado que `useParams()` devuelve texto. Lo corregí con `Number(id)`. Me
apunto que tendré que tener cuidado con los tipos en todas las comparaciones.

Para el estado inicial del formulario decido:

- en creación, campos vacíos (`year` vacío, `location` vacío, etc.);
- en edición, los datos de la escultura encontrada.

También tendré que convertir `year` a número antes de guardar, para que el dato no cambie de
tipo. Y el botón dirá “Create sculpture” o “Save changes” según el modo.

**Duda pendiente:** no sé si al pasar de `/new` a `/5/edit` el formulario se reinicia solo o
se queda con los datos anteriores. Lo comprobaré en la parte 6.

## 4. Qué pasa después de guardar o borrar

Lo primero que se me ocurrió fue poner un `<Link to="/">` como botón de guardar, pero un
enlace solo cambia de página: no envía el formulario. En el tutorial vi que después de
guardar se usa `navigate('/')`, así que lo apunté para la parte 6.

Para borrar:

- desde la lista no hace falta navegar: al cambiar el estado, la lista se vuelve a dibujar;
- desde el detalle (bonus), como la escultura deja de existir, hay que volver con
  `navigate('/')`.

**Duda pendiente:** no sé si llamar a `setSculptures` y a `navigate` a la vez puede dar
problemas. Supongo que React agrupa las actualizaciones, pero lo probaré cuando lo
implemente.

## 5. `useReducer`: lo descarto por desconocimiento

En la documentación de React vi que existe `useReducer` para estados complicados. No lo he
usado nunca y no acabo de entender cómo encajaría aquí. El enunciado pide `useState` y para
añadir, editar y borrar en un array me basta con `useState`, así que no lo voy a usar. Si más
adelante el estado se complica, volveré a mirarlo.

## 6. Decisiones finales

### Mapa de rutas

| Ruta                     | Página                | Operación |
| ------------------------ | --------------------- | --------- |
| `/` (index)              | `SculptureListPage`   | Read      |
| `/sculptures/:id`        | `SculptureDetailPage` | Read      |
| `/sculptures/new`        | `SculptureFormPage`   | Create    |
| `/sculptures/:id/edit`   | `SculptureFormPage`   | Update    |
| `*`                      | `NoPage`              | —         |

### Contrato del contexto

`Layout` pasará por `Outlet context`:

```js
{
  sculptures,
  addSculpture,
  updateSculpture,
  deleteSculpture,
}
```

Así todas las páginas usan los mismos nombres y no tengo que inventarlos en cada una.

### Actualizaciones inmutables

Cuando escriba los handlers:

- añadir: `[...sculptures, nueva]`;
- editar: `sculptures.map(...)`;
- borrar: `sculptures.filter(...)`.

No quiero modificar el array original porque el estado de React no debe mutarse.

### Navegación superior

`Layout` tendrá `NavLink` a la lista y a “Add”. Cuando llegue la parte 4 miraré cómo marcar
el enlace activo.

## 7. Dudas que dejo para las partes 4–7

- No sé si declarar `sculptures/:id` antes que `sculptures/new` hará que `new` se interprete
  como un id. Lo probaré en la parte 4.
- No sé qué mostrar si el id del detalle no existe.
- No sé si el formulario se reinicia al cambiar de `/new` a `/edit` (parte 6).
- No sé si `setSculptures` y `navigate` a la vez dan problemas (parte 6).
- No sé cómo marcar el enlace activo del menú.

## 8. Qué no he tocado

- No he creado `src/pages/` ni ningún componente.
- No he modificado `App.jsx` ni los estilos.
- Solo he hecho una prueba temporal para comprobar `Outlet` y `useParams`, y la he borrado.

El commit de esta parte es solo de documentación, porque la parte 3 consiste en pensar antes
de escribir código.
