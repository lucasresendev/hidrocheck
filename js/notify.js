/**
 * HidroCheck — Gerenciador de Notificações Híbridas (Web Push Nativo + Banner In-App + Toast)
 */
import { AppState } from './state.js';
import { SoundEngine } from './audio.js';

export const NotifyUI = {
    toastTimeout: null,
    pushTimeout: null,

    formatNumberBR(num, decimals = 1) {
        return Number(num).toFixed(decimals).replace('.', ',');
    },

    formatClock(h, m) {
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    },

    /**
     * Solicita permissão da API nativa de Notificações do Navegador (Web Notification API)
     * @returns {Promise<NotificationPermission>}
     */
    async requestBrowserPermission() {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            this.showToast('Navegador não suporta Notificações nativas. Usando banners.', 'info');
            return 'denied';
        }

        if (Notification.permission === 'granted') {
            return 'granted';
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                this.showToast('Notificações no celular ativadas!', 'success');
            } else if (permission === 'denied') {
                this.showToast('Permissão bloqueada no navegador. Usando banners.', 'info');
            }
            return permission;
        } catch (err) {
            console.warn('[NotifyUI] Falha ao solicitar permissão de notificação:', err);
            return Notification.permission || 'default';
        }
    },

    /**
     * Dispara notificação nativa do sistema operacional / celular (se permitido)
     */
    sendNativeNotification(title, body) {
        try {
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                new Notification(title, {
                    body,
                    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230284c7"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
                    badge: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230284c7"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
                    tag: 'hidrocheck-alert',
                    renotify: true
                });
            }
        } catch (_) {
            // Em navegadores móveis sem suporte a 'new Notification' fora de service worker
        }
    },

    refreshSliderTracks() {
        if (typeof document === 'undefined') return;
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            const min = parseFloat(slider.min) || 0;
            const max = parseFloat(slider.max) || 100;
            const val = parseFloat(slider.value) || 0;
            const pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
            slider.style.background = `linear-gradient(to right, #38bdf8 0%, #38bdf8 ${pct}%, #334155 ${pct}%, #334155 100%)`;
        });
    },

    /**
     * Exibe um Toast temporário no rodapé
     */
    showToast(message, type = 'info') {
        if (typeof document === 'undefined') return;
        const container = document.getElementById('toast-container');
        if (!container) return;

        container.innerHTML = '';
        if (this.toastTimeout) clearTimeout(this.toastTimeout);

        const styles = {
            success: 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200',
            error: 'bg-rose-950/95 border-rose-500/50 text-rose-200',
            info: 'bg-slate-900/95 border-sky-500/50 text-sky-100'
        };

        const pill = document.createElement('div');
        pill.className = `pointer-events-none flex items-center gap-2 px-4 py-2.5 rounded-full border shadow-2xl text-xs font-bold transition-all duration-200 ${styles[type] || styles.info}`;
        pill.innerHTML = `<span>${message}</span>`;
        container.appendChild(pill);

        this.toastTimeout = setTimeout(() => {
            pill.style.opacity = '0';
            setTimeout(() => pill.remove(), 200);
        }, 2400);
    },

    clearPushBanner() {
        if (typeof document === 'undefined') return;
        const container = document.getElementById('push-notification-container');
        if (container) container.innerHTML = '';
        if (this.pushTimeout) clearTimeout(this.pushTimeout);
    },

    /**
     * Exibe o banner de push no topo com suporte a tema, som, vibração e clique de diagnóstico
     */
    showSmartphonePush(title, body, severity = 'critical') {
        const state = AppState.get();
        if (!state.rules.pushEnabled) return;

        // Dispara notificação nativa simultaneamente caso tenha permissão
        this.sendNativeNotification(title, body);

        if (typeof document === 'undefined') return;
        const container = document.getElementById('push-notification-container');
        if (!container) return;

        container.innerHTML = '';
        if (this.pushTimeout) clearTimeout(this.pushTimeout);

        const theme = {
            critical: {
                border: 'border-rose-500 bg-slate-900/95 shadow-rose-950/50',
                iconBg: 'bg-rose-500 text-white',
                tag: 'text-rose-400',
                bar: 'bg-rose-500'
            },
            warning: {
                border: 'border-amber-500 bg-slate-900/95 shadow-amber-950/50',
                iconBg: 'bg-amber-500 text-slate-950',
                tag: 'text-amber-400',
                bar: 'bg-amber-400'
            },
            mnf: {
                border: 'border-sky-400 bg-slate-900/95 shadow-sky-950/50',
                iconBg: 'bg-sky-500 text-white',
                tag: 'text-sky-400',
                bar: 'bg-sky-400'
            },
            normal: {
                border: 'border-emerald-500 bg-slate-900/95 shadow-emerald-950/50',
                iconBg: 'bg-emerald-500 text-white',
                tag: 'text-emerald-400',
                bar: 'bg-emerald-500'
            }
        }[severity] || {
            border: 'border-rose-500 bg-slate-900/95',
            iconBg: 'bg-rose-500 text-white',
            tag: 'text-rose-400',
            bar: 'bg-rose-500'
        };

        const card = document.createElement('div');
        card.className = `pointer-events-auto w-full max-w-md push-banner-enter rounded-3xl p-4 border-2 shadow-2xl backdrop-blur-xl relative overflow-hidden ${theme.border}`;
        card.innerHTML = `
            <div class="flex items-start justify-between gap-3">
                <div id="push-banner-action-area" class="flex items-start gap-3 min-w-0 flex-1 cursor-pointer">
                    <div class="w-10 h-10 rounded-2xl ${theme.iconBg} flex items-center justify-center shrink-0 shadow-md">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                            <line x1="12" x2="12" y1="9" y2="13"/>
                            <line x1="12" x2="12.01" y1="17" y2="17"/>
                        </svg>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-extrabold uppercase tracking-wider ${theme.tag}">HidroCheck • Alerta em Tempo Real</span>
                            <span class="text-[10px] font-mono text-slate-400">agora</span>
                        </div>
                        <h4 class="text-sm font-extrabold text-white mt-0.5 leading-snug">${title}</h4>
                        <p class="text-xs text-slate-200 mt-0.5 leading-snug">${body}</p>
                        <div class="mt-2.5 flex items-center gap-2">
                            <span class="px-2.5 py-1 rounded-lg bg-white text-slate-950 text-[11px] font-extrabold shadow-sm">Ver diagnóstico</span>
                        </div>
                    </div>
                </div>
                <button type="button" id="push-banner-close-btn" class="text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800/70 text-xs font-bold shrink-0">✕</button>
            </div>
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                <div class="h-full ${theme.bar} push-progress-bar"></div>
            </div>
        `;
        container.appendChild(card);

        // Vincula eventos com segurança
        const actionArea = card.querySelector('#push-banner-action-area');
        if (actionArea) {
            actionArea.onclick = () => {
                if (window.AlertEngine) window.AlertEngine.openDiagnosticModal();
                this.clearPushBanner();
            };
        }

        const closeBtn = card.querySelector('#push-banner-close-btn');
        if (closeBtn) {
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                this.clearPushBanner();
            };
        }

        // Alarme sonoro
        SoundEngine.playBeep(severity === 'critical');

        // Vibração tátil
        try {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([180, 80, 180]);
            }
        } catch (_) {}

        // Limpeza automática após 6 segundos
        this.pushTimeout = setTimeout(() => {
            if (card.parentElement) card.remove();
        }, 6000);
    }
};
