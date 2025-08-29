// Aplicación de Respiración Consciente
class BreathingApp {
    constructor() {
        this.techniques = [
            {
                nombre: "Despertar Vagal",
                descripcion: "Técnica sagrada para activar el sistema nervioso parasimpático",
                patron: [4, 7, 8, 0],
                instrucciones: ["Inhala luz dorada", "Retén sintiendo activación", "Exhala liberando resistencia", ""],
                ciclos: 4,
                duracion: "3-4 minutos"
            },
            {
                nombre: "Cuatro Direcciones",
                descripcion: "Ritual ancestral conectando con los cuatro puntos cardinales",
                patron: [4, 4, 4, 4],
                instrucciones: ["Este: Inhala nuevas posibilidades", "Sur: Retén el fuego transformador", "Oeste: Exhala lo que no sirve", "Norte: Pausa con brújula interior"],
                ciclos: 8,
                duracion: "5-6 minutos"
            },
            {
                nombre: "Matriz Respiratoria",
                descripcion: "Conocimiento egipcio para reprogramar el campo electromagnético",
                patron: [6, 2, 7, 2],
                instrucciones: ["Inhala luz azul", "Retén expansión energética", "Exhala luz dorada", "Pausa en vacío creativo"],
                ciclos: 6,
                duracion: "4-5 minutos"
            }
        ];

        this.currentTechnique = null;
        this.currentPhase = 0; // 0: inhale, 1: hold, 2: exhale, 3: pause
        this.currentCycle = 0;
        this.isPlaying = false;
        this.sessionTimer = 0;
        this.phaseTimer = 0;
        this.intervalId = null;
        this.sessionStartTime = null;
        this.completedCycles = 0;

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        console.log('🧘‍♀️ Inicializando aplicación de Respiración Consciente...');
        this.setupEventListeners();
        console.log('✅ Aplicación inicializada correctamente');
        console.log('🎵 Reproduciendo música ambiente relajante...');
    }

    setupEventListeners() {
        // Welcome screen - Start experience button
        const startBtn = document.getElementById('start-experience-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                console.log('🔄 Navegando a selección de técnicas...');
                this.showTechniques();
            });
        }

        // Techniques screen - Back to welcome button
        const backToWelcomeBtn = document.getElementById('back-to-welcome-btn');
        if (backToWelcomeBtn) {
            backToWelcomeBtn.addEventListener('click', () => {
                console.log('🔄 Volviendo a pantalla de bienvenida...');
                this.showWelcome();
            });
        }

        // Technique selection cards
        const techniqueCards = document.querySelectorAll('.technique-card');
        techniqueCards.forEach((card) => {
            card.addEventListener('click', () => {
                const techniqueIndex = parseInt(card.getAttribute('data-technique'));
                console.log(`🎯 Técnica seleccionada: ${this.techniques[techniqueIndex].nombre}`);
                this.selectTechnique(techniqueIndex);
            });
        });

        // Breathing screen - Play/pause button
        const playPauseBtn = document.getElementById('play-pause-btn');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.toggleSession();
            });
        }

        // Breathing screen - Change technique button
        const changeTechniqueBtn = document.getElementById('change-technique-btn');
        if (changeTechniqueBtn) {
            changeTechniqueBtn.addEventListener('click', () => {
                console.log('🔄 Cambiando técnica...');
                this.showTechniques();
            });
        }

        // Completion screen - New session button
        const newSessionBtn = document.getElementById('new-session-btn');
        if (newSessionBtn) {
            newSessionBtn.addEventListener('click', () => {
                console.log('🔄 Iniciando nueva sesión...');
                this.showTechniques();
            });
        }

        // Form submission
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }

        // Modal close button
        const closeModalBtn = document.getElementById('close-modal-btn');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        console.log('🎮 Event listeners configurados correctamente');
    }

    // Navegación entre pantallas
    showScreen(screenId) {
        console.log(`📱 Mostrando pantalla: ${screenId}`);
        
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        } else {
            console.error(`❌ No se encontró la pantalla: ${screenId}`);
        }
    }

    showWelcome() {
        this.showScreen('welcome-screen');
        this.resetSession();
    }

    showTechniques() {
        this.showScreen('techniques-screen');
        this.resetSession();
    }

    showBreathing() {
        this.showScreen('breathing-screen');
        this.initializeBreathingSession();
    }

    showCompletion() {
        this.showScreen('completion-screen');
        this.displaySessionStats();
    }

    // Selección de técnica
    selectTechnique(index) {
        if (index >= 0 && index < this.techniques.length) {
            this.currentTechnique = this.techniques[index];
            console.log(`✅ Técnica seleccionada: ${this.currentTechnique.nombre}`);
            this.showBreathing();
        } else {
            console.error(`❌ Índice de técnica inválido: ${index}`);
        }
    }

    // Inicialización de sesión de respiración
    initializeBreathingSession() {
        if (!this.currentTechnique) {
            console.error('❌ No hay técnica seleccionada');
            return;
        }

        console.log(`🎯 Inicializando sesión: ${this.currentTechnique.nombre}`);

        // Actualizar elementos de UI
        this.updateElement('technique-name', this.currentTechnique.nombre);
        this.updateElement('total-cycles', this.currentTechnique.ciclos);
        this.updateElement('current-cycle', '0');
        this.updateElement('current-phase', 'Preparación');
        this.updateElement('timer-display', '00:00');
        this.updateElement('play-pause-btn', 'Comenzar');
        this.updateElement('instruction-text', 'Prepárate para comenzar...');
        
        this.resetSessionCounters();
        this.updateProgressBar(0);
        this.resetBreathingCircle();

        console.log('✅ Sesión de respiración inicializada');
    }

    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    // Control de sesión
    toggleSession() {
        if (this.isPlaying) {
            this.pauseSession();
        } else {
            this.startSession();
        }
    }

    startSession() {
        console.log('▶️ Iniciando sesión de respiración');
        this.isPlaying = true;
        
        if (!this.sessionStartTime) {
            this.sessionStartTime = Date.now();
        }
        
        this.updateElement('play-pause-btn', 'Pausar');
        this.runBreathingCycle();
    }

    pauseSession() {
        console.log('⏸️ Pausando sesión');
        this.isPlaying = false;
        this.updateElement('play-pause-btn', 'Continuar');
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    resetSession() {
        this.isPlaying = false;
        this.currentPhase = 0;
        this.currentCycle = 0;
        this.resetSessionCounters();
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    resetSessionCounters() {
        this.sessionTimer = 0;
        this.phaseTimer = 0;
        this.sessionStartTime = null;
        this.completedCycles = 0;
    }

    // Ciclo de respiración principal
    runBreathingCycle() {
        if (!this.isPlaying || !this.currentTechnique) return;

        if (this.currentCycle >= this.currentTechnique.ciclos) {
            console.log('🎉 Sesión completada');
            this.completeSession();
            return;
        }

        this.runPhase();
    }

    runPhase() {
        if (!this.isPlaying) return;

        const pattern = this.currentTechnique.patron;
        const instructions = this.currentTechnique.instrucciones;
        const duration = pattern[this.currentPhase];

        console.log(`🔄 Fase ${this.currentPhase + 1}: ${instructions[this.currentPhase]} (${duration}s)`);

        // Skip si la duración es 0 (como en la técnica Despertar Vagal)
        if (duration === 0) {
            this.nextPhase();
            return;
        }

        // Actualizar UI
        this.updateInstruction(instructions[this.currentPhase]);
        this.updatePhaseDisplay();
        this.updateBreathingCircle();
        this.playAudioCue();

        // Contador de fase
        let remainingTime = duration;
        this.phaseTimer = remainingTime;

        this.intervalId = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(this.intervalId);
                return;
            }

            remainingTime--;
            this.phaseTimer = remainingTime;
            this.updateTimerDisplay();

            if (remainingTime <= 0) {
                clearInterval(this.intervalId);
                this.nextPhase();
            }
        }, 1000);
    }

    nextPhase() {
        this.currentPhase++;
        
        // Si completamos todas las fases del ciclo
        if (this.currentPhase >= this.currentTechnique.patron.length) {
            this.currentPhase = 0;
            this.currentCycle++;
            this.completedCycles++;
            
            console.log(`✅ Ciclo ${this.currentCycle} completado`);
            this.updateElement('current-cycle', this.currentCycle);
            this.updateProgressBar((this.currentCycle / this.currentTechnique.ciclos) * 100);
        }

        this.runBreathingCycle();
    }

    // Actualización de UI
    updateInstruction(instruction) {
        this.updateElement('instruction-text', instruction);
    }

    updatePhaseDisplay() {
        const phases = ['Inhalar', 'Retener', 'Exhalar', 'Pausa'];
        const currentPhaseName = phases[this.currentPhase] || 'Preparación';
        this.updateElement('current-phase', currentPhaseName);
    }

    updateBreathingCircle() {
        const circle = document.getElementById('breathing-circle');
        if (!circle) return;

        const phases = ['inhale', 'hold', 'exhale', 'pause'];
        
        // Remove all phase classes
        circle.classList.remove('inhale', 'hold', 'exhale', 'pause');
        
        // Add current phase class
        if (phases[this.currentPhase]) {
            circle.classList.add(phases[this.currentPhase]);
        }
    }

    resetBreathingCircle() {
        const circle = document.getElementById('breathing-circle');
        if (circle) {
            circle.classList.remove('inhale', 'hold', 'exhale', 'pause');
        }
    }

    updateTimerDisplay() {
        if (!this.sessionStartTime) return;
        
        this.sessionTimer = Math.floor((Date.now() - this.sessionStartTime) / 1000);
        const minutes = Math.floor(this.sessionTimer / 60);
        const seconds = this.sessionTimer % 60;
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.updateElement('timer-display', formattedTime);
    }

    updateProgressBar(percentage) {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
    }

    // Simulación de audio
    playAudioCue() {
        const phases = ['inhale', 'hold', 'exhale', 'pause'];
        const currentPhase = phases[this.currentPhase];
        
        // Añadir clase para efectos visuales
        const circle = document.getElementById('breathing-circle');
        if (circle) {
            circle.classList.add('pulse');
            setTimeout(() => {
                circle.classList.remove('pulse');
            }, 500);
        }

        console.log(`🎵 Audio cue: ${currentPhase} - ${this.currentTechnique.instrucciones[this.currentPhase]}`);
    }

    // Finalización de sesión
    completeSession() {
        this.isPlaying = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        
        console.log('🎊 Transicionando a pantalla de finalización...');
        
        // Pequeño delay para transición suave
        setTimeout(() => {
            this.showCompletion();
        }, 1000);
    }

    displaySessionStats() {
        this.updateElement('completed-cycles', this.completedCycles);
        
        if (this.sessionStartTime) {
            const totalSeconds = Math.floor((Date.now() - this.sessionStartTime) / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            this.updateElement('session-duration', formattedDuration);
        }
    }

    // Manejo del formulario
    handleFormSubmission() {
        const nameEl = document.getElementById('user-name');
        const emailEl = document.getElementById('user-email');
        const consentEl = document.getElementById('consent-checkbox');

        if (!nameEl || !emailEl || !consentEl) {
            alert('Error: No se pudieron encontrar los campos del formulario.');
            return;
        }

        const name = nameEl.value.trim();
        const email = emailEl.value.trim();
        const consent = consentEl.checked;

        if (!name || !email || !consent) {
            alert('Por favor completa todos los campos y acepta los términos.');
            return;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor ingresa un correo electrónico válido.');
            return;
        }

        console.log(`📧 Procesando formulario para: ${name} (${email})`);
        this.simulateDownload(name, email);
    }

    simulateDownload(name, email) {
        // Mostrar modal de descarga
        this.showModal();
        
        // Simular descarga de PDF
        setTimeout(() => {
            console.log(`📧 Enviando guía PDF a: ${email} (${name})`);
            console.log('📄 PDF Content:');
            console.log('- Guía Completa: Respiración Consciente y Sabiduría Ancestral');
            console.log('- Fundamentos científicos de la respiración consciente');
            console.log('- Las tres técnicas sagradas paso a paso');
            console.log('- Protocolo de transformación de 21 días');
            console.log('- Creación de tu espacio sagrado de práctica');
            console.log('- Signos de transformación y progreso');
            console.log('- Conexión entre neurociencia y tradiciones ancestrales');
        }, 1000);
    }

    showModal() {
        const modal = document.getElementById('download-modal');
        if (modal) {
            modal.classList.remove('hidden');
            console.log('📱 Modal de descarga mostrado');
        }
    }

    closeModal() {
        const modal = document.getElementById('download-modal');
        if (modal) {
            modal.classList.add('hidden');
            console.log('📱 Modal de descarga cerrado');
        }
    }
}

// Inicialización global de la aplicación
let app;

function initializeApp() {
    console.log('🚀 Iniciando aplicación...');
    app = new BreathingApp();
    
    // Efecto de entrada suave
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

// Asegurar inicialización correcta
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}