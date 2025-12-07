// src/js/main.js
/**
 * Lógica central del juego (Clase CommitManager) y Controlador de UI (main logic)
 * Consolidados para el despliegue estático en GitHub Pages.
 */

// ==========================================================
// 1. CLASE MODELO: CommitManager (LÓGICA PURA DEL JUEGO)
// ==========================================================
class CommitManager {
    constructor(targetCommits = 15, maxBugs = 5) {
        this.targetCommits = targetCommits;
        this.maxBugs = maxBugs;
        this.commitsDone = 0;
        this.bugCount = 0;
        this.isFinished = false;
        this.isPlaying = true;
    }

    makeCommit() {
        if (!this.isPlaying) {
            return { message: "El repositorio está congelado.", status: this.getStatus() };
        }

        this.commitsDone += 1;
        let message = `Commit [${this.commitsDone}] exitoso. Progreso limpio.`;
        let type = 'info';
        
        if (Math.random() < 0.30) {
            let bugsIntroduced = 1;
            
            // Mecánica de Deuda Técnica (Tech Debt)
            if (this.bugCount >= 3 && Math.random() < 0.20) {
                bugsIntroduced = 2;
                message = `ALERTA CRÍTICA: Commit introdujo ${bugsIntroduced} bugs debido a la Deuda Técnica.`;
                type = 'error';
            } else {
                message = `ADVERTENCIA: Commit introdujo 1 nuevo bug.`;
                type = 'warning';
            }
            
            this.bugCount += bugsIntroduced;
        }
        
        this._checkProjectStatus();
        return { message: message, status: this.getStatus(), type: type };
    }

    fixBug() {
        if (!this.isPlaying) {
            return { message: "El repositorio está congelado.", status: this.getStatus() };
        }
        
        if (this.bugCount > 0) {
            this.bugCount -= 1;
            this.commitsDone += 1;
            const message = "Bug corregido. El código está más limpio. +1 Commit de mantenimiento.";
            
            this._checkProjectStatus();
            return { message: message, status: this.getStatus(), type: 'success' };
        } else {
            return { message: "No hay bugs activos para corregir. Sigue avanzando.", status: this.getStatus(), type: 'info' };
        }
    }

    _checkProjectStatus() {
        if (this.bugCount >= this.maxBugs) {
            this.isFinished = true;
            this.isPlaying = false;
        } else if (this.commitsDone >= this.targetCommits && this.bugCount < this.maxBugs) {
            this.isFinished = true;
            this.isPlaying = false;
        }
    }

    getStatus() {
        return {
            commitsDone: this.commitsDone,
            targetCommits: this.targetCommits,
            bugCount: this.bugCount,
            isFinished: this.isFinished,
            maxBugs: this.maxBugs
        };
    }
}

// ==========================================================
// 2. CONTROLADOR UI (DOM y Eventos)
// ==========================================================

const manager = new CommitManager(15, 5); // Meta: 15 commits, Max 5 bugs

// Elementos DOM
const statusDiv = document.getElementById('status-output');
const consoleDiv = document.getElementById('console-output');
const commitBtn = document.getElementById('commit-btn');
const fixBtn = document.getElementById('fix-btn');
const reviewBtn = document.getElementById('review-btn');


/**
 * Muestra un mensaje en la consola virtual.
 */
function logToConsole(message, type = 'info') {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    p.className = `log-${type}`;
    consoleDiv.appendChild(p);
    // Auto-scroll
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

/**
 * Actualiza la UI con los datos del CommitManager.
 */
function updateUI(result) {
    const data = result.status;
    
    // 1. Mostrar Mensaje de Acción
    logToConsole(result.message, result.type);

    // 2. Actualizar el Dashboard de Estado
    const bugClass = (data.bugCount >= data.maxBugs - 1) ? 'log-error' : 'log-warning';
    
    statusDiv.innerHTML = `
        <p>Commits Listos: <strong>${data.commitsDone}/${data.targetCommits}</strong></p>
        <p>Bugs Activos (Riesgo de Colapso): <strong class="${bugClass}">${data.bugCount}/${data.maxBugs}</strong></p>
    `;

    // 3. Lógica de Fin de Juego
    if (data.isFinished) {
        commitBtn.disabled = true;
        fixBtn.disabled = true;
        reviewBtn.disabled = true;

        if (data.bugCount >= data.maxBugs) {
            logToConsole("COLAPSO DEL PROYECTO. Fallo irrecuperable de la rama.", 'error');
        } else {
            logToConsole("¡PROYECTO MERGED! El código es estable. Victoria!", 'success');
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


// ==========================================================
// INICIALIZACIÓN
// ==========================================================

window.onload = () => {
    logToConsole("Iniciando Commit Drift: The Static Repository Challenge...");
    // Forzar la actualización inicial con el estado 0/15 y 0/5
    updateUI({ message: "Listo para el primer commit en la rama principal.", status: manager.getStatus(), type: 'info' });
};
