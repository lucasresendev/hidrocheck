/**
 * HidroCheck — Motor de Simulação Hidráulica, Cenários e Sliders (SimulatorController)
 */
import { AppState } from './state.js';
import { NotifyUI } from './notify.js';
import { ChartRenderer } from './chart.js';

export const SimulatorController = {
    applyPreset(presetKey) {
        return this.setPreset(presetKey);
    },

    setPreset(presetKey) {
        const state = AppState.get();
        const p = state.presets[presetKey];
        if (!p) return;

        state.activePreset = presetKey;
        state.waterLevelPercent = p.level;
        state.outflowLitersMin = p.outflow;
        state.inflowLitersMin = p.inflow;
        state.simHour = p.hour;
        state.continuousFlowMinutes = p.duration;
        state.ultrasonicNoisePercent = p.noise;
        state.wifiRssiDbm = p.rssi;

        if (typeof document !== 'undefined') {
            const setVal = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.value = val;
            };

            setVal('sim-level-slider', p.level);
            setVal('sim-outflow-slider', p.outflow);
            setVal('sim-inflow-slider', p.inflow);
            setVal('sim-hour-slider', p.hour);
            setVal('sim-duration-slider', p.duration);
            setVal('sim-noise-slider', p.noise);
            setVal('sim-rssi-slider', p.rssi);

            Object.keys(state.presets).forEach(k => {
                const btn = document.getElementById(`preset-btn-${k}`);
                if (btn) {
                    btn.className = k === presetKey
                        ? 'text-left p-3.5 rounded-2xl bg-slate-900 border-2 border-sky-500 transition-all shadow-md shadow-sky-500/10'
                        : 'text-left p-3.5 rounded-2xl bg-slate-900 border-2 border-transparent hover:border-slate-700 transition-all';
                }
            });

            const activePresetLbl = document.getElementById('active-preset-label');
            if (activePresetLbl) activePresetLbl.textContent = p.name;
            const simActiveModeTitle = document.getElementById('sim-active-mode-title');
            if (simActiveModeTitle) simActiveModeTitle.textContent = p.name;
        }

        // Ponto imediato no histórico gráfico
        state.historyLevel.push(Number(state.waterLevelPercent.toFixed(1)));
        state.historyFlow.push(Number(state.outflowLitersMin.toFixed(1)));
        if (state.historyLevel.length > 16) {
            state.historyLevel.shift();
            state.historyFlow.shift();
        }

        const isAlertPreset = ['critical', 'overflow', 'leak'].includes(presetKey);
        if (!isAlertPreset) {
            NotifyUI.clearPushBanner();
            NotifyUI.showToast(`Cenário aplicado: ${p.name}`, 'success');
        }

        NotifyUI.refreshSliderTracks();
        if (typeof window !== 'undefined' && window.UIController) {
            window.UIController.refresh(true, isAlertPreset);
        }
        ChartRenderer.draw();
    },

    handleSliderChange() {
        if (typeof document === 'undefined') return;
        const state = AppState.get();

        const getVal = (id, def = 0) => {
            const el = document.getElementById(id);
            return el ? parseFloat(el.value) : def;
        };

        state.waterLevelPercent = getVal('sim-level-slider', 78);
        state.outflowLitersMin = getVal('sim-outflow-slider', 4.5);
        state.inflowLitersMin = getVal('sim-inflow-slider', 0);
        state.simHour = parseInt(getVal('sim-hour-slider', 14), 10);
        state.continuousFlowMinutes = parseInt(getVal('sim-duration-slider', 0), 10);
        state.ultrasonicNoisePercent = getVal('sim-noise-slider', 2);
        state.wifiRssiDbm = parseInt(getVal('sim-rssi-slider', -54), 10);

        if (state.outflowLitersMin > 0 && state.continuousFlowMinutes === 0) {
            state.continuousFlowMinutes = 1;
            const durSlider = document.getElementById('sim-duration-slider');
            if (durSlider) durSlider.value = '1';
        }

        const presetLbl = document.getElementById('active-preset-label');
        if (presetLbl) presetLbl.textContent = 'Ajuste manual de sensores';
        const modeTitle = document.getElementById('sim-active-mode-title');
        if (modeTitle) modeTitle.textContent = 'Ajuste Manual';
        state.activePreset = 'custom';

        Object.keys(state.presets).forEach(k => {
            const btn = document.getElementById(`preset-btn-${k}`);
            if (btn) btn.className = 'text-left p-3.5 rounded-2xl bg-slate-900 border-2 border-transparent hover:border-slate-700 transition-all';
        });

        NotifyUI.refreshSliderTracks();
        if (typeof window !== 'undefined' && window.UIController) {
            window.UIController.refresh(true, false);
        }
        ChartRenderer.draw();
    },

    stepPhysicsTick() {
        const state = AppState.get();
        if (!state.authenticated || state.isDraggingSlider) return;

        // Uptime corrigido (sem bug Math.uptimeSeconds)
        state.uptimeSeconds += 1;
        const hrs = String(Math.floor(state.uptimeSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((state.uptimeSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(state.uptimeSeconds % 60).padStart(2, '0');

        if (typeof document !== 'undefined') {
            const uptimeEl = document.getElementById('arch-uptime');
            if (uptimeEl) uptimeEl.textContent = `${hrs}:${mins}:${secs}`;
        }

        // Física dinâmica em tempo real (se ativada pelo usuário)
        const dynToggle = typeof document !== 'undefined' ? document.getElementById('dynamic-physics-toggle') : null;
        if (dynToggle && dynToggle.checked) {
            const netLitersPerSec = (state.inflowLitersMin - state.outflowLitersMin) / 60;
            const deltaLiters = netLitersPerSec * state.simSpeedMultiplier;
            const deltaPercent = (deltaLiters / state.tankCapacityLiters) * 100;

            let nextLevel = state.waterLevelPercent + deltaPercent;

            // Se a caixa enche e não está em falha de boia travada, a boia fecha normalmente
            if (state.inflowLitersMin > 0 && state.activePreset !== 'overflow' && state.waterLevelPercent <= state.rules.criticalHighPercent) {
                const safeStop = Math.max(85, state.rules.criticalHighPercent - 3);
                if (nextLevel >= safeStop) {
                    nextLevel = safeStop;
                    state.inflowLitersMin = 0;
                    if (typeof document !== 'undefined') {
                        const inSlider = document.getElementById('sim-inflow-slider');
                        if (inSlider) inSlider.value = '0';
                    }
                    NotifyUI.showToast('Boia automática fechou a entrada (Caixa cheia).', 'success');
                }
            }

            state.waterLevelPercent = Math.max(1, Math.min(100, nextLevel));
            if (typeof document !== 'undefined') {
                const lvlSlider = document.getElementById('sim-level-slider');
                if (lvlSlider) lvlSlider.value = Math.round(state.waterLevelPercent);
            }
            NotifyUI.refreshSliderTracks();
        }

        if (state.outflowLitersMin > 0) {
            state.dailyConsumptionLiters += (state.outflowLitersMin / 60) * (state.simSpeedMultiplier > 1 ? 2.5 : 1);
        }

        const jitter = (Math.random() - 0.5) * state.ultrasonicNoisePercent;
        state.rawWaterLevelPercent = Math.max(0, Math.min(100, state.waterLevelPercent + jitter));

        state.historyLevel.push(Number(state.waterLevelPercent.toFixed(1)));
        state.historyFlow.push(Number(state.outflowLitersMin.toFixed(1)));
        if (state.historyLevel.length > 16) {
            state.historyLevel.shift();
            state.historyFlow.shift();
        }

        if (typeof window !== 'undefined' && window.UIController) {
            window.UIController.refresh(true, false);
        }

        if (state.activePage === 'dashboard') {
            ChartRenderer.draw();
        }
    }
};
