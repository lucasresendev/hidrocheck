/**
 * HidroCheck — Bootstrap Principal da Aplicação
 */
import { AppState } from './state.js';
import { NotifyUI } from './notify.js';
import { SoundEngine } from './audio.js';
import { AlertEngine } from './rules.js';
import { ChartRenderer } from './chart.js';
import { AppAuth } from './auth.js';
import { OnboardingController } from './onboarding.js';
import { SimulatorController } from './simulator.js';
import { UIController } from './ui.js';

// Expõe controladores no escopo global para compatibilidade com event handlers HTML
if (typeof window !== 'undefined') {
    window.AppState = AppState;
    window.NotifyUI = NotifyUI;
    window.SoundEngine = SoundEngine;
    window.AlertEngine = AlertEngine;
    window.ChartRenderer = ChartRenderer;
    window.AppAuth = AppAuth;
    window.OnboardingController = OnboardingController;
    window.SimulatorController = SimulatorController;
    window.UIController = UIController;
}

export function startPhysicsLoop() {
    setInterval(() => {
        SimulatorController.stepPhysicsTick();
    }, 1000);
}

export function runInternalSelfTests() {
    try {
        if (typeof window !== 'undefined' && window.lucide) {
            window.lucide.createIcons();
        }
    } catch (_) {}

    // Pausa a física enquanto o usuário segura os controles deslizantes
    if (typeof document !== 'undefined') {
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            slider.addEventListener('pointerdown', () => { AppState.get().isDraggingSlider = true; });
            slider.addEventListener('pointerup', () => { AppState.get().isDraggingSlider = false; });
            slider.addEventListener('touchstart', () => { AppState.get().isDraggingSlider = true; }, { passive: true });
            slider.addEventListener('touchend', () => { AppState.get().isDraggingSlider = false; }, { passive: true });
        });

        const requiredIds = [
            'auth-screen', 'onboarding-screen', 'app-screen',
            'page-dashboard', 'page-alerts', 'page-simulator', 'page-architecture',
            'telemetry-chart', 'mqtt-terminal', 'alert-detail-modal', 'push-notification-container'
        ];
        const missing = requiredIds.filter(id => !document.getElementById(id));
        if (missing.length === 0) {
            NotifyUI.refreshSliderTracks();
            UIController.refresh(false, false);
            AlertEngine.renderHistory();
            SimulatorController.syncSpeedUI();
        } else {
            console.warn('[HidroCheck] Elementos estruturais ausentes:', missing);
        }
    }
}

if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
        const state = AppState.get();
        if (state.authenticated && state.activePage === 'dashboard') {
            ChartRenderer.draw();
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            runInternalSelfTests();
            startPhysicsLoop();
        });
    } else {
        runInternalSelfTests();
        startPhysicsLoop();
    }
}
