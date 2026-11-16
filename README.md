# Sculptures App — Práctica de CRUD con React

SPA para gestionar un catálogo de esculturas públicas. Es la resolución, paso a paso, del
ejercicio [`React Sculptures CRUD Practice`](React%20Sculptures%20CRUD%20Practice.md):
un CRUD completo (Create, Read, Update, Delete) con navegación superior mediante
`react-router-dom`.

## Stack

- **React 19** con componentes funcionales y hooks.
- **Vite 8** como bundler y servidor de desarrollo.
- **react-router-dom 7** para las rutas (instalado, aún sin usar).
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
│   ├── assets/            # imágenes del template de Vite
│   ├── App.jsx            # (pendiente) rutas y estado compartido
│   ├── App.css            # (pendiente) estilos de la aplicación
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
| 3     | Pensar el diseño antes de codificar           | ⏳     | —                                                           |
| 4     | Rutas y barra de navegación                   | ⏳     | —                                                           |
| 5     | Read: listado y detalle                       | ⏳     | —                                                           |
| 6     | Create + Update con un formulario compartido  | ⏳     | —                                                           |
| 7     | Delete                                        | ⏳     | —                                                           |
| Bonus | Confirmación, validación, filtros, etc.       | ⏳     | —                                                           |

## Bitácora de desarrollo

Cada parte del ejercicio tiene su propia entrada con el análisis, las decisiones tomadas y
los cambios realizados:

- [Parte 1 — Crear el proyecto con Vite](docs/bitacora/parte-01-scaffold.md)
- [Parte 2 — Preparar los datos](docs/bitacora/parte-02-datos.md)

## Próximos pasos

- **Parte 3**: decidir dónde vive el estado, cómo compartirlo con `<Outlet context>` y qué
  rutas necesita la aplicación, antes de escribir código.
- **Parte 4**: crear `Layout` y las rutas anidadas.

## Créditos

- Datos de las esculturas: [`AlbertProfe/sculptures`](https://github.com/AlbertProfe/sculptures),
  basados en el ejemplo de la documentación de React.
- Enunciado de la práctica: [`docs/React Sculptures CRUD Practice.md`](docs/React%20Sculptures%20CRUD%20Practice.md).
