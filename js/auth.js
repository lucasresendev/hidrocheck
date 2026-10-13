/**
 * HidroCheck — Autenticação, Demonstração e Transição de Sessão (AppAuth)
 */
import { AppState } from './state.js';
import { NotifyUI } from './notify.js';
import { ChartRenderer } from './chart.js';
import { AlertEngine } from './rules.js';

export const AppAuth = {
    switchTab(tab) {
        if (typeof document === 'undefined') return;
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const loginBtn = document.getElementById('tab-login-btn');
        const registerBtn = document.getElementById('tab-register-btn');

        if (tab === 'login') {
            if (loginForm) loginForm.classList.remove('hidden');
            if (registerForm) registerForm.classList.add('hidden');
            if (loginBtn) loginBtn.className = 'py-2.5 text-sm font-bold rounded-xl transition-all bg-sky-500 text-white shadow-sm';
            if (registerBtn) registerBtn.className = 'py-2.5 text-sm font-semibold rounded-xl transition-all text-slate-400 hover:text-white';
        } else {
            if (loginForm) loginForm.classList.add('hidden');
            if (registerForm) registerForm.classList.remove('hidden');
            if (registerBtn) registerBtn.className = 'py-2.5 text-sm font-bold rounded-xl transition-all bg-sky-500 text-white shadow-sm';
            if (loginBtn) loginBtn.className = 'py-2.5 text-sm font-semibold rounded-xl transition-all text-slate-400 hover:text-white';
        }
    },

    togglePassword(inputId) {
        if (typeof document === 'undefined') return;
        const input = document.getElementById(inputId);
        if (input) input.type = input.type === 'password' ? 'text' : 'password';
    },

    /**
     * Acesso instantâneo em 1 clique para demonstração (ideal para GitHub Pages e avaliadores)
     */
    handleDemoLogin() {
        if (typeof document !== 'undefined') {
            const userInput = document.getElementById('login-user');
            const passInput = document.getElementById('login-pass');
            if (userInput) userInput.value = 'fatec';
            if (passInput) passInput.value = 'fatec';
        }
        NotifyUI.showToast('Entrando no Modo Demonstração...', 'info');
        this.startConnectionTransition();
    },

    handleLogin(e) {
        if (e && e.preventDefault) e.preventDefault();
        if (typeof document === 'undefined') return;

        const userInput = document.getElementById('login-user');
        const passInput = document.getElementById('login-pass');
        const user = userInput ? userInput.value.trim().toLowerCase() : '';
        const pass = passInput ? passInput.value.trim().toLowerCase() : '';

        const state = AppState.get();
        if (user === state.authKeyUser && pass === state.authKeyPass) {
            this.startConnectionTransition();
        } else {
            NotifyUI.showToast('Credenciais inválidas. Use "fatec" / "fatec" ou o botão Demo.', 'error');
        }
    },

    handleRegister(e) {
        if (e && e.preventDefault) e.preventDefault();
        if (typeof document === 'undefined') return;

        const houseInput = document.getElementById('reg-name');
        const userInput = document.getElementById('reg-user');
        const passInput = document.getElementById('reg-pass');

        const house = houseInput ? (houseInput.value.trim() || 'Minha Casa') : 'Minha Casa';
        const user = userInput ? userInput.value.trim().toLowerCase() : '';
        const pass = passInput ? passInput.value.trim().toLowerCase() : '';

        if (!user || !pass) {
            NotifyUI.showToast('Preencha usuário e senha para continuar.', 'error');
            return;
        }

        const state = AppState.get();
        if (user === state.authKeyUser && pass === state.authKeyPass) {
            state.houseName = house;
            AppState.save();

            const headerHouse = document.getElementById('header-house-name');
            if (headerHouse) headerHouse.textContent = house;

            const authScreen = document.getElementById('auth-screen');
            if (authScreen) authScreen.classList.add('hidden');

            const onb = document.getElementById('onboarding-screen');
            if (onb) {
                onb.classList.remove('hidden');
                onb.classList.add('flex');
            }

            if (typeof window !== 'undefined' && window.OnboardingController) {
                window.OnboardingController.resetDeviceAPStep();
                window.OnboardingController.goToStep(1);
            }
            NotifyUI.refreshSliderTracks();
        } else {
            NotifyUI.showToast('Utilize usuário e senha autorizados ("fatec").', 'error');
        }
    },

    startConnectionTransition() {
        if (typeof document === 'undefined') return;

        const authScreen = document.getElementById('auth-screen');
        if (authScreen) authScreen.classList.add('hidden');

        const connScreen = document.getElementById('connection-screen');
        if (connScreen) {
            connScreen.classList.remove('hidden');
            connScreen.classList.add('flex');
        }

        const bar = document.getElementById('conn-progress-bar');
        if (bar) bar.style.width = '45%';

        setTimeout(() => {
            if (bar) bar.style.width = '100%';
        }, 280);

        setTimeout(() => {
            if (connScreen) {
                connScreen.classList.add('hidden');
                connScreen.classList.remove('flex');
            }
            const appScreen = document.getElementById('app-screen');
            if (appScreen) {
                appScreen.classList.remove('hidden');
                appScreen.classList.add('flex');
            }

            const state = AppState.get();
            state.authenticated = true;

            if (typeof window !== 'undefined' && window.UIController) {
                window.UIController.refresh(false);
            }
            AlertEngine.renderHistory();
            NotifyUI.refreshSliderTracks();
            ChartRenderer.draw();
            NotifyUI.showToast('Módulo residencial sincronizado!', 'success');
        }, 600);
    },

    handleLogout() {
        const state = AppState.get();
        state.authenticated = false;
        NotifyUI.clearPushBanner();

        if (typeof document !== 'undefined') {
            const appScreen = document.getElementById('app-screen');
            if (appScreen) {
                appScreen.classList.add('hidden');
                appScreen.classList.remove('flex');
            }
            const authScreen = document.getElementById('auth-screen');
            if (authScreen) authScreen.classList.remove('hidden');

            const passInput = document.getElementById('login-pass');
            if (passInput) passInput.value = '';
        }

        NotifyUI.showToast('Sessão encerrada.', 'info');
    }
};
