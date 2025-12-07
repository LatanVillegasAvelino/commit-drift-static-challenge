# Commit Drift: The Static Repository Challenge

[![GitHub Pages Status](https://github.com/[TU_USUARIO]/commit-drift-static-challenge/workflows/github%20pages/badge.svg)](https://[TU_USUARIO].github.io/commit-drift-static-challenge/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 Descripción del Juego

**Commit Drift** es un juego de simulación y gestión de riesgos desarrollado íntegramente en JavaScript para ser desplegado en GitHub Pages. El jugador debe balancear el progreso (Commits) contra la acumulación de Deuda Técnica (Bugs), buscando alcanzar la meta del proyecto antes de que el código colapse.

## ✨ Características

* **Arquitectura Estática Pura:** Cero *backend*. Todo el juego se ejecuta en el navegador.
* **Mecánica de Riesgo:** Probabilidad constante de introducir un Bug al realizar un `COMMIT`.
* **Gestión de Deuda Técnica:** La acumulación de Bugs incrementa exponencialmente el riesgo de nuevos fallos (Tech Debt).
* **Decisión Táctica:** Acciones de `FIX BUG` y `ASK REVIEW` para mitigar riesgos.
* **Diseño:** Interfaz estilizada como terminal (CLI).

## 🚀 Despliegue (GitHub Pages)

Este proyecto está diseñado para desplegarse de inmediato.

**URL de Acceso:** `https://[TU_USUARIO].github.io/commit-drift-static-challenge/`

### Instrucciones de Despliegue

1.  Asegura que todos los archivos estén en la rama `main`.
2.  Ve a **Settings** > **Pages** en tu repositorio de GitHub.
3.  Configura la fuente (`Source`) en la rama `main` y la carpeta **`/(root)`**.

## 💻 Pila Técnica (Stack)

* **Lenguaje:** JavaScript ES6+
* **Estructura:** HTML5
* **Estilo:** CSS3
* **Pruebas:** Por definir (Jasmine/Jest)

## 🛠️ Estructura del Código (Por qué es limpio)

La lógica principal está segregada en dos archivos clave:

1.  **`src/js/CommitManager.js`**: Contiene la clase sin dependencias DOM. Define **el modelo de datos** y las reglas del juego (e.g., lógica de `make_commit`, probabilidades, *upgrades*). **Principio del Modelo Puro**.
2.  **`src/js/main.js`**: Actúa como el *Controller*. Escucha eventos del `index.html` y llama a los métodos de `CommitManager.js`, actualizando el DOM. **Principio de Separación de Intereses (SoC)**.
3.  
