// src/js/main.js
// Aplicación del Patrón Módulo IIFE (Immediately Invoked Function Expression)
(function() {
    'use strict';

    // ==========================================================
    // 1. DATOS DEL JUEGO
    // ==========================================================
    
    /**
     * @constant {Array<Object>} LEVELS - Estructura de la progresión del juego.
     */
    const LEVELS = [
        { id: 0, name: "Módulo Inicial (Login)", targetCommits: 10, maxBugs: 5, reward: 5, bugChanceBase: 0.2 },
        { id: 1, name: "Módulo API (Ruta Crítica)", targetCommits: 15, maxBugs: 7, reward: 8, bugChanceBase: 0.35 },
        { id: 2, name: "Módulo Persistencia (DB)", targetCommits: 20, maxBugs: 10, reward: 12, bugChanceBase: 0.5 },
    ];

    /**
     * @constant {Array<Object>} SHOP_ITEMS - Ítems disponibles para compra.
     */
    const SHOP_ITEMS = [
        { id: 'debugger_boost', name: 'Optimizar Debugger', cost: 5, effect: { bugChanceReduction: 0.05 }, purchased: false },
        { id: 'unit_tests', name: 'Unit Tests Básicos', cost: 15, effect: { commitMoneyBonus: 1 }, purchased: false },
        { id: 'ci_pipeline', name: 'CI/CD Pipeline', cost: 30, effect: { levelTargetBoost: 2 }, purchased: false },
    ];

    /**
     * @constant {Array<Object>} ACHIEVEMENTS - Logros a desbloquear.
     */
    const ACHIEVEMENTS = [
        { id: 'first_commit', name: 'Primer Commit', description: 'Realiza tu primer commit.', unlocked: false, condition: (m) => m.commitsDone > 0 },
        { id: 'bug_master', name: 'Maestro del Bug', description: 'Arregla 10 bugs.', unlocked: false, condition: (m) => m.fixesDone >= 10 },
        { id: 'level_one', name: 'Despegue', description: 'Completa el Nivel 1.', unlocked: false, condition: (m) => m.level >= 1 },
    ];


    // ==========================================================
    // 2. CLASE MODELO: CommitManager
    // ==========================================================
    class CommitManager {
        constructor() {
            this.resetGame();
        }

        resetGame() {
            this.level = 0;
            this.commitsDone = 0;
            this.bugCount = 0;
            this.fixesDone = 0;
            this.money = 0;
            this.currentLevelConfig = LEVELS[0];
            this.bugChance = this.currentLevelConfig.bugChanceBase;
            this.shopItems = JSON.parse(JSON.stringify(SHOP_ITEMS)); 
            this.achievements = JSON.parse(JSON.stringify(ACHIEVEMENTS)); 
            this.isGameOver = false;
        }

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
        
        makeCommit() {
            if (this.isGameOver) return "ERROR: No puedes hacer commit. El proyecto está en bancarrota técnica.";

            const commitMoneyBonus = this.applyItemEffects();
            this.commitsDone++;
            this.money += 1 + commitMoneyBonus; 
            let message = `<span class="prompt">git commit -m "Feature ${this.commitsDone}"</span>: <span class="success">Commit exitoso.</span>`;

            if (Math.random() < this.bugChance) {
                this.bugCount++;
                message += ` <span class="bug">¡ADVERTENCIA! Has introducido un nuevo bug (${this.bugCount} total).</span>`;
            }
            
            this.checkGameStatus();
            this.checkAchievements();
            return message;
        }

        fixBug() {
            if (this.bugCount > 0) {
                this.bugCount--;
                this.fixesDone++;
                this.money += 2;
                let message = `<span class="prompt">git bug-fix -m "Fixing Critical Bug"</span>: <span class="success">Bug arreglado. Has ganado 2 <span class="coin">₿</span>.</span>`;
                this.checkAchievements();
                return message;
            } else {
                return `<span class="prompt">git bug-fix:</span> <span class="error">ERROR: No hay bugs pendientes para arreglar.</span>`;
            }
        }

        buyItem(itemId) {
            const item = this.shopItems.find(i => i.id === itemId);

            if (!item) return `<span class="error">ERROR: Ítem no encontrado.</span>`;
            if (item.purchased) return `<span class="error">ERROR: Ya tienes ${item.name}.</span>`;
            if (this.money < item.cost) return `<span class="error">ERROR: Fondos insuficientes. Necesitas ${item.cost} ₿.</span>`;

            this.money -= item.cost;
            item.purchased = true;
            this.applyItemEffects();

            return `<span class="success">COMPRADO: "${item.name}". Efecto aplicado.</span>`;
        }

        nextLevel() {
            const nextLevelIndex = this.level + 1;
            
            if (nextLevelIndex < LEVELS.length) {
                this.level = nextLevelIndex;
                this.currentLevelConfig = LEVELS[nextLevelIndex];
                
                // Aplicar Target Boost
                const targetBoost = this.shopItems.find(i => i.id === 'ci_pipeline' && i.purchased)?.effect.levelTargetBoost || 0;
                this.currentLevelConfig.targetCommits += targetBoost;

                this.commitsDone = 0;
                this.bugCount = 0;
                this.money += this.currentLevelConfig.reward; 
                this.bugChance = this.currentLevelConfig.bugChanceBase;
                this.applyItemEffects();
                
                return `**¡NIVEL SUPERADO!** Has completado: **${LEVELS[nextLevelIndex - 1].name}**. Recompensa: <span class="coin">${this.currentLevelConfig.reward} ₿</span>. ¡Comenzando **${this.currentLevelConfig.name}**!`;
            } else {
                this.isGameOver = true;
                return "**¡FIN DEL JUEGO!** Has completado todos los módulos. Eres un profesional legendario.";
            }
        }
        
        checkGameStatus() {
            if (this.bugCount >= this.currentLevelConfig.maxBugs) {
                this.isGameOver = true;
                return `**GAME OVER**: ¡Deuda Técnica Crítica en ${this.currentLevelConfig.name}! El proyecto falló.`;
            }

            if (this.commitsDone >= this.currentLevelConfig.targetCommits) {
                return this.nextLevel();
            }
            
            return null;
        }

        checkAchievements() {
            this.achievements.forEach(achievement => {
                if (!achievement.unlocked && achievement.condition(this)) {
                    achievement.unlocked = true;
                    // Mostrar notificación de logro
                    setTimeout(() => {
                        typeMessage(`🎉 LOGRO DESBLOQUEADO: "${achievement.name}"!`, 'success');
                    }, 50); 
                }
            });
        }
    }

    // ==========================================================
    // 3. CONTROLADOR UI (DOM, Animación de Tipeo, Eventos)
    // ==========================================================

    const commitManager = new CommitManager();
    let isTyping = false; 

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
    

    /**
     * @method typeMessage
     * @description Simula el tipeo profesional de la consola (UX).
     */
    function typeMessage(text, className = '') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${className}`;
        elements.consoleOutput.appendChild(messageDiv);
        
        const promptSpan = document.createElement('span');
        promptSpan.className = 'prompt';
        promptSpan.textContent = commitManager.isGameOver ? 'FIN > ' : `🏍️ ${commitManager.currentLevelConfig.name} > `;
        messageDiv.appendChild(promptSpan);
        
        const contentSpan = document.createElement('span');
        messageDiv.appendChild(contentSpan);

        let charIndex = 0;
        isTyping = true;
        
        // Función recursiva para mostrar cada carácter
        function typeChar() {
            if (charIndex < text.length) {
                contentSpan.innerHTML += text.charAt(charIndex); 
                charIndex++;
                setTimeout(typeChar, 20); // Velocidad de tipeo: 20ms
            } else {
                isTyping = false;
                updateUI();
            }
        }
        
        typeChar();
        elements.consoleOutput.scrollTop = elements.consoleOutput.scrollHeight;
    }

    /**
     * @method updateUI
     * @description Actualiza todos los elementos visuales del juego, incluyendo la posición de la moto.
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
        elements.resetBtn.disabled = isTyping;

        // 3. Simulación de la Moto (Progreso Visual)
        const progressPercent = (commitManager.commitsDone / commitManager.currentLevelConfig.targetCommits) * 100;
        
        // La posición es un porcentaje del ancho de la pista (CSS se encarga de la transición)
        const motorPosition = Math.min(100, Math.max(0, progressPercent)); 
        elements.motorcycle.style.left = `${motorPosition}%`;
        
        // 4. Renderizado de la Tienda
        renderShopItems();
    }
    
    /**
     * @method renderShopItems
     * @description Dibuja los ítems de la tienda en el DOM.
     */
    function renderShopItems() {
        elements.shopItemsContainer.innerHTML = ''; 
        
        commitManager.shopItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <span>${item.name} (Costo: ${item.cost} <span class="coin">₿</span>)</span>
                <button 
                    data-item-id="${item.id}"
                    ${item.purchased ? 'disabled' : ''}
                    ${commitManager.money < item.cost && !item.purchased ? 'disabled' : ''}
                >
                    ${item.purchased ? 'Comprado' : 'Comprar'}
                </button>
            `;
            elements.shopItemsContainer.appendChild(itemDiv);
        });
    }

    /**
     * @method handleAction
     * @description Maneja los clics de los botones principales.
     */
    function handleAction(action) {
        let result = '';
        
        if (isTyping) return;
        
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
                return;
            case 'TOGGLE_SHOP':
                elements.shopWindow.classList.toggle('hidden');
                updateUI();
                return;
        }
        
        typeMessage(result);
        
        // Manejo de mensajes de fin de juego o cambio de nivel
        const statusMessage = commitManager.checkGameStatus();
        if (statusMessage) {
            typeMessage(statusMessage);
        }
    }
    
    /**
     * @method handleShopClick
     * @description Maneja los clics dentro de la ventana de la tienda.
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
    window.onload = function initializeGame() {
        // Limpiar consola y empezar
        elements.consoleOutput.innerHTML = '';
        
        const welcomeMessage = "Bienvenido a COMMIT DRIFT: TECHNICAL DEBT RACER. Tu misión es desarrollar el proyecto (COMMIT) sin que la Deuda Técnica (BUGS) te detenga. Si los bugs superan el límite del nivel, el proyecto colapsa. Arregla bugs (FIX BUG) para ganar Créditos de Código (₿) y compra mejoras en la Tienda.";

        typeMessage(welcomeMessage, 'welcome-message');
        
        // Actualizar UI para reflejar el estado inicial después de la animación de tipeo
        updateUI();
    };

})(); // Fin del Patrón Módulo IIFE
