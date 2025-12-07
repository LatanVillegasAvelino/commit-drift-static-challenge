// src/js/CommitManager.js
/**
 * Clase que gestiona la lógica central del juego Commit Drift.
 * Define el modelo de datos y las reglas del juego.
 */
class CommitManager {
    constructor(targetCommits = 15, maxBugs = 5) {
        this.targetCommits = targetCommits;
        this.maxBugs = maxBugs;
        this.commitsDone = 0;
        this.bugCount = 0;
        this.isFinished = false;
        this.isPlaying = true;
    }

    /**
     * Simula la acción de hacer un commit, con riesgo de introducir un bug.
     * @returns {object} Mensaje y estado del juego.
     */
    makeCommit() {
        if (!this.isPlaying) {
            return { message: "El repositorio está congelado.", status: this.getStatus() };
        }

        this.commitsDone += 1;
        let message = `Commit [${this.commitsDone}] exitoso. Progreso limpio.`;
        
        // Probabilidad base de 30% de introducir un bug
        if (Math.random() < 0.30) {
            let bugsIntroduced = 1;
            
            // Mecánica de Deuda Técnica (Tech Debt): Riesgo extra si hay muchos bugs
            if (this.bugCount >= 3 && Math.random() < 0.20) {
                bugsIntroduced = 2;
                message = `ALERTA CRÍTICA: Commit introdujo ${bugsIntroduced} bugs debido a la Deuda Técnica.`;
            } else {
                message = `ADVERTENCIA: Commit introdujo 1 nuevo bug.`;
            }
            
            this.bugCount += bugsIntroduced;
        }
        
        this._checkProjectStatus();
        return { message: message, status: this.getStatus(), type: (this.bugCount > 0 && message.includes("ADVERTENCIA")) ? 'warning' : 'info' };
    }

    /**
     * Simula la corrección de un bug.
     * @returns {object} Mensaje y estado del juego.
     */
    fixBug() {
        if (!this.isPlaying) {
            return { message: "El repositorio está congelado.", status: this.getStatus() };
        }
        
        if (this.bugCount > 0) {
            this.bugCount -= 1;
            this.commitsDone += 1; // El fix cuenta como un commit (turno)
            const message = "Bug corregido. El código está más limpio. +1 Commit de mantenimiento.";
            
            this._checkProjectStatus();
            return { message: message, status: this.getStatus(), type: 'success' };
        } else {
            return { message: "No hay bugs activos para corregir. Sigue avanzando.", status: this.getStatus(), type: 'info' };
        }
    }

    /**
     * Verifica las condiciones de victoria o derrota.
     */
    _checkProjectStatus() {
        if (this.bugCount >= this.maxBugs) {
            this.isFinished = true;
            this.isPlaying = false;
        } else if (this.commitsDone >= this.targetCommits && this.bugCount < this.maxBugs) {
            this.isFinished = true;
            this.isPlaying = false;
        }
    }

    /**
     * Retorna el estado actual del juego.
     * @returns {object} Objeto con el estado del juego.
     */
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
