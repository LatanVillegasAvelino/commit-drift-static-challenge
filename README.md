# 🚀 Commit Drift: The Static Repository Challenge

[![GitHub Pages Status](https://github.com/LatanVillegasAvelino/commit-drift-static-challenge/actions/workflows/pages/pages-build-deployment/badge.svg)](https://latanvillegasavelino.github.io/commit-drift-static-challenge/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Hecho con](https://img.shields.io/badge/Hecho%20con-JavaScript%20Puro-yellow.svg)](https://developer.mozilla.org/es/docs/Web/JavaScript)

## 🎯 Descripción del Juego

**Commit Drift** es un simulador de gestión de riesgos diseñado como una aplicación web estática para **GitHub Pages**.

El jugador asume el rol de un desarrollador, intentando balancear el progreso (`COMMIT`) contra la acumulación inevitable de **Deuda Técnica (Bugs)**. El objetivo es alcanzar la meta de *commits* antes de que el código colapse por el exceso de fallos. El juego promueve la **gestión ética** al obligar al desarrollador a priorizar la calidad sobre la velocidad.

## ✨ Características Principales

* **Arquitectura Consolidada (Frontend-Only):** Todo el código se ejecuta en el navegador (JavaScript, HTML, CSS), eliminando la necesidad de un *backend* y garantizando el despliegue gratuito en GitHub Pages.
* **Mecánica de Riesgo Progresivo:** Cada `COMMIT` tiene riesgo de introducir *Bugs*. El riesgo aumenta exponencialmente si la **Deuda Técnica** (más de 3 *Bugs*) es ignorada.
* **Decisión Estratégica:** El jugador debe decidir cuándo invertir tiempo (`FIX BUG`) para reducir el riesgo en lugar de avanzar en el progreso (`COMMIT`).
* **Interfaz de Consola:** Diseño minimalista que simula una interfaz de línea de comandos (CLI).

## 💻 Pila Técnica y Estructura

El proyecto utiliza una arquitectura de **Lógica Consolidada** para máxima fiabilidad en entornos estáticos.

| Componente | Archivo | Responsabilidad |
| :--- | :--- | :--- |
| **Punto de Entrada** | **`index.html`** | Estructura principal y conexión a los assets. |
| **Lógica y Controlador** | **`src/js/main.js`** | Contiene la **Clase `CommitManager`** (el modelo de juego) y el código del controlador de UI (manejo de eventos y DOM). |
| **Presentación** | **`src/css/main.css`** | Define los estilos de la interfaz tipo consola. |

## 🚀 Despliegue y Ejecución

El juego está listo para ser jugado inmediatamente después de un `git push` exitoso.

### Despliegue en GitHub Pages

1.  Asegúrate de que la fuente (`Source`) en **Settings** > **Pages** esté configurada en la rama **`main`** y la carpeta **`/(root)`**.
2.  Una vez publicado, tu juego estará accesible en:
    `https://LatanVillegasAvelino.github.io/commit-drift-static-challenge/`

## 🤝 Contribución

Este proyecto utiliza la licencia **MIT**, promoviendo el software libre y la contribución de la comunidad. Siéntete libre de crear un **Issue** para sugerir nuevas características o enviar un **Pull Request** con correcciones de código.
