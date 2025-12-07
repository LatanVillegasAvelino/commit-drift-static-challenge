// src/js/main.js
// Aplicación del Patrón Módulo IIFE (Immediately Invoked Function Expression)
// Esto encapsula toda la lógica y evita polución del ámbito global.
(function() {
    'use strict';

    /**
     * @constant {Array<Object>} LEVELS - Define la estructura y progresión de los niveles del juego.
     */
    const LEVELS = [
        { id: 0, name: "Módulo Inicial (Login)", targetCommits: 10, maxBugs: 5, reward: 5, bugChanceBase: 0.2 },
        { id: 1, name: "Módulo API (Ruta Crítica)", targetCommits: 15, maxBugs: 7, reward: 8, bugChanceBase: 0.35 },
        { id: 2, name: "Módulo Persistencia (DB)", targetCommits: 20, maxBugs: 10, reward: 12, bugChanceBase: 0.5 },
        // Añadir más niveles para un juego completo
    ];

    /**
     * @constant {Array<Object>} SHOP_ITEMS - Define los ítems que se pueden comprar en la tienda.
     */
    const SHOP_ITEMS = [
        { id: 'debugger_boost', name: 'Optimizar Debugger (Menor Bug Chance)', cost: 5, effect: { bugChanceReduction: 0.05 }, purchased: false },
        { id: 'unit_tests', name: 'Unit Tests Básicos (Mayor Recompensa)', cost: 15, effect: { commitMoneyBonus: 1 }, purchased: false },
        { id: 'ci_pipeline', name: 'CI/CD Pipeline (Más Commits por Nivel)', cost: 30, effect: { levelTargetBoost: 2 }, purchased: false },
    ];

    /**
     * @constant {Array<Object>} ACHIEVEMENTS - Define los logros del juego.
     */
    const ACHIEVEMENTS = [
        { id: 'first_commit', name: 'Primer Commit', description: 'Realiza tu primer commit.', unlocked: false, condition: (m) => m.commitsDone > 0 },
        { id: 'bug_master', name: 'Maestro del Bug', description: 'Arregla 10 bugs.', unlocked: false, condition: (m) => m.fixesDone >= 10 },
        { id: 'level_one', name: 'Despegue', description: 'Completa el Nivel 1.', unlocked: false, condition: (m) => m.level >= 1 },
        { id: 'rich_dev', name: 'Magnate del Código', description: 'Acumula 50 Créditos de Código.', unlocked: false, condition: (m) => m.money >= 50 },
    ];

    /**
     * @class CommitManager
     * @description Gestiona el modelo de datos, la lógica y las reglas de progresión del juego.
     * Es el corazón del juego (MODELO).
     */
    class CommitManager {
        /**
         * @constructor
         */
        constructor() {
            this.resetGame();
        }

        /**
         * @method resetGame
         * @description Inicializa o reinicia el estado del juego.
         */
        resetGame() {
            this.level = 0;
            this.commitsDone = 0;
            this.bugCount = 0;
            this.fixesDone = 0;
            this.money = 0; // Nueva moneda virtual
            this.currentLevelConfig = LEVELS[0];
            this.bugChance = this.currentLevelConfig.bugChanceBase;
            this.shopItems = JSON.parse(JSON.stringify(SHOP_ITEMS)); // Copia profunda
            this.achievements = JSON.parse(JSON.stringify(ACHIEVEMENTS)); // Copia profunda
            this.isGameOver = false;
        }

        /**
         * @method applyItemEffects
         * @description Recalcula las estadísticas del juego basadas en los ítems comprados.
         */
        applyItemEffects() {
            this.bugChance = this.currentLevelConfig.bugChanceBase;
            let commitMoneyBonus = 0;
            
            this.shopItems.forEach(item => {
                if (item.purchased) {
                    if (item.effect.bugChanceReduction) {
                        this.bugChance = Math.max(0.05, this.bugChance - item.effect.bugChanceReduction);
                    }
                    if (item.effect.commitMoneyBonus) {
                        commitMoneyBonus += item.effect.commitMoneyBonus;
                    }
                }
            });
            return commitMoneyBonus;
        }
        
        /**
         * @method makeCommit
         * @description Realiza un commit e intenta generar un bug.
         * @returns {string} Mensaje de resultado.
         */
        makeCommit() {
            if (this.isGameOver) return "ERROR: No puedes hacer commit. El proyecto está en bancarrota técnica.";

            const commitMoneyBonus = this.applyItemEffects();
            this.commitsDone++;
            this.money += 1 + commitMoneyBonus; // Moneda base + bonus de items
            let message = `<span class="prompt">git commit -m "Feature ${this.commitsDone}"</span>: <span class="success">Commit exitoso.</span>`;

            // Probabilidad de Bug (usando la chance ajustada por items)
            if (Math.random() < this.bugChance) {
                this.bugCount++;
                message += ` <span class="bug">¡ADVERTENCIA! Has introducido un nuevo bug (${this.bugCount} total).</span>`;
            }
            
            this.checkGameStatus();
            this.checkAchievements();
            return message;
        }

        /**
         * @method fixBug
         * @description Intenta arreglar un bug, si existe.
         * @returns {string} Mensaje de resultado.
         */
        fixBug() {
            if (this.bugCount > 0) {
                this.bugCount--;
                this.fixesDone++;
                this.money += 2; // Recompensa por arreglar bugs
                let message = `<span class="prompt">git bug-fix -m "Fixing Critical Bug"</span>: <span class="success">Bug arreglado. Has ganado 2 <span class="coin">₿</span>.</span>`;
                this.checkAchievements();
                return message;
            } else {
                return `<span class="prompt">git bug-fix:</span> <span class="error">ERROR: No hay bugs pendientes para arreglar.</span>`;
            }
        }

        /**
         * @method buyItem
         * @description Compra un item de la tienda si el usuario tiene suficiente dinero.
         * @param {string} itemId - El ID del item a comprar.
         * @returns {string} Mensaje de resultado.
         */
        buyItem(itemId) {
            const item = this.shopItems.find(i => i.id === itemId);

            if (!item) return `<span class="error">ERROR: Ítem no encontrado.</span>`;
            if (item.purchased) return `<span class="error">ERROR: Ya tienes ${item.name}.</span>`;
            if (this.money < item.cost) return `<span class="error">ERROR: Fondos insuficientes. Necesitas ${item.cost} ₿.</span>`;

            // Lógica de compra
            this.money -= item.cost;
            item.purchased = true;
            
            // Reaplicar efectos inmediatamente
            this.applyItemEffects();

            return `<span class="success">COMPRADO: "${item.name}". Efecto aplicado.</span>`;
        }

        /**
         * @method nextLevel
         * @description Procede al siguiente nivel.
         * @returns {string} Mensaje de resultado.
         */
        nextLevel() {
            const nextLevelIndex = this.level + 1;
            
            if (nextLevelIndex < LEVELS.length) {
                this.level = nextLevelIndex;
                this.currentLevelConfig = LEVELS[nextLevelIndex];
                
                // Aplicar mejoras permanentes (Ej: por item de CI/CD)
                const targetBoost = this.shopItems.find(i => i.id === 'ci_pipeline' && i.purchased)?.effect.levelTargetBoost || 0;
                this.currentLevelConfig.targetCommits += targetBoost;

                this.commitsDone = 0;
                this.bugCount = 0; // El nuevo módulo empieza limpio
                this.money += this.currentLevelConfig.reward; // Recompensa por nivel completado
                this.bugChance = this.currentLevelConfig.bugChanceBase;
                this.applyItemEffects(); // Recalcula la chance de bug para el nuevo nivel
                
                return `**¡NIVEL SUPERADO!** Has completado: **${LEVELS[nextLevelIndex - 1].name}**. Recompensa: <span class="coin">${this.currentLevelConfig.reward} ₿</span>. ¡Comenzando **${this.currentLevelConfig.name}**!`;
            } else {
                this.isGameOver = true;
                return "**¡FIN DEL JUEGO!** Has completado todos los módulos. Eres un profesional legendario.";
            }
        }
        
        /**
         * @method checkGameStatus
         * @description Verifica las condiciones de victoria o derrota.
         * @returns {string|null} Mensaje de resultado o null.
         */
        checkGameStatus() {
            // Condición de Derrota: Deuda Técnica Máxima
            if (this.bugCount >= this.currentLevelConfig.maxBugs) {
                this.isGameOver = true;
                return `**GAME OVER**: ¡Deuda Técnica Crítica en ${this.currentLevelConfig.name}! El proyecto falló.`;
            }

            // Condición de Victoria de Nivel
            if (this.commitsDone >= this.currentLevelConfig.targetCommits) {
                return this.nextLevel();
            }
            
            return null;
        }

        /**
         * @method checkAchievements
         * @description Verifica si se ha desbloqueado algún logro.
         */
        checkAchievements() {
            this.achievements.forEach(achievement => {
                if (!achievement.unlocked && achievement.condition(this)) {
                    achievement.unlocked = true;
                    // Mostrar notificación de logro
                    this.notifyAchievement(achievement);
                }
            });
        }
        
        /**
         * @method notifyAchievement
         * @description Lógica de notificación de logro (se maneja en el controlador).
         * @param {Object} achievement - El objeto del logro desbloqueado.
         */
        notifyAchievement(achievement) {
            // Este método se usa como hook para el controlador UI
            console.log(`LOGRO DESBLOQUEADO: ${achievement.name} - ${achievement.description}`);
        }
    }

    // --- LÓGICA DEL CONTROLADOR (Manejo de UI) ---

    const commitManager = new CommitManager();

    // Elementos del DOM
    const elements = {
        consoleOutput: document.getElementById('console-output'),
        commitsDisplay: document.getElementById('commits-display'),
        targetCommitsDisplay: document.getElementById('target-commits-display'),
        currentLevelName: document.getElementById('current-level-name'),
        moneyDisplay: document.getElementById('money-display'),
        commitBtn: document.getElementById('commit-btn'),
        fixBtn: document.getElementById('fix-btn'),
        shopBtn: document.getElementById('shop-btn'),
        resetBtn: document.getElementById('reset-btn'),
        motorcycle: document.getElementById('motorcycle'),
        shopWindow: document.getElementById('shop-window'),
        shopItemsContainer: document.getElementById('shop-items-container'),
        actionButtons: document.getElementById('action-buttons'),
    };
    
    let isTyping = false; // Bandera para controlar la animación de tipeo

    /**
     * @method typeMessage
     * @description Simula el tipeo profesional de la consola (UX).
     * @param {string} text - El texto a mostrar.
     * @param {string} className - Clase CSS a aplicar al mensaje.
     */
    function typeMessage(text, className = '') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${className}`;
        elements.consoleOutput.appendChild(messageDiv);
        
        const promptSpan = document.createElement('span');
        promptSpan.className = 'prompt';
        promptSpan.textContent = commitManager.isGameOver ? 'FIN > ' : (commitManager.level >= 0 ? `🏍️ ${commitManager.currentLevelConfig.name} > ` : '... > ');
        messageDiv.appendChild(promptSpan);
        
        const contentSpan = document.createElement('span');
        messageDiv.appendChild(contentSpan);

        let charIndex = 0;
        isTyping = true;
        
        // Función recursiva para mostrar cada carácter
        function typeChar() {
            if (charIndex < text.length) {
                // Usamos innerHTML para permitir que el texto contenga etiquetas (ej: <span class="bug">)
                contentSpan.innerHTML += text.charAt(charIndex); 
                charIndex++;
                setTimeout(typeChar, 20); // Velocidad de tipeo
            } else {
                // Limpiar el cursor después de terminar de escribir
                isTyping = false;
                updateUI();
                elements.consoleOutput.scrollTop = elements.consoleOutput.scrollHeight;
            }
        }
        
        typeChar();
        elements.consoleOutput.scrollTop = elements.consoleOutput.scrollHeight;
    }

    /**
     * @method updateUI
     * @description Actualiza todos los elementos visuales del juego.
     */
    function updateUI() {
        // 1. Actualizar el Tablero de Estado
        elements.commitsDisplay.textContent = commitManager.commitsDone;
        elements.targetCommitsDisplay.textContent = commitManager.currentLevelConfig.targetCommits;
        elements.currentLevelName.textContent = commitManager.currentLevelConfig.name;
        elements.moneyDisplay.textContent = commitManager.money;

        // 2. Control de Botones
        const canFix = commitManager.bugCount > 0;
        const gameActive = !commitManager.isGameOver && !isTyping;
        elements.commitBtn.disabled = !gameActive;
        elements.fixBtn.disabled = !gameActive || !canFix;
        elements.shopBtn.disabled = !gameActive;

        // 3. Simulación de la Moto (Progreso Visual)
        const progressPercent = (commitManager.commitsDone / commitManager.currentLevelConfig.targetCommits) * 100;
        // Limitamos el porcentaje para que no exceda el carril
        const maxTrackWidth = elements.consoleOutput.offsetWidth; // Usamos el ancho de la consola como referencia
        
        // Ajuste para que la moto se mueva dentro de los límites
        const trackWidth = elements.actionButtons.offsetWidth;
        const motorWidth = elements.motorcycle.offsetWidth;
        const position = Math.min(100, Math.max(0, progressPercent)); 
        
        // Calcula la posición en pixeles
        const trackEnd = trackWidth - motorWidth;
        const motorPosition = (position / 100) * trackEnd;
        
        elements.motorcycle.style.left = `${motorPosition}px`;
        
        // 4. Tienda
        renderShopItems();
    }
    
    /**
     * @method renderShopItems
     * @description Dibuja los ítems de la tienda en el DOM.
     */
    function renderShopItems() {
        elements.shopItemsContainer.innerHTML = ''; // Limpiar
        
        commitManager.shopItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <span>${item.name}</span>
                <button 
                    data-item-id="${item.id}"
                    ${item.purchased ? 'disabled' : ''}
                    ${commitManager.money < item.cost ? 'disabled' : ''}
                >
                    ${item.purchased ? 'Comprado' : `Comprar (${item.cost} ₿)`}
                </button>
            `;
            elements.shopItemsContainer.appendChild(itemDiv);
        });
    }

    /**
     * @method handleAction
     * @description Maneja los clics de los botones principales.
     * @param {string} action - La acción a realizar.
     */
    function handleAction(action) {
        let result = '';
        
        if (isTyping) return; // No permitir acciones mientras se escribe
        
        switch (action) {
            case 'COMMIT':
                result = commitManager.makeCommit();
                break;
            case 'FIX_BUG':
                result = commitManager.fixBug();
                break;
            case 'RESET':
                commitManager.resetGame();
                typeMessage("Reiniciando el sistema... ¡El código está limpio (por ahora)!");
                return; // Evita doble actualización
            case 'TOGGLE_SHOP':
                elements.shopWindow.classList.toggle('hidden');
                updateUI();
                return; // Evita doble actualización
        }
        
        // Manejo de mensajes de fin de juego o cambio de nivel
        const statusMessage = commitManager.checkGameStatus();
        if (statusMessage) {
            typeMessage(statusMessage);
        }
        
        typeMessage(result);
        
        if (commitManager.isGameOver) {
            elements.commitBtn.disabled = true;
            elements.fixBtn.disabled = true;
            elements.shopBtn.disabled = true;
            typeMessage(commitManager.checkGameStatus());
        }
    }
    
    /**
     * @method handleShopClick
     * @description Maneja los clics dentro de la ventana de la tienda.
     * @param {Event} event - El evento de clic.
     */
    function handleShopClick(event) {
        const itemId = event.target.dataset.itemId;
        if (itemId) {
            const result = commitManager.buyItem(itemId);
            typeMessage(result);
            renderShopItems();
            updateUI();
        }
    }

    // Asignación de Event Listeners
    elements.actionButtons.addEventListener('click', (e) => {
        if (e.target.dataset.action) {
            handleAction(e.target.dataset.action);
        }
    });

    elements.shopWindow.addEventListener('click', (e) => {
        if (e.target.dataset.action === 'TOGGLE_SHOP') {
            elements.shopWindow.classList.add('hidden');
            updateUI();
        } else {
            handleShopClick(e);
        }
    });


    // Inicialización del Juego: Simulación de BOOT UP
    function initializeGame() {
        // Mensaje de Bienvenida y Explicación del Juego (Intro)
        typeMessage("Bienvenido a COMMIT DRIFT: TECHNICAL DEBT RACER. Tu misión es desarrollar el proyecto (COMMIT) sin que la Deuda Técnica (BUGS) te detenga. Si los bugs superan el límite del nivel, el proyecto colapsa. Arregla bugs (FIX BUG) para ganar Créditos de Código (₿) y compra mejoras en la Tienda.", 'welcome-message');
        
        // Bloquear botones al inicio y esperar la animación de tipeo
        elements.commitBtn.disabled = true;
        elements.fixBtn.disabled = true;
        elements.shopBtn.disabled = true;
        
        setTimeout(() => {
            updateUI();
        }, 100); // Pequeño delay para que la primera animación de tipeo comience
    }

    // Iniciar el juego
    initializeGame();

})(); // Fin del Patrón Módulo IIFE
