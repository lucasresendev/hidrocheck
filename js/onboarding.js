/**
 * HidroCheck — Assistente de Instalação e Pareamento Wi-Fi (OnboardingController)
 */
import { AppState } from './state.js';
import { NotifyUI } from './notify.js';
import { AppAuth } from './auth.js';

export const OnboardingController = {
    connectToDeviceAP() {
        if (typeof document === 'undefined') return;
        const btn = document.getElementById('btn-connect-device-ap');
        const box = document.getElementById('device-handshake-box');
        const msg = document.getElementById('device-handshake-msg');
        const sensorsCheck = document.getElementById('device-sensors-check');

        if (btn) {
            btn.disabled = true;
            btn.classList.add('opacity-60');
        }
        if (box) box.classList.remove('hidden');
        if (sensorsCheck) sensorsCheck.classList.add('hidden');
        if (msg) msg.innerHTML = `<span class="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span> Conectando à rede HidroCheck-AP-8F2A...`;

        setTimeout(() => {
            if (msg) msg.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span> Conectado ao aparelho HidroCheck!`;
            if (sensorsCheck) sensorsCheck.classList.remove('hidden');
        }, 400);

        setTimeout(() => {
            if (btn) {
                btn.disabled = false;
                btn.classList.remove('opacity-60');
            }
            const stepDevice = document.getElementById('onb-substep-device');
            const stepWifi = document.getElementById('onb-substep-wifi');
            if (stepDevice) stepDevice.classList.add('hidden');
            if (stepWifi) stepWifi.classList.remove('hidden');
        }, 950);
    },

    resetDeviceAPStep() {
        if (typeof document === 'undefined') return;
        const stepWifi = document.getElementById('onb-substep-wifi');
        const stepDevice = document.getElementById('onb-substep-device');
        const handshake = document.getElementById('device-handshake-box');
        const wifiPairing = document.getElementById('wifi-pairing-box');

        if (stepWifi) stepWifi.classList.add('hidden');
        if (stepDevice) stepDevice.classList.remove('hidden');
        if (handshake) handshake.classList.add('hidden');
        if (wifiPairing) wifiPairing.classList.add('hidden');
    },

    selectWifiNetwork(ssid) {
        const state = AppState.get();
        state.wifiSsid = ssid;
        AppState.save();

        if (typeof document === 'undefined') return;
        const label = document.getElementById('selected-ssid-label');
        if (label) label.textContent = ssid;

        const net1 = document.getElementById('wifi-net-1');
        const net2 = document.getElementById('wifi-net-2');

        if (ssid === 'Casa_Familia_2.4G') {
            if (net1) net1.className = 'w-full p-3 rounded-2xl bg-slate-950 border-2 border-sky-500 flex items-center justify-between text-left transition-all';
            if (net2) net2.className = 'w-full p-3 rounded-2xl bg-slate-950 border-2 border-transparent hover:border-slate-800 flex items-center justify-between text-left transition-all';
        } else {
            if (net2) net2.className = 'w-full p-3 rounded-2xl bg-slate-950 border-2 border-sky-500 flex items-center justify-between text-left transition-all';
            if (net1) net1.className = 'w-full p-3 rounded-2xl bg-slate-950 border-2 border-transparent hover:border-slate-800 flex items-center justify-between text-left transition-all';
        }
    },

    scanWifiNetworks() {
        NotifyUI.showToast('Redes Wi-Fi 2.4 GHz atualizadas.', 'info');
    },

    runWifiProvisioning() {
        if (typeof document === 'undefined') return;
        const passInput = document.getElementById('onb-wifi-pass');
        const pass = passInput ? passInput.value.trim() : '';

        if (!pass) {
            NotifyUI.showToast('Digite a senha da sua rede Wi-Fi.', 'error');
            return;
        }

        const box = document.getElementById('wifi-pairing-box');
        const msg = document.getElementById('pair-msg-1');
        const badge = document.getElementById('pair-badge-1');
        const sensorsRow = document.getElementById('pair-sensors-row');

        if (box) box.classList.remove('hidden');
        if (sensorsRow) sensorsRow.classList.add('hidden');
        if (badge) badge.textContent = 'DHCP...';
        if (msg) msg.innerHTML = `<span class="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span> Transmitindo credenciais via SoftAP...`;

        setTimeout(() => {
            if (msg) msg.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span> NodeMCU conectado à rede Wi-Fi!`;
            if (badge) badge.textContent = 'IP OK';
            if (sensorsRow) sensorsRow.classList.remove('hidden');
        }, 500);

        setTimeout(() => {
            this.goToStep(3);
        }, 1100);
    },

    goToStep(stepNumber) {
        if (typeof document === 'undefined') return;
        [1, 2, 3].forEach(s => {
            const screen = document.getElementById(`onb-step-${s}`);
            const pill = document.getElementById(`onb-indicator-${s}`);
            if (s === stepNumber) {
                if (screen) screen.classList.remove('hidden');
                if (pill) pill.className = 'flex-1 h-1.5 rounded-full bg-sky-500 transition-all';
            } else if (s < stepNumber) {
                if (screen) screen.classList.add('hidden');
                if (pill) pill.className = 'flex-1 h-1.5 rounded-full bg-emerald-500 transition-all';
            } else {
                if (screen) screen.classList.add('hidden');
                if (pill) pill.className = 'flex-1 h-1.5 rounded-full bg-slate-800 transition-all';
            }
        });
        NotifyUI.refreshSliderTracks();
    },

    syncThresholds() {
        if (typeof document === 'undefined') return;
        const s1 = document.getElementById('onb-c1-slider');
        const s2 = document.getElementById('onb-c2-slider');
        let c1 = parseInt(s1?.value || '15', 10);
        let c2 = parseInt(s2?.value || '95', 10);

        if (c1 >= c2 - 5) c1 = c2 - 6;

        const state = AppState.get();
        state.rules.criticalLowPercent = c1;
        state.rules.criticalHighPercent = c2;
        AppState.save();

        const v1 = document.getElementById('onb-c1-val');
        const v2 = document.getElementById('onb-c2-val');
        if (v1) v1.textContent = `${c1}%`;
        if (v2) v2.textContent = `${c2}%`;

        const cfg1 = document.getElementById('cfg-c1-slider');
        const cfg2 = document.getElementById('cfg-c2-slider');
        if (cfg1) cfg1.value = c1;
        if (cfg2) cfg2.value = c2;

        NotifyUI.refreshSliderTracks();
    },

    finish() {
        this.syncThresholds();
        const state = AppState.get();

        if (typeof document !== 'undefined') {
            const pushCheck = document.getElementById('onb-push-toggle');
            const soundCheck = document.getElementById('onb-sound-toggle');

            if (pushCheck) state.rules.pushEnabled = pushCheck.checked;
            if (soundCheck) state.rules.soundEnabled = soundCheck.checked;

            const cfgPush = document.getElementById('cfg-push-toggle');
            const cfgSound = document.getElementById('cfg-sound-toggle');
            if (cfgPush) cfgPush.checked = state.rules.pushEnabled;
            if (cfgSound) cfgSound.checked = state.rules.soundEnabled;

            const onb = document.getElementById('onboarding-screen');
            if (onb) {
                onb.classList.add('hidden');
                onb.classList.remove('flex');
            }
        }

        AppState.save();
        AppAuth.startConnectionTransition();
    }
};
