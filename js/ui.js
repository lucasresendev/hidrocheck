/**
 * HidroCheck — Controlador Geral de Interface, Abas e Métricas (UIController)
 */
import { AppState } from './state.js';
import { NotifyUI } from './notify.js';
import { ChartRenderer } from './chart.js';
import { AlertEngine } from './rules.js';
import { HydraulicPhysics } from './physics.js';

export const UIController = {
    switchPage(page) {
        const state = AppState.get();
        state.activePage = page;

        if (page === 'alerts') {
            state.unreadAlertsCount = 0;
            AlertEngine.updateBadge();
        }

        if (typeof document !== 'undefined') {
            ['dashboard', 'alerts', 'simulator', 'architecture'].forEach(p => {
                const el = document.getElementById(`page-${p}`);
                const mobBtn = document.getElementById(`mob-nav-${p}`);
                const deskBtn = document.getElementById(`desk-nav-${p}`);

                if (p === page) {
                    if (el) el.classList.remove('hidden');
                    if (mobBtn) mobBtn.className = 'relative flex flex-col items-center justify-center py-2 rounded-2xl bg-sky-500/15 text-sky-400 font-bold transition-all';
                    if (deskBtn) deskBtn.className = 'px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-500 text-white transition-all flex items-center gap-1.5 relative';
                } else {
                    if (el) el.classList.add('hidden');
                    if (mobBtn) mobBtn.className = 'relative flex flex-col items-center justify-center py-2 rounded-2xl text-slate-400 font-semibold transition-all';
                    if (deskBtn) deskBtn.className = 'px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-all flex items-center gap-1.5 relative';
                }
            });

            NotifyUI.refreshSliderTracks();
            if (page === 'dashboard') {
                setTimeout(() => ChartRenderer.draw(), 30);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },

    setTankCapacity(cap) {
        const state = AppState.get();
        state.tankCapacityLiters = cap;
        AppState.save();

        if (typeof document !== 'undefined') {
            [500, 1000, 2000, 5000].forEach(c => {
                const simBtn = document.getElementById(`cap-btn-${c}`);
                if (simBtn) {
                    simBtn.className = c === cap
                        ? 'py-2.5 rounded-xl text-xs font-bold bg-sky-500 text-white shadow-sm'
                        : 'py-2.5 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-400';
                }
                const alertBtn = document.getElementById(`alert-cap-${c}`);
                if (alertBtn) {
                    alertBtn.className = c === cap
                        ? 'py-1.5 rounded-lg text-[11px] font-bold bg-sky-500 text-white'
                        : 'py-1.5 rounded-lg text-[11px] font-bold bg-slate-950 border border-slate-800 text-slate-400';
                }
                const onbBtn = document.getElementById(`onb-cap-${c}`);
                if (onbBtn) {
                    onbBtn.className = c === cap
                        ? 'py-3 rounded-2xl text-xs font-bold bg-sky-500 text-white shadow-md shadow-sky-500/20'
                        : 'py-3 rounded-2xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300';
                }
            });

            const headerCap = document.getElementById('header-tank-cap');
            if (headerCap) headerCap.textContent = `${cap} L`;
        }

        this.refresh(false);
        ChartRenderer.draw();
        NotifyUI.showToast(`Capacidade ajustada para ${cap} L`, 'info');
    },

    updateResidents(val) {
        const state = AppState.get();
        const count = Math.max(1, Math.min(8, parseInt(val, 10) || 3));
        state.residentsCount = count;
        state.dailyGoalLiters = count * 150;
        const txt = `${count} ${count === 1 ? 'pessoa' : 'pessoas'}`;

        if (typeof document !== 'undefined') {
            const onbLbl = document.getElementById('onb-residents-label');
            if (onbLbl) onbLbl.textContent = `${txt} (Meta: ${state.dailyGoalLiters} L/dia)`;
            const cfgDisp = document.getElementById('cfg-residents-display');
            if (cfgDisp) cfgDisp.textContent = txt;
            const cfgSub = document.getElementById('cfg-residents-sub');
            if (cfgSub) cfgSub.textContent = `Meta: ${state.dailyGoalLiters} L/dia`;

            NotifyUI.refreshSliderTracks();
        }

        this.refresh(false);
    },

    adjustResidents(delta) {
        const state = AppState.get();
        const next = Math.max(1, Math.min(8, state.residentsCount + delta));
        if (typeof document !== 'undefined') {
            const slider = document.getElementById('onb-residents-slider');
            if (slider) slider.value = next;
        }
        this.updateResidents(next);
    },

    adjustMnfMinutes(delta) {
        const state = AppState.get();
        const next = Math.max(5, Math.min(60, state.rules.mnfMinDuration + delta));
        state.rules.mnfMinDuration = next;
        AppState.save();

        if (typeof document !== 'undefined') {
            const onbDisp = document.getElementById('onb-mnf-mins-display');
            if (onbDisp) onbDisp.textContent = `${next} min`;
            const onbVal = document.getElementById('onb-c3-val');
            if (onbVal) onbVal.textContent = `Após ${next} min`;
            const cfgDisp = document.getElementById('cfg-mnf-mins-display');
            if (cfgDisp) cfgDisp.textContent = `${next} min`;
        }

        this.refresh(true);
    },

    async toggleNotificationPrefs() {
        if (typeof document === 'undefined') return;
        const state = AppState.get();
        const pushToggle = document.getElementById('cfg-push-toggle');
        const soundToggle = document.getElementById('cfg-sound-toggle');

        if (pushToggle) {
            state.rules.pushEnabled = pushToggle.checked;
            if (pushToggle.checked) {
                // Solicita permissão do navegador quando o usuário liga o toggle
                await NotifyUI.requestBrowserPermission();
            }
        }
        if (soundToggle) {
            state.rules.soundEnabled = soundToggle.checked;
        }

        AppState.save();
        NotifyUI.showToast('Preferências de notificação salvas.', 'info');
    },

    updateAlertConfigFromTab() {
        if (typeof document === 'undefined') return;
        const state = AppState.get();

        const c1Slider = document.getElementById('cfg-c1-slider');
        const c2Slider = document.getElementById('cfg-c2-slider');
        const mnfStart = document.getElementById('cfg-mnf-start');
        const mnfEnd = document.getElementById('cfg-mnf-end');

        state.rules.criticalLowPercent = parseInt(c1Slider ? c1Slider.value : '15', 10);
        state.rules.criticalHighPercent = parseInt(c2Slider ? c2Slider.value : '95', 10);
        state.rules.mnfStartHour = parseInt(mnfStart ? mnfStart.value : '2', 10);
        state.rules.mnfEndHour = parseInt(mnfEnd ? mnfEnd.value : '5', 10);

        const onbC1 = document.getElementById('onb-c1-slider');
        const onbC2 = document.getElementById('onb-c2-slider');
        if (onbC1) onbC1.value = state.rules.criticalLowPercent;
        if (onbC2) onbC2.value = state.rules.criticalHighPercent;

        AppState.save();
        NotifyUI.refreshSliderTracks();
        this.refresh(true);
    },

    toggleInletValve() {
        const state = AppState.get();
        state.inflowLitersMin = state.inflowLitersMin > 0 ? 0 : 18.0;

        if (typeof document !== 'undefined') {
            const inSlider = document.getElementById('sim-inflow-slider');
            if (inSlider) inSlider.value = state.inflowLitersMin;
        }

        NotifyUI.refreshSliderTracks();
        this.refresh(true);
    },

    async copyPayload() {
        const state = AppState.get();
        const text = JSON.stringify(state.lastJsonPayload, null, 2);

        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                await navigator.clipboard.writeText(text);
                NotifyUI.showToast('JSON copiado para a área de transferência!', 'success');
                return;
            }
        } catch (_) {}

        // Fallback para navegadores sem permissão de clipboard direta
        if (typeof document !== 'undefined') {
            const temp = document.createElement('textarea');
            temp.value = text;
            temp.setAttribute('readonly', '');
            temp.style.position = 'absolute';
            temp.style.left = '-9999px';
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            NotifyUI.showToast('JSON copiado com sucesso!', 'success');
        }
    },

    refresh(allowPush = false, forcePush = false) {
        const state = AppState.get();
        const level = Math.max(0, Math.min(100, state.waterLevelPercent));
        const currentLiters = HydraulicPhysics.calculateLiters(level, state.tankCapacityLiters);
        const distanceCm = HydraulicPhysics.calculateUltrasonicDistance(level, state.sensorDeadZoneCm, state.tankHeightCm);
        const tofMicros = HydraulicPhysics.calculateTimeOfFlightMicros(distanceCm);
        const hallFrequencyHz = HydraulicPhysics.calculateHallFrequencyHz(state.outflowLitersMin);

        const clockStr = NotifyUI.formatClock(state.simHour, state.simMinute);

        if (typeof document !== 'undefined') {
            const setTxt = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.textContent = val;
            };

            setTxt('header-clock-display', clockStr);
            setTxt('mini-clock-text', clockStr);

            const waterFill = document.getElementById('water-fill-container');
            if (waterFill) waterFill.style.height = `${level}%`;

            setTxt('tank-percent-display', NotifyUI.formatNumberBR(level, 1));
            setTxt('tank-liters-display', `${NotifyUI.formatNumberBR(currentLiters, 1)} de ${state.tankCapacityLiters} L`);

            const netFlow = HydraulicPhysics.calculateNetFlow(state.inflowLitersMin, state.outflowLitersMin);
            const deltaPill = document.getElementById('tank-delta-pill');
            if (deltaPill) {
                if (Math.abs(netFlow) < 0.05) {
                    deltaPill.textContent = 'Estável (0,0 L/min)';
                    deltaPill.className = 'text-[11px] font-bold text-emerald-300 mt-1';
                } else if (netFlow > 0) {
                    deltaPill.textContent = `▲ +${NotifyUI.formatNumberBR(netFlow)} L/min`;
                    deltaPill.className = 'text-[11px] font-bold text-emerald-300 mt-1';
                } else {
                    deltaPill.textContent = `▼ ${NotifyUI.formatNumberBR(netFlow)} L/min`;
                    deltaPill.className = 'text-[11px] font-bold text-amber-300 mt-1';
                }
            }

            const miniWaterBar = document.getElementById('mini-water-bar');
            if (miniWaterBar) miniWaterBar.style.height = `${level}%`;
            setTxt('mini-level-text', `${Math.round(level)}%`);
            setTxt('mini-outflow-text', `${NotifyUI.formatNumberBR(state.outflowLitersMin)} L/m`);

            const autonomy = HydraulicPhysics.calculateAutonomy(currentLiters, netFlow, state.tankCapacityLiters);
            setTxt('metric-autonomy', autonomy.label);
            setTxt('metric-net-balance', autonomy.flowLabel);

            const inletBtn = document.getElementById('inlet-valve-btn');
            const inletSub = document.getElementById('inlet-flow-sub');
            if (state.inflowLitersMin > 0) {
                if (inletSub) inletSub.textContent = `Aberta (+${NotifyUI.formatNumberBR(state.inflowLitersMin)} L/min)`;
                if (inletBtn) {
                    inletBtn.textContent = 'Fechar entrada';
                    inletBtn.className = 'px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 transition-all shrink-0';
                }
            } else {
                if (inletSub) inletSub.textContent = 'Fechada (0 L/min)';
                if (inletBtn) {
                    inletBtn.textContent = 'Abrir entrada';
                    inletBtn.className = 'px-4 py-2.5 rounded-xl text-xs font-bold bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 transition-all shrink-0';
                }
            }

            setTxt('flow-rate-display', NotifyUI.formatNumberBR(state.outflowLitersMin));
            setTxt('daily-consumption-display', Math.round(state.dailyConsumptionLiters));
            setTxt('daily-goal-display', `/ ${state.dailyGoalLiters} L`);

            const goalPct = Math.min(100, Math.round((state.dailyConsumptionLiters / state.dailyGoalLiters) * 100));
            setTxt('daily-goal-percent', `${goalPct}%`);
            const goalBar = document.getElementById('daily-goal-bar');
            if (goalBar) goalBar.style.width = `${goalPct}%`;

            const costEl = document.getElementById('daily-cost-display');
            if (costEl) {
                if (state.dailyConsumptionLiters > state.dailyGoalLiters) {
                    costEl.textContent = 'Acima da meta diária';
                    costEl.className = 'text-xs font-medium text-amber-400 mt-1 block';
                } else {
                    costEl.textContent = `Dentro da meta (${state.residentsCount} moradores)`;
                    costEl.className = 'text-xs font-medium text-emerald-400 mt-1 block';
                }
            }

            const rotorIcon = document.getElementById('hall-rotor-icon');
            const pipeState = document.getElementById('pipe-state-display');
            if (rotorIcon && pipeState) {
                if (state.outflowLitersMin <= 0.05) {
                    rotorIcon.style.animationDuration = '0s';
                    pipeState.textContent = 'Sem consumo no momento';
                    pipeState.className = 'text-xs font-medium text-slate-400 mt-1 block';
                } else if (state.outflowLitersMin <= 1.5) {
                    rotorIcon.style.animationDuration = '2.5s';
                    pipeState.textContent = `Fluxo contínuo (${state.continuousFlowMinutes} min)`;
                    pipeState.className = 'text-xs font-medium text-amber-400 mt-1 block';
                } else if (state.outflowLitersMin > 12) {
                    rotorIcon.style.animationDuration = '0.4s';
                    pipeState.textContent = 'Consumo elevado';
                    pipeState.className = 'text-xs font-medium text-cyan-300 mt-1 block';
                } else {
                    rotorIcon.style.animationDuration = '1.2s';
                    pipeState.textContent = 'Uso moderado';
                    pipeState.className = 'text-xs font-medium text-sky-300 mt-1 block';
                }
            }

            // Rótulos da aba Simular
            setTxt('sim-level-label', `${NotifyUI.formatNumberBR(level, 1)}% (${Math.round(currentLiters)} L)`);
            setTxt('sim-outflow-label', `${NotifyUI.formatNumberBR(state.outflowLitersMin)} L/min`);
            setTxt('sim-inflow-label', `${NotifyUI.formatNumberBR(state.inflowLitersMin)} L/min`);
            setTxt('sim-hour-label', clockStr);
            setTxt('sim-duration-label', `${state.continuousFlowMinutes} min`);
            setTxt('sim-noise-label', `${state.ultrasonicNoisePercent}% (${state.ultrasonicNoisePercent > 10 ? 'Agitada' : 'Calma'})`);
            setTxt('sim-rssi-label', `${state.wifiRssiDbm} dBm (${state.wifiRssiDbm > -67 ? 'Ótimo' : 'Fraco'})`);

            // Rótulos da aba Arquitetura / Sistema
            setTxt('arch-s1-dist', `Distância: ${distanceCm.toFixed(1)} cm`);
            setTxt('arch-s1-tof', `Eco: ${tofMicros} µs`);
            setTxt('arch-s2-flow', `Vazão: ${state.outflowLitersMin.toFixed(1)} L/min`);
            setTxt('arch-s2-hz', `Pulso: ${hallFrequencyHz} Hz`);
            setTxt('arch-mcu-filter', `Bruto: ${state.rawWaterLevelPercent.toFixed(1)}% → Filtrado: ${level.toFixed(1)}%`);
            setTxt('arch-mcu-rule', `Estado: ${state.lastTriggeredRuleKey}`);
            setTxt('arch-net-ssid', state.wifiSsid);
            setTxt('arch-net-rssi', `${state.wifiRssiDbm} dBm (${state.wifiRssiDbm > -67 ? 'Ótimo' : 'Fraco'})`);

            state.lastJsonPayload = HydraulicPhysics.generateMqttPayload(state, clockStr);
            const mqttTerminal = document.getElementById('mqtt-terminal');
            if (mqttTerminal) {
                mqttTerminal.textContent = JSON.stringify(state.lastJsonPayload, null, 2);
            }
        }

        // Avalia regras de proteção
        AlertEngine.evaluate(allowPush, forcePush);
    }
};
