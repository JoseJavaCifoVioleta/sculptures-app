# Sculptures App — Práctica de CRUD con React

SPA para gestionar un catálogo de esculturas públicas. Es la resolución, paso a paso, del
ejercicio [`React Sculptures CRUD Practice`](docs/React%20Sculptures%20CRUD%20Practice.md):
un CRUD completo (Create, Read, Update, Delete) con navegación superior mediante
`react-router-dom`.

## Funcionalidades

- CRUD completo sobre un catálogo de esculturas.
- Confirmación reutilizable antes de borrar o restaurar, con un `<dialog>` nativo.
- Borrado tanto desde el listado como desde el detalle, con vuelta al catálogo tras confirmar.
- Validación del formulario con errores en línea y foco en el primer campo inválido.
- Filtro por artista, nombre, año o descripción (`?field=year&q=2024`), insensible a mayúsculas
  y acentos. Los enlaces antiguos `?artist=hepworth` siguen funcionando.
- Dos vistas conmutables: catálogo completo o paginado de seis en seis, con el estado en la URL
  (`/?view=pages&page=2`).
- Galería en `/gallery` para recorrer el catálogo de una en una: Previous/Next con **Loop**
  opcional, miniaturas, like por escultura, año, fondos, animación y descripción
  expandible.
- Persistencia en `localStorage` mediante el hook `useSculptures`.
- Modo claro y oscuro automáticos según la preferencia del sistema.

## Stack

- **React 19** con componentes funcionales y hooks.
- **Vite 8** como bundler y servidor de desarrollo.
- **react-router-dom 7** para las rutas.
- **ESLint 10** (flat config) para el análisis estático.
- JavaScript (sin TypeScript), tal como propone el enunciado.

## Puesta en marcha

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

Otros comandos:

```bash
npm run lint      # análisis estático
npm run build     # build de producción
npm run preview   # previsualizar el build
```

## Estructura del proyecto

```
sculptures-app/
├── docs/
│   ├── bitacora/          # diario de desarrollo, una entrada por parte o bonus
│   ├── learn/             # material de estudio y guía de conceptos
│   └── ...                # enunciado y capturas del proceso
├── public/                # favicon e iconos estáticos
├── src/
│   ├── assets/            # imágenes del template de Vite (sin usar)
│   ├── components/        # ConfirmDialog, Pagination y SculpturesGallery
│   ├── hooks/             # useSculptures: estado, CRUD y persistencia
│   ├── pages/             # Layout, listado, detalle, formulario, galería y 404
│   ├── App.jsx            # router y composición de la aplicación
│   ├── App.css            # estilos de la barra y del contenido
│   ├── index.css          # estilos globales y variables de tema
│   ├── data.js            # dataset de esculturas (parte 2)
│   └── main.jsx           # punto de entrada
├── index.html
├── vite.config.js
└── eslint.config.js
```

## Estado del ejercicio

| Parte | Contenido                                     | Estado | Bitácora                                                    |
| ----- | --------------------------------------------- | ------ | ----------------------------------------------------------- |
| 1     | Scaffold del proyecto con Vite                | ✅     | [Parte 1](docs/bitacora/parte-01-scaffold.md)               |
| 2     | Preparar los datos (`src/data.js`)            | ✅     | [Parte 2](docs/bitacora/parte-02-datos.md)                  |
| 3     | Pensar el diseño antes de codificar           | ✅     | [Parte 3](docs/bitacora/parte-03-diseno.md)                 |
| 4     | Rutas, navegación y estética                  | ✅     | [Parte 4](docs/bitacora/parte-04-rutas-nav.md)              |
| 5     | Read: listado y detalle                       | ✅     | [Parte 5](docs/bitacora/parte-05-read.md)                   |
| 6     | Create + Update con un formulario compartido  | ✅     | [Parte 6](docs/bitacora/parte-06-create-update.md)          |
| 7     | Delete y restaurar catálogo                   | ✅     | [Parte 7](docs/bitacora/parte-07-delete.md)                 |
| Bonus | Confirmación de borrado y restauración        | ✅     | [Bonus 1](docs/bitacora/bonus-01-confirmacion-borrado.md)   |
| Bonus | Validación del formulario                     | ✅     | [Bonus 2](docs/bitacora/bonus-02-validacion-formulario.md)  |
| Bonus | Filtro por artista con `useSearchParams`      | ✅     | [Bonus 3](docs/bitacora/bonus-03-filtro-artista.md)         |
| Bonus | `useSculptures` y persistencia                | ✅     | [Bonus 4](docs/bitacora/bonus-04-hook-localstorage.md)      |
| Bonus | Borrado desde el detalle                     | ✅     | [Bonus 5](docs/bitacora/bonus-05-borrado-detalle.md)        |
| Anexo | Vista paginada con conmutador                 | ✅     | [Anexo 1](docs/bitacora/anexo-01-vista-paginada.md)         |
| Anexo | Filtro por campo seleccionable                | ✅     | [Anexo 2](docs/bitacora/anexo-02-filtro-por-campo.md)       |
| Anexo | Galería con las diez ideas de `exercise.md`   | ✅     | [Anexo 3](docs/bitacora/anexo-03-galeria.md)                |

## Bitácora de desarrollo

Cada parte del ejercicio tiene su propia entrada con el análisis, las decisiones tomadas y
los cambios realizados:

- [Parte 1 — Crear el proyecto con Vite](docs/bitacora/parte-01-scaffold.md)
- [Parte 2 — Preparar los datos](docs/bitacora/parte-02-datos.md)
- [Parte 3 — Pensar el diseño antes de codificar](docs/bitacora/parte-03-diseno.md)
- [Parte 4 — Rutas, navegación y estética](docs/bitacora/parte-04-rutas-nav.md)
- [Parte 5 — Read: listado y detalle](docs/bitacora/parte-05-read.md)
- [Parte 6 — Create + Update: un formulario compartido](docs/bitacora/parte-06-create-update.md)
- [Parte 7 — Delete](docs/bitacora/parte-07-delete.md)
- [Bonus 1 — Confirmar el borrado con un modal](docs/bitacora/bonus-01-confirmacion-borrado.md)
- [Bonus 2 — Validación del formulario](docs/bitacora/bonus-02-validacion-formulario.md)
- [Bonus 3 — Filtro por artista con `useSearchParams`](docs/bitacora/bonus-03-filtro-artista.md)
- [Bonus 4 — `useSculptures` y `localStorage`](docs/bitacora/bonus-04-hook-localstorage.md)
- [Bonus 5 — Borrado desde el detalle](docs/bitacora/bonus-05-borrado-detalle.md)
- [Anexo 1 — Vista paginada con conmutador](docs/bitacora/anexo-01-vista-paginada.md)
- [Anexo 2 — Filtro por campo seleccionable](docs/bitacora/anexo-02-filtro-por-campo.md)
- [Anexo 3 — Galería con las diez ideas](docs/bitacora/anexo-03-galeria.md)

## Material de estudio

La carpeta [`docs/learn/`](docs/learn/) reúne apuntes y una guía de los conceptos que aparecen
en la práctica:

- [Guía de estudio de los bonus y anexos](docs/learn/README.md): `<dialog>`, validación, `useSearchParams`,
  filtros por campo, hooks con `localStorage`, paginación, borrado desde el detalle y la galería
  con estado local, con preguntas para repasar.
- [Apuntes de React](docs/learn/React_estudio16112026.pdf) y capturas de estudio.

## Próximos pasos

La práctica principal, los bonus y los anexos están completos. Como mejoras opcionales quedarían:

- Mantener el filtro, la vista y la página al crear o editar una escultura.
- Persistir los likes de la galería si deben sobrevivir a una recarga.
- Sustituir `localStorage` por una API real si el catálogo dejara de ser una práctica local.

## Créditos

- Datos de las esculturas: [`AlbertProfe/sculptures`](https://github.com/AlbertProfe/sculptures),
  basados en el ejemplo de la documentación de React.
- Enunciado de la práctica: [`docs/React Sculptures CRUD Practice.md`](docs/React%20Sculptures%20CRUD%20Practice.md).
- Enunciado de la galería: [`docs/exercise.md`](docs/exercise.md).
