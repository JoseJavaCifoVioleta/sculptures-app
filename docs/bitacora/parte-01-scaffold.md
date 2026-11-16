# Parte 1 — Crear el proyecto con Vite

## Qué pedía el enunciado

Crear el proyecto con la plantilla de React de Vite, instalar dependencias y comprobar que
la página por defecto se sirve correctamente.

```bash
npm create vite@latest sculptures-app -- --template react
cd sculptures-app
npm install
npm install react-router-dom
npm run dev
```

## Decisiones

- Partí del generador oficial para no montar a mano la configuración de React, Vite y
  ESLint.
- Elegí la plantilla **React + JavaScript** (no la de TypeScript) porque el enunciado no la
  requiere y así el ejercicio se centra en los conceptos de React y del router.
- Instalé `react-router-dom` desde el principio aunque todavía no se use: el proyecto queda
  preparado para la parte 4 y evito mezclar la instalación con el desarrollo del enrutado.

## Resultado

La aplicación mostraba la página de bienvenida de Vite en `http://localhost:5173`. No se
modificó `App.jsx` porque el enunciado no lo pide hasta la parte 4.

Estructura inicial generada:

```
sculptures-app/
├── docs/                  # enunciado y capturas del proceso
├── public/                # favicon e iconos del template
├── src/
│   ├── assets/            # imágenes del template
│   ├── App.jsx            # página de bienvenida de Vite
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```
