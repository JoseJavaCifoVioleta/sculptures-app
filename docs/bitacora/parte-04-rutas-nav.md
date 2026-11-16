# Parte 4 — Rutas y barra de navegación

## Qué pedía esta parte

Montar el router en `App.jsx` y crear `Layout.jsx` con una barra superior de navegación:

- `BrowserRouter`, `Routes` y `Route` en `App`.
- Rutas anidadas dentro de `Layout`: índice (lista), detalle, crear, editar y 404.
- `NavLink` a la lista y a “Add”.
- Pasar el estado compartido a las páginas con `<Outlet context={...} />`.

## Punto de partida

`App.jsx` seguía siendo la página de bienvenida de Vite. `react-router-dom` ya estaba
instalado desde la parte 1 y el estado con los ids ya estaba en `data.js` desde la parte 2.

## Fallo 1: Vite me peta porque las páginas no existen

Copié el esqueleto del enunciado tal cual. Al arrancar, Vite me suelta:

```
Failed to resolve import "./pages/Layout.jsx" from "src/App.jsx". Does the file exist?
```

Es lógico: el router necesita un `element` para cada `Route` y las páginas son de las partes
5, 6 y 7. No existen todavía.

**Solución:** creo la carpeta `src/pages/` y dejo cascarones mínimos:

- `SculptureListPage.jsx` → solo un título y un texto de “pendiente”.
- `SculptureDetailPage.jsx` → igual.
- `SculptureFormPage.jsx` → igual.
- `NoPage.jsx` → este sí lo hago completo, porque no tiene parte propia: un 404 con enlace
  a la lista.

Podría haber puesto `<div>TODO</div>` directamente en `App.jsx` y cambiar las rutas después,
pero entonces tendría que reescribir `App.jsx` en la parte 5. Prefiero cascarones ahora y
rellenarlos sin tocar las rutas.

## Fallo 2: `Layout` se queda sin las esculturas

Dejé `<Route path="/" element={<Layout />} />` como en el enunciado. En la página de lista
puse `const { sculptures } = useOutletContext()` y al hacer `sculptures.length` me petó:
`sculptures` era `undefined`.

En la parte 3 ya había comprobado que `<Outlet sculptures={...} />` no reenvía props. El
problema ahora era otro: **`Layout` no recibía nada porque la ruta lo montaba sin props**.

Buscando “pass props to Outlet react router” encontré esta respuesta de Stack Overflow, que
lo explica claro: *“The Outlet doesn't take any props, nor will it pass anything as props on
to what it renders”*.

- https://stackoverflow.com/questions/70027979/passing-props-to-outlet-when-nesting-routes-in-react-router-v6

**Solución:** pasarle las props a `Layout` desde el `element` de la ruta:

```jsx
<Route
  path="/"
  element={
    <Layout
      sculptures={sculptures}
      addSculpture={addSculpture}
      updateSculpture={updateSculpture}
      deleteSculpture={deleteSculpture}
    />
  }
>
```

Y dentro de `Layout`, repartirlas por el `Outlet`:

```jsx
<Outlet context={{ sculptures, addSculpture, updateSculpture, deleteSculpture }} />
```

Esto es lo que recomienda la documentación oficial de `useOutletContext`:

- https://reactrouter.com/api/hooks/useOutletContext
- https://reactrouter.com/api/components/Outlet

## Fallo 3: el enlace “List” siempre está activo

Puse los dos `NavLink` y, al entrar en `/sculptures/3`, “List” seguía marcado como activo.
Claro: `NavLink` a `/` coincide con cualquier ruta que empiece por `/`.

Busqué “react router navlink always active” y salió esta pregunta:

- https://stackoverflow.com/questions/71236890/react-router-dom-v6-navlink-is-always-active

**Solución:** añadir `end` al enlace de la lista:

```jsx
<NavLink to="/" end>List</NavLink>
```

Con `end`, solo se marca activo cuando la ruta es exactamente `/`. Comprobado después en el
HTML: en `/sculptures/new` la clase `active` la lleva “Add”, no “List”.

## Fallo 4 (falso amigo): la clase `active` y las respuestas viejas de Stack Overflow

En varias respuestas de 2021–2022 leí que en React Router v6 había que usar la función de
`className` porque `activeClassName` ya no existía:

```jsx
<NavLink className={({ isActive }) => (isActive ? 'active' : undefined)}>
```

Lo probé y funcionaba, pero luego vi que `NavLink` ya añade la clase `active` por defecto.
Lo comprobé renderizando el componente y el HTML salía así:

```html
<a aria-current="page" class="active" href="/">List</a>
```

En la versión que tenemos (React Router 7) no hace falta la función. Quité el `className`
para no complicar `Layout` y dejé el CSS apuntando a `.topbar a.active`. Me apunto la
lección: muchas respuestas de Stack Overflow son de v6 y no siempre aplican igual en v7.

Documentación oficial de `NavLink`:

- https://reactrouter.com/api/components/NavLink

## Fallo 5: el 404 se comía la barra de navegación

Primero puse la ruta `*` fuera de `Layout`. Al entrar en `/no-existe` aparecía el 404, pero
desaparecía el menú. Tiene sentido: si el 404 no está dentro de la ruta padre, no se renderiza
dentro del `Outlet`.

**Solución:** moverla dentro de `Layout`:

```jsx
<Route path="*" element={<NoPage />} />
```

Ahora el 404 conserva la barra y el enlace “Back to list”.

## Fallo 6: ESLint me marca `setSculptures` sin usar

El esqueleto del enunciado ya traía los TODO de `addSculpture`, `updateSculpture` y
`deleteSculpture`. Si escribo solo:

```jsx
const [sculptures, setSculptures] = useState(sculptureList)
```

ESLint me marca `setSculptures` como variable sin usar (`no-unused-vars`). Como los handlers
ya estaban en el esqueleto de esta parte, los escribí ahora:

```jsx
function addSculpture(sculpture) {
  const newSculpture = { ...sculpture, id: crypto.randomUUID() }
  setSculptures((current) => [...current, newSculpture])
}

function updateSculpture(id, changes) {
  setSculptures((current) =>
    current.map((sculpture) =>
      String(sculpture.id) === String(id)
        ? { ...sculpture, ...changes, id: sculpture.id }
        : sculpture,
    ),
  )
}

function deleteSculpture(id) {
  setSculptures((current) =>
    current.filter((sculpture) => String(sculpture.id) !== String(id)),
  )
}
```

Decisiones:

- Uso las funciones actualizadoras (`setSculptures(current => ...)`) porque el estado nuevo
  depende del anterior. Es lo que recomienda la documentación de `useState`:
  https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state
- Comparo los ids con `String()` porque los datos semilla tienen ids numéricos y las
  esculturas nuevas usarán `crypto.randomUUID()` (texto), como decidí en la parte 2.
- `updateSculpture` conserva el `id` original aunque los cambios traigan otro.
- `addSculpture` genera el id con `crypto.randomUUID()`.

Estos handlers todavía no los usa ninguna página: se probarán en las partes 5, 6 y 7. Aquí
solo dejo el estado y el contexto preparados.

## Dudas que comprobé

- **¿`sculptures/:id` se come `sculptures/new`?** Probé el caso con `:id` declarado antes y
  `/sculptures/new` renderiza el formulario, no el detalle. Las rutas estáticas tienen
  prioridad, así que no hace falta reordenar. Aun así, el orden del archivo sigue el del
  enunciado.
- **¿`index` o `path="/"` para la ruta de la lista?** Probé las dos y las dos renderizan la
  lista. Me quedo con `index` porque es lo que se usa para la ruta por defecto de un layout.
- **¿Un solo `BrowserRouter`?** Sí, en `App.jsx` como dice el enunciado. `main.jsx` no se
  toca.

## Estilos

Sustituí el contenido de `App.css` (el del template de Vite) por estilos propios:

- `.topbar`: barra superior con `display: flex`, borde inferior y `position: sticky`.
- `.topbar a.active`: color y fondo del enlace activo.
- `main`: ocupa el espacio restante, con padding y texto alineado a la izquierda.

Borré las clases del template (`.hero`, `.counter`, `#next-steps`, etc.) porque `App.jsx` ya
no las usa. Los archivos de `src/assets/` siguen ahí; no los he borrado por si hicieran falta,
aunque ahora mismo no se usan.

## Verificación

- `npm run lint` → sin errores.
- `npm run build` → compila.
- Prueba temporal con `MemoryRouter` y los componentes reales, renderizados a HTML:

| Ruta               | Resultado                                  |
| ------------------ | ------------------------------------------ |
| `/`                | lista, “List” activo                       |
| `/sculptures/3`    | detalle, ningún enlace activo              |
| `/sculptures/new`  | formulario, “Add” activo                   |
| `/no-existe`       | 404 dentro de `Layout`, con barra visible  |

El archivo de prueba lo borré después; no forma parte del proyecto.

## Qué no he hecho todavía

- La lista real, el detalle y el formulario (partes 5 y 6).
- El borrado desde la interfaz (parte 7).
- Cambios en `data.js`, `main.jsx`, `index.html` o la configuración de Vite.
