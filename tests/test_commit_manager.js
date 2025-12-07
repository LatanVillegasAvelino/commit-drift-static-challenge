// tests/test_commit_manager.js

/**
 * Pruebas Unitarias para la clase CommitManager.
 * Estas pruebas verifican la lógica pura del juego (Modelo de Datos).
 * * NOTA: Para ejecutar estas pruebas, se requiere un entorno Node.js con
 * un framework de testing (como Jest o Jasmine).
 */

// Simulación de la clase CommitManager (asume que fue importada en un entorno real)
// Para la prueba manual, la clase debe estar disponible en el ámbito global.

describe('CommitManager: Verificación de Lógica Central', () => {

    // Helper para simular la clase si no está en el scope global (reemplazar con 'require' o 'import' real)
    function getCleanManager(target = 15, maxBugs = 5) {
        // Asumiendo que la clase CommitManager está definida en src/js/main.js
        return new CommitManager(target, maxBugs);
    }
    
    // ==========================================================
    // TEST 1: Inicialización
    // ==========================================================
    test('Debe inicializar con 0 commits y 0 bugs', () => {
        const manager = getCleanManager(10, 5); 
        
        // Asersión (expect.toBe) verifica que el valor sea idéntico
        expect(manager.commitsDone).toBe(0);
        expect(manager.bugCount).toBe(0);
        expect(manager.targetCommits).toBe(10);
    });

    // ==========================================================
    // TEST 2: Función de Corrección (fixBug)
    // ==========================================================
    test('Debe reducir 1 bug y aumentar 1 commit de mantenimiento al corregir', () => {
        const manager = getCleanManager();
        manager.bugCount = 3; // Arrange: Simular 3 bugs existentes
        
        // Act
        manager.fixBug();
        
        // Assert
        expect(manager.bugCount).toBe(2);
        expect(manager.commitsDone).toBe(1); 
    });

    test('No debe permitir corregir bugs si el contador es 0', () => {
        const manager = getCleanManager();
        manager.bugCount = 0;
        
        // Act
        manager.fixBug();
        
        // Assert
        expect(manager.bugCount).toBe(0);
        expect(manager.commitsDone).toBe(1); // El turno de fix siempre cuenta como commit
    });
    
    // ==========================================================
    // TEST 3: Condiciones de Victoria y Derrota
    // ==========================================================
    test('Debe alcanzar la condición de victoria (Proyecto MERGED)', () => {
        const target = 5;
        const manager = getCleanManager(target, 5); 
        manager.bugCount = 2; // Bugs aceptables
        
        // Act: Simular alcanzar el objetivo
        manager.commitsDone = target - 1;
        manager.makeCommit(); 
        
        // Assert
        expect(manager.isFinished).toBe(true);
        expect(manager.isPlaying).toBe(false);
    });
    
    test('Debe alcanzar la condición de derrota (Proyecto COLAPSO)', () => {
        const maxBugs = 5;
        const manager = getCleanManager(10, maxBugs); 
        manager.commitsDone = 3; // Progreso bajo
        
        // Act: Forzar el colapso
        manager.bugCount = maxBugs; 
        manager._checkProjectStatus(); 
        
        // Assert
        expect(manager.isFinished).toBe(true);
        expect(manager.isPlaying).toBe(false);
    });

    // ==========================================================
    // TEST 4: Mecánica de Deuda Técnica (Tech Debt)
    // ==========================================================
    test('La deuda técnica no debe interferir con la victoria si se corrige a tiempo', () => {
        const manager = getCleanManager(3, 5); // Proyecto corto
        manager.bugCount = 4; // Alta deuda
        
        // Act: Corregir 2 veces
        manager.fixBug(); // bugs = 3
        manager.fixBug(); // bugs = 2 (commits = 2)
        
        // Act: Commit final (con bugs < 5)
        manager.makeCommit(); // commits = 3
        
        // Assert
        expect(manager.isFinished).toBe(true);
        expect(manager.bugCount).toBeLessThan(5); 
    });
});
