/**
 * HidroCheck — Síntese de Áudio para Alertas (Web Audio API)
 */
import { AppState } from './state.js';

class AudioManager {
    constructor() {
        this.ctx = null;
        this.unlocked = false;
        this.setupUserGestureUnlock();
    }

    setupUserGestureUnlock() {
        if (typeof window === 'undefined') return;

        const unlock = () => {
            if (!this.unlocked) {
                this.initContext();
                if (this.ctx && this.ctx.state === 'suspended') {
                    this.ctx.resume().then(() => {
                        this.unlocked = true;
                    }).catch(() => {});
                } else if (this.ctx && this.ctx.state === 'running') {
                    this.unlocked = true;
                }
            }
            // Remove ouvintes após desbloquear
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
            window.removeEventListener('touchstart', unlock);
        };

        window.addEventListener('pointerdown', unlock, { passive: true });
        window.addEventListener('keydown', unlock, { passive: true });
        window.addEventListener('touchstart', unlock, { passive: true });
    }

    initContext() {
        if (!this.ctx && typeof window !== 'undefined') {
            const AudioClass = window.AudioContext || window.webkitAudioContext;
            if (AudioClass) {
                this.ctx = new AudioClass();
            }
        }
    }

    playBeep(isCritical = true) {
        const state = AppState.get();
        if (!state.rules.soundEnabled) return;

        try {
            this.initContext();
            if (!this.ctx) return;

            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => {});
            }

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = isCritical ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(isCritical ? 880 : 660, now);
            osc.frequency.setValueAtTime(isCritical ? 1174 : 880, now + 0.14);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.42);
        } catch (err) {
            // Falha silenciosa em ambientes sem áudio
        }
    }
}

export const SoundEngine = new AudioManager();
