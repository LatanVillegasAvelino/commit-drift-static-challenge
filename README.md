# 🚀 Commit Drift: Technical Debt Racer

[![GitHub Pages Status](https://github.com/LatanVillegasAvelino/commit-drift-static-challenge/actions/workflows/pages/pages-build-deployment/badge.svg)](https://latanvillegasavelino.github.io/commit-drift-static-challenge/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Hecho con](https://img.shields.io/badge/Hecho%20con-JavaScript%20Puro-yellow.svg)](https://developer.mozilla.org/es/docs/Web/JavaScript)

## 🎯 Descripción del Juego

**Commit Drift** es un simulador de gestión de riesgos diseñado como una aplicación web estática que simula el desarrollo de software.

El jugador asume el rol de un desarrollador en una carrera contra la inestabilidad del código. La mecánica central obliga a balancear el progreso (`COMMIT`) contra la acumulación de **Deuda Técnica (Bugs)**, la cual puede colapsar el proyecto. El juego se enfoca en la **gestión estratégica de recursos (Créditos de Código ₿)** para mejorar la estabilidad y completar la progresión por módulos (Niveles).

## ✨ Características y Profesionalismo (v2.1)

Esta versión incorpora una arquitectura limpia y una experiencia de usuario que simula un producto profesional:

* **Arquitectura Consolidada:** Toda la lógica central (`CommitManager`, niveles y tienda) reside en un único módulo JavaScript para la máxima fiabilidad y rendimiento en GitHub Pages.
* **Movimiento Simulado:** Uso de **Transiciones CSS** y **JavaScript** para animar la moto (`🏍️`) a través de la pista de progreso, simulando el avance del desarrollo.
* **Gestión Estratégica:** Implementación de **Créditos de Código (₿)** y una **Tienda de Herramientas** para que el jugador pueda mitigar riesgos y mejorar permanentemente las probabilidades de éxito.
* **Feedback Profesional:** Uso de **Animación de Tipeo** en la consola para simular la respuesta de un terminal real (mejorando la UX).
* **Progresión por Módulos:** El juego está dividido en Niveles, cada uno con un objetivo y un límite de *bugs* específico.

## 💻 Pila Técnica y Estructura

El proyecto utiliza una arquitectura de **Lógica Consolidada** con separación estricta de Estilos y Lógica.

| Archivo | Rol Técnico | Notas |
| :--- | :--- | :--- |
| **`src/js/main.js`** | **Lógica Consolidada (Modelo/Controlador)** | Contiene la Clase `CommitManager`, la lógica de niveles, tienda, y el manejo de todos los eventos del DOM. |
| **`index.html`** | **VISTA** | Estructura principal con el tablero de estado, la pista de la moto y la ventana de la tienda. |
| **`src/css/main.css`** | **ESTILO** | Implementa un Esquema de Color Claro, las transiciones de movimiento, y el estilo de terminal. |

## 🚀 Despliegue y Ejecución

El juego está diseñado para ser publicado instantáneamente.

### Despliegue en GitHub Pages

1.  Asegúrate de que la fuente (`Source`) en **Settings** > **Pages** esté configurada en la rama **`main`** y la carpeta **`/(root)`**.
2.  Una vez publicado, tu juego estará accesible en:
    `https://LatanVillegasAvelino.github.io/commit-drift-static-challenge/`

## 🤝 Contribución

Este proyecto utiliza la licencia **MIT**, promoviendo el software libre y la contribución de la comunidad. Siéntete libre de crear un **Issue** o enviar un **Pull Request**.
