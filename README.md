# 🚀 Commit Drift: The Static Repository Challenge

[![GitHub Pages Status](https://github.com/LatanVillegasAvelino/commit-drift-static-challenge/actions/workflows/pages/pages-build-deployment/badge.svg)](https://latanvillegasavelino.github.io/commit-drift-static-challenge/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Hecho con](https://img.shields.io/badge/Hecho%20con-JavaScript%20Puro-yellow.svg)](https://developer.mozilla.org/es/docs/Web/JavaScript)

## 🎯 Descripción del Juego

**Commit Drift** es un simulador de gestión de riesgos diseñado como una aplicación web estática para **GitHub Pages**.

El jugador asume el rol de un desarrollador en un proyecto con un tiempo limitado y un objetivo de *commits*. La mecánica central obliga a balancear el progreso (`COMMIT`) contra la inevitable acumulación de **Deuda Técnica (Bugs)**. El objetivo es alcanzar la meta de *commits* antes de que el código colapse por el exceso de fallos.

## ✨ Características Principales

* **Arquitectura Estática Pura (Frontend-Only):** Todo el juego se ejecuta en el navegador (JavaScript, HTML, CSS), eliminando la necesidad de un *backend* y garantizando la máxima portabilidad y un despliegue gratuito.
* **Mecánica de Riesgo:** Cada `COMMIT` tiene una probabilidad de introducir *Bugs*.
* **Gestión de Deuda Técnica:** El número de *Bugs* activos aumenta el riesgo de introducir fallos aún más graves en el futuro.
* **Interfaz de Consola:** Diseño minimalista que simula una interfaz de línea de comandos (CLI) para una inmersión completa.

## 🛠️ Pila Técnica y Estructura

El proyecto se basa en los principios de **Código Limpio** y la **Separación de Intereses (SoC)**.

| Componente | Tecnología | Responsabilidad |
| :--- | :--- | :--- |
| **Lógica Central** | **`src/js/CommitManager.js`** | Contiene la **clase modelo** que maneja las reglas del juego (probabilidades, *bugs*, victoria/derrota). |
| **Controlador/UI** | **`src/js/main.js`** | Funciona como el **controlador**. Se encarga de la manipulación del DOM y de traducir los clics de los botones en llamadas a la lógica del juego. |
| **Presentación** | **`src/css/main.css` / `index.html`** | Estilos de la consola y estructura HTML. |

## 🚀 Despliegue y Ejecución

Dado que es una aplicación estática, el despliegue es inmediato y sin costo.

### Ejecución Local

1.  Clona el repositorio:
    ```bash
    git clone [https://github.com/LatanVillegasAvelino/commit-drift-static-challenge.git](https://github.com/LatanVillegasAvelino/commit-drift-static-challenge.git)
    cd commit-drift-static-challenge
    ```
2.  Abre el archivo `index.html` en tu navegador favorito.

### Despliegue en GitHub Pages

El juego se publica automáticamente a través de GitHub Actions. Si deseas configurarlo manualmente:

1.  Ve a **Settings** (Configuración) > **Pages**.
2.  Asegúrate de que la fuente (`Source`) esté configurada para desplegar desde la rama **`main`** y la carpeta **`/(root)`** (Raíz).
3.  Una vez publicado, tu juego estará accesible en:
    `https://LatanVillegasAvelino.github.io/commit-drift-static-challenge/`

## 🤝 Contribución

Este proyecto utiliza la licencia **MIT**, promoviendo el software libre y la contribución de la comunidad.

Si encuentras un *bug* (¡irónico!), tienes una sugerencia de mecánica o quieres contribuir con código (ej. implementar la función `ASK REVIEW`), siéntete libre de crear un **Issue** o enviar un **Pull Request**.
