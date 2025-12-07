// src/js/main.js
/**
 * Controlador principal de la UI para Commit Drift.
 * Gestiona la interacción con el DOM y la clase CommitManager.
 */

// Inicialización del modelo de juego
const manager = new CommitManager(15, 5); // Meta: 15 commits, Max 5 bugs

// Elementos DOM
const statusDiv = document.getElementById('status-output');
const consoleDiv = document.getElementById('console-output');
const commitBtn = document.getElementById('commit-btn');
const fixBtn = document.getElementById('fix-btn');
const reviewBtn = document.getElementById('review-btn');


/**
 * Agrega un mensaje a la consola virtual.
 * @param {string} message - El texto a mostrar.
 * @param {string} type - Clase de estilo ('info', 'warning', 'error', 'success').
 */
function logToConsole(message, type = 'info') {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    p.className = `log-${type}`;
    consoleDiv.appendChild(p);
    // Auto-scroll al final
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

/**
 * Actualiza la UI con los datos del CommitManager.
 * @param {object} result - Objeto que contiene 'message', 'status' y 'type'.
 */
function updateUI(result) {
    const data = result.status;
    
    // 1. Mostrar Mensaje de Acción
    logToConsole(result.message, result.type);

    // 2. Actualizar el Dashboard de Estado
    statusDiv.innerHTML = `
        <p>Commits Listos: <strong>${data.commitsDone}/${data.targetCommits}</strong></p>
        <p>Bugs Activos (Riesgo de Colapso): <strong class="log-${data.bugCount >= data.maxBugs - 1 ? 'error' : 'warning'}">${data.bugCount}/${data.maxBugs}</strong></p>
    `;

    // 3. Lógica de Fin de Juego
    if (data.isFinished) {
        commitBtn.disabled = true;
        fixBtn.disabled = true;
        reviewBtn.disabled = true;

        if (data.bugCount >= data.maxBugs) {
            logToConsole("COLAPSO DEL PROYECTO. Demasiados bugs. El repo ha sido archivado.", 'error');
        } else {
            logToConsole("¡PROYECTO MERGED! Has alcanzado la meta con código estable. Victoria!", 'success');
        }
    }
}

// ==========================================================
// MANEJADORES DE EVENTOS
// ==========================================================

commitBtn.addEventListener('click', () => {
    logToConsole("Comando: commit", 'info');
    const result = manager.makeCommit();
    updateUI(result);
});

fixBtn.addEventListener('click', () => {
    logToConsole("Comando: fix bug", 'info');
    const result = manager.fixBug();
    updateUI(result);
});

// reviewBtn.addEventListener('click', () => {
//    // Lógica futura para ASK REVIEW
// });


// ==========================================================
// INICIALIZACIÓN
// ==========================================================

window.onload = () => {
    logToConsole("Iniciando Commit Drift: The Static Repository Challenge...");
    // Forzar la actualización inicial para mostrar 0/15 y 0/5
    updateUI({ message: "Listo para el primer commit en la rama principal.", status: manager.getStatus(), type: 'info' });
};
