# Sculptures App — Práctica de CRUD con React

SPA para gestionar un catálogo de esculturas públicas. Es la resolución, paso a paso, del
ejercicio [`React Sculptures CRUD Practice`](React%20Sculptures%20CRUD%20Practice.md):
un CRUD completo (Create, Read, Update, Delete) con navegación superior mediante
`react-router-dom`.

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
│   ├── bitacora/          # diario de desarrollo, una entrada por parte
│   └── ...                # enunciado y capturas del proceso
├── public/                # favicon e iconos estáticos
├── src/
│   ├── assets/            # imágenes del template de Vite (sin usar)
│   ├── pages/             # Layout, listado, detalle, formulario y 404
│   ├── App.jsx            # router, estado y handlers CRUD
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
| 6     | Create + Update con un formulario compartido  | ⏳     | —                                                           |
| 7     | Delete                                        | ⏳     | —                                                           |
| Bonus | Confirmación, validación, filtros, etc.       | ⏳     | —                                                           |

## Bitácora de desarrollo

Cada parte del ejercicio tiene su propia entrada con el análisis, las decisiones tomadas y
los cambios realizados:

- [Parte 1 — Crear el proyecto con Vite](docs/bitacora/parte-01-scaffold.md)
- [Parte 2 — Preparar los datos](docs/bitacora/parte-02-datos.md)
- [Parte 3 — Pensar el diseño antes de codificar](docs/bitacora/parte-03-diseno.md)
- [Parte 4 — Rutas, navegación y estética](docs/bitacora/parte-04-rutas-nav.md)
- [Parte 5 — Read: listado y detalle](docs/bitacora/parte-05-read.md)

## Próximos pasos

- **Parte 6**: formulario compartido para crear y editar.
- **Parte 7**: borrado de esculturas con confirmación.

## Créditos

- Datos de las esculturas: [`AlbertProfe/sculptures`](https://github.com/AlbertProfe/sculptures),
  basados en el ejemplo de la documentación de React.
- Enunciado de la práctica: [`docs/React Sculptures CRUD Practice.md`](docs/React%20Sculptures%20CRUD%20Practice.md).
