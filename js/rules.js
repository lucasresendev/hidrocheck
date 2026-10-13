/**
 * HidroCheck — Motor de Regras Hidráulicas, Diagnóstico e Histórico de Alertas (AlertEngine)
 */
import { AppState } from './state.js';
import { NotifyUI } from './notify.js';

export const AlertEngine = {
    /**
     * Avalia as condições de fluxo e nível conforme fluxograma da engenharia
     */
    evaluate(allowPush = false, forcePush = false) {
        const state = AppState.get();
        const H = state.waterLevelPercent;
        const Q = state.outflowLitersMin;
        const hour = state.simHour;
        const dur = state.continuousFlowMinutes;
        const r = state.rules;

        const awayModeToggle = typeof document !== 'undefined' ? document.getElementById('away-mode-toggle') : null;
        const awayMode = Boolean(awayModeToggle?.checked);

        // Condições individuais
        const condC1 = H < r.criticalLowPercent;
        const condC2 = H > r.criticalHighPercent;
        const isNightWindow = r.mnfStartHour <= r.mnfEndHour
            ? (hour >= r.mnfStartHour && hour <= r.mnfEndHour)
            : (hour >= r.mnfStartHour || hour <= r.mnfEndHour);
        const condC3 = (isNightWindow && Q > 0 && dur > r.mnfMinDuration) || (awayMode && Q > 0);

        // Prioridade de proteção: C1 -> C2 -> C3 -> NORMAL
        const isC1 = condC1;
        const isC2 = !isC1 && condC2;
        const isC3 = !isC1 && !isC2 && condC3;
        const isNormal = !isC1 && !isC2 && !isC3;

        let currentRuleKey = 'NORMAL';
        if (isC1) {
            currentRuleKey = 'C1_LOW';
        } else if (isC2) {
            currentRuleKey = 'C2_HIGH';
        } else if (isC3) {
            currentRuleKey = 'C3_MNF';
        } else {
            currentRuleKey = 'NORMAL';
        }

        const previousRuleKey = state.lastTriggeredRuleKey;

        // Atualização dos elementos de interface caso o DOM esteja disponível
        if (typeof document !== 'undefined') {
            const startHourStr = `${String(r.mnfStartHour).padStart(2, '0')}h`;
            const endHourStr = `${String(r.mnfEndHour).padStart(2, '0')}h`;

            const setTxt = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.textContent = val;
            };

            setTxt('flow-lbl-c1', r.criticalLowPercent);
            setTxt('flow-lbl-c2', r.criticalHighPercent);
            setTxt('flow-lbl-c3-hours', `${startHourStr}–${endHourStr}`);
            setTxt('flow-lbl-c3-mins', r.mnfMinDuration);

            setTxt('cfg-c1-label', `${r.criticalLowPercent}%`);
            setTxt('cfg-c2-label', `${r.criticalHighPercent}%`);
            setTxt('cfg-c3-label', `${startHourStr} às ${endHourStr} • ${r.mnfMinDuration} min`);

            const lineLow = document.getElementById('tank-line-low');
            if (lineLow) lineLow.style.bottom = `${r.criticalLowPercent}%`;
            const lineHigh = document.getElementById('tank-line-high');
            if (lineHigh) lineHigh.style.bottom = `${r.criticalHighPercent}%`;
            setTxt('tank-mark-min', `${r.criticalLowPercent}% Mín`);
            setTxt('tank-mark-max', `${r.criticalHighPercent}% Máx`);

            setTxt('flow-reading-c1', `Atual: ${NotifyUI.formatNumberBR(H)}%`);
            setTxt('flow-reading-c2', `Atual: ${NotifyUI.formatNumberBR(H)}%`);
            setTxt('flow-reading-c3', Q > 0 ? `${dur} min (${NotifyUI.formatNumberBR(Q)} L/m)` : 'Sem vazão');

            setTxt('flow-status-desc-c1', condC1
                ? `Atenção: Nível (${NotifyUI.formatNumberBR(H)}%) abaixo do mínimo de ${r.criticalLowPercent}%!`
                : `Nível atual acima do limite mínimo de ${r.criticalLowPercent}%`);
            setTxt('flow-status-desc-c2', condC2
                ? `Atenção: Nível (${NotifyUI.formatNumberBR(H)}%) ultrapassou ${r.criticalHighPercent}% (risco no ladrão)!`
                : `Boia operando abaixo do limite máximo de ${r.criticalHighPercent}%`);
            setTxt('flow-status-desc-c3', condC3
                ? `Alerta: Fluxo contínuo de ${NotifyUI.formatNumberBR(Q)} L/min detectado por ${dur} min!`
                : `Monitorando fluxo contínuo acima de ${r.mnfMinDuration} min na madrugada`);

            const cardC1 = document.getElementById('flow-card-c1');
            const badgeC1 = document.getElementById('flow-badge-c1');
            if (cardC1) cardC1.className = condC1
                ? 'p-3.5 rounded-2xl bg-rose-950/60 border-2 border-rose-500 transition-all flex items-center justify-between gap-3'
                : 'p-3.5 rounded-2xl surface-elevated border-2 border-transparent transition-all flex items-center justify-between gap-3';
            if (badgeC1) {
                badgeC1.className = condC1 ? 'px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-500 text-white' : 'px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400';
                badgeC1.textContent = condC1 ? 'EM ALERTA' : 'NORMAL';
            }

            const cardC2 = document.getElementById('flow-card-c2');
            const badgeC2 = document.getElementById('flow-badge-c2');
            if (cardC2) cardC2.className = condC2
                ? 'p-3.5 rounded-2xl bg-amber-950/60 border-2 border-amber-500 transition-all flex items-center justify-between gap-3'
                : 'p-3.5 rounded-2xl surface-elevated border-2 border-transparent transition-all flex items-center justify-between gap-3';
            if (badgeC2) {
                badgeC2.className = condC2 ? 'px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-400 text-slate-950' : 'px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400';
                badgeC2.textContent = condC2 ? 'EM ALERTA' : 'NORMAL';
            }

            const cardC3 = document.getElementById('flow-card-c3');
            const badgeC3 = document.getElementById('flow-badge-c3');
            if (cardC3) cardC3.className = condC3
                ? 'p-3.5 rounded-2xl bg-sky-950/60 border-2 border-sky-400 transition-all flex items-center justify-between gap-3'
                : 'p-3.5 rounded-2xl surface-elevated border-2 border-transparent transition-all flex items-center justify-between gap-3';
            if (badgeC3) {
                badgeC3.className = condC3 ? 'px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-sky-400 text-slate-950' : 'px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400';
                badgeC3.textContent = condC3 ? 'VAZAMENTO' : 'NORMAL';
            }

            const normBadge = document.getElementById('flow-badge-normal');
            if (normBadge) {
                normBadge.textContent = isNormal ? 'Protegido' : 'Alerta ativo';
                normBadge.className = isNormal
                    ? 'px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-400'
                    : 'px-3 py-1 rounded-full text-xs font-extrabold bg-rose-500/20 text-rose-400';
            }

            const banner = document.getElementById('smart-alert-banner');
            const titleEl = document.getElementById('alert-title');
            const descEl = document.getElementById('alert-desc');
            const statusBadge = document.getElementById('tank-status-badge');
            const simSummary = document.getElementById('sim-sticky-summary');
            const simRulePill = document.getElementById('sim-live-rule-pill');

            setTxt('alert-time-label', NotifyUI.formatClock(hour, state.simMinute));

            if (isC1) {
                const alertTitle = "🚨 Alerta: Nível Crítico Baixo (Risco de Falta d'Água)";
                const alertDesc = `O reservatório caiu para ${NotifyUI.formatNumberBR(H)}% (abaixo do mínimo de ${r.criticalLowPercent}%).`;

                if (banner) {
                    banner.className = 'rounded-2xl p-4 border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all bg-rose-950/90 border-rose-500 shadow-lg shadow-rose-950/40';
                    banner.classList.remove('hidden');
                }
                if (titleEl) titleEl.textContent = alertTitle;
                if (descEl) descEl.textContent = alertDesc;
                if (statusBadge) {
                    statusBadge.textContent = 'Nível Crítico';
                    statusBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400';
                }
                if (simSummary) simSummary.className = 'sticky top-[65px] z-20 rounded-2xl p-3.5 shadow-xl bg-rose-950/90 border-2 border-rose-500 transition-all';
                if (simRulePill) {
                    simRulePill.textContent = 'ALERTA C1';
                    simRulePill.className = 'px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-500 text-white';
                }

                if ((allowPush && previousRuleKey !== currentRuleKey) || forcePush) {
                    NotifyUI.showSmartphonePush(alertTitle, alertDesc, 'critical');
                    this.logEvent(alertTitle, alertDesc, 'critical');
                }
            } else if (isC2) {
                const alertTitle = '🚨 Alerta: Risco de Transbordamento (Boia Travada / Ladrão)';
                const alertDesc = `O nível atingiu ${NotifyUI.formatNumberBR(H)}% (acima do limite de ${r.criticalHighPercent}%). Verifique a boia.`;

                if (banner) {
                    banner.className = 'rounded-2xl p-4 border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all bg-amber-950/90 border-amber-500 shadow-lg shadow-amber-950/40';
                    banner.classList.remove('hidden');
                }
                if (titleEl) titleEl.textContent = alertTitle;
                if (descEl) descEl.textContent = alertDesc;
                if (statusBadge) {
                    statusBadge.textContent = 'Risco Transbordo';
                    statusBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300';
                }
                if (simSummary) simSummary.className = 'sticky top-[65px] z-20 rounded-2xl p-3.5 shadow-xl bg-amber-950/90 border-2 border-amber-500 transition-all';
                if (simRulePill) {
                    simRulePill.textContent = 'ALERTA C2';
                    simRulePill.className = 'px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-400 text-slate-950';
                }

                if ((allowPush && previousRuleKey !== currentRuleKey) || forcePush) {
                    NotifyUI.showSmartphonePush(alertTitle, alertDesc, 'warning');
                    this.logEvent(alertTitle, alertDesc, 'warning');
                }
            } else if (isC3) {
                const alertTitle = awayMode && !isNightWindow
                    ? '⚠️ Alerta: Consumo Detectado no Modo Casa Vazia'
                    : '⚠️ Alerta: Método MNF - Vazamento Interno Contínuo Detectado';
                const alertDesc = awayMode && !isNightWindow
                    ? `Vazão de ${NotifyUI.formatNumberBR(Q)} L/min identificada com o Modo Casa Vazia ativo.`
                    : `Fluxo contínuo de ${NotifyUI.formatNumberBR(Q)} L/min por ${dur} min na madrugada (${NotifyUI.formatClock(hour, state.simMinute)}).`;

                if (banner) {
                    banner.className = 'rounded-2xl p-4 border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all bg-sky-950/90 border-sky-400 shadow-lg shadow-sky-950/40';
                    banner.classList.remove('hidden');
                }
                if (titleEl) titleEl.textContent = alertTitle;
                if (descEl) descEl.textContent = alertDesc;
                if (statusBadge) {
                    statusBadge.textContent = 'Possível Vazamento';
                    statusBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300';
                }
                if (simSummary) simSummary.className = 'sticky top-[65px] z-20 rounded-2xl p-3.5 shadow-xl bg-sky-950/90 border-2 border-sky-400 transition-all';
                if (simRulePill) {
                    simRulePill.textContent = 'ALERTA C3 MNF';
                    simRulePill.className = 'px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-sky-400 text-slate-950';
                }

                if ((allowPush && previousRuleKey !== currentRuleKey) || forcePush) {
                    NotifyUI.showSmartphonePush(alertTitle, alertDesc, 'mnf');
                    this.logEvent(alertTitle, alertDesc, 'mnf');
                }
            } else {
                if (banner) banner.classList.add('hidden');
                if (statusBadge) {
                    statusBadge.textContent = 'Normal';
                    statusBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400';
                }
                if (simSummary) simSummary.className = 'sticky top-[65px] z-20 surface-elevated rounded-2xl p-3.5 shadow-xl border border-sky-500/30 transition-all';
                if (simRulePill) {
                    simRulePill.textContent = 'NORMAL';
                    simRulePill.className = 'px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300';
                }
            }
        }

        state.lastTriggeredRuleKey = currentRuleKey;
        this.syncDiagnosticCard(isNormal);
        return currentRuleKey;
    },

    /**
     * Dispara notificação de teste completa e registra no histórico
     */
    async triggerTestNotification() {
        const state = AppState.get();
        // Garante que permissão nativa seja solicitada caso ainda não concedida
        await NotifyUI.requestBrowserPermission();

        const title = 'Teste de Alerta do HidroCheck';
        const body = `Notificações ativas! Nível atual em ${NotifyUI.formatNumberBR(state.waterLevelPercent)}% e vazão em ${NotifyUI.formatNumberBR(state.outflowLitersMin)} L/min.`;

        // Exibe o push banner na tela
        NotifyUI.showSmartphonePush(title, body, 'mnf');

        // Registra o evento no histórico e atualiza badge
        this.logEvent(title, body, 'mnf');

        NotifyUI.showToast('Alerta de teste enviado com sucesso!', 'success');
    },

    getDiagnosticData() {
        const state = AppState.get();
        const H = state.waterLevelPercent;
        const Q = state.outflowLitersMin;
        const liters = Math.round((H / 100) * state.tankCapacityLiters);
        const r = state.rules;
        const clockStr = NotifyUI.formatClock(state.simHour, state.simMinute);

        const awayModeToggle = typeof document !== 'undefined' ? document.getElementById('away-mode-toggle') : null;
        const awayMode = Boolean(awayModeToggle?.checked);

        if (state.lastTriggeredRuleKey === 'C1_LOW') {
            const minsLeft = Q > 0.1 ? Math.round(liters / Q) : null;
            return {
                badge: "Risco de Falta d'Água",
                title: 'Nível Crítico Baixo Detectado',
                summary: `O volume da caixa caiu para ${NotifyUI.formatNumberBR(H)}% (${liters} L restantes de ${state.tankCapacityLiters} L), ficando abaixo do limite de segurança configurado em ${r.criticalLowPercent}%.`,
                metrics: `Nível: ${NotifyUI.formatNumberBR(H)}% (${liters} L) • Saída: ${NotifyUI.formatNumberBR(Q)} L/min`,
                cause: minsLeft ? `Autonomia crítica: restam cerca de ${minsLeft} min no ritmo atual.` : 'Abastecimento da rede pública interrompido ou registro de entrada fechado.',
                steps: [
                    'Verifique se há falta de água na rede da rua ou se o registro de entrada está fechado.',
                    'Economize água evitando lavar roupas e banhos prolongados.',
                    'Se possuir cisterna reserva ou bomba pressurizadora, ative o abastecimento.'
                ],
                actionLabel: 'Abrir entrada de água (+20 L/min)',
                actionFn: () => {
                    state.inflowLitersMin = 20.0;
                    state.activePreset = 'refill';
                    if (typeof document !== 'undefined') {
                        const s = document.getElementById('sim-inflow-slider');
                        if (s) s.value = '20';
                    }
                    NotifyUI.refreshSliderTracks();
                    if (typeof window !== 'undefined' && window.UIController) window.UIController.refresh(false);
                    this.closeDiagnosticModal();
                    NotifyUI.showToast('Entrada de água aberta (+20 L/min).', 'success');
                }
            };
        }

        if (state.lastTriggeredRuleKey === 'C2_HIGH') {
            return {
                badge: 'Risco de Transbordamento',
                title: 'Nível Acima do Limite de Segurança (Boia / Ladrão)',
                summary: `A água atingiu ${NotifyUI.formatNumberBR(H)}% (${liters} L), ultrapassando o teto de ${r.criticalHighPercent}% configurado para o reservatório.`,
                metrics: `Nível: ${NotifyUI.formatNumberBR(H)}% (${liters} L) • Entrada: +${NotifyUI.formatNumberBR(state.inflowLitersMin)} L/min`,
                cause: 'Causa provável: Boia mecânica travada aberta ou falha na vedação da válvula de entrada.',
                steps: [
                    "Feche imediatamente o registro de entrada da caixa d'água para evitar extravasão pelo ladrão.",
                    'Verifique se a haste da boia mecânica está emperrada ou desregulada.',
                    'Acompanhe a estabilização do nível pelo painel de monitoramento.'
                ],
                actionLabel: 'Fechar entrada e normalizar nível (90%)',
                actionFn: () => {
                    state.inflowLitersMin = 0.0;
                    state.waterLevelPercent = 90.0;
                    state.activePreset = 'normal';
                    if (typeof document !== 'undefined') {
                        const sIn = document.getElementById('sim-inflow-slider');
                        if (sIn) sIn.value = '0';
                        const sLvl = document.getElementById('sim-level-slider');
                        if (sLvl) sLvl.value = '90';
                    }
                    NotifyUI.refreshSliderTracks();
                    NotifyUI.clearPushBanner();
                    if (typeof window !== 'undefined' && window.UIController) window.UIController.refresh(false);
                    this.closeDiagnosticModal();
                    NotifyUI.showToast('Entrada fechada e nível estabilizado.', 'success');
                }
            };
        }

        if (state.lastTriggeredRuleKey === 'C3_MNF') {
            return {
                badge: awayMode ? 'Alerta Modo Casa Vazia' : 'Vazamento Interno (Método MNF)',
                title: awayMode ? 'Consumo Detectado com Casa Vazia' : 'Vazamento Silencioso na Madrugada',
                summary: awayMode
                    ? `Foi identificado um fluxo de ${NotifyUI.formatNumberBR(Q)} L/min enquanto o Modo Casa Vazia está ativo (${clockStr}).`
                    : `O sensor YF-S201 registrou vazão contínua de ${NotifyUI.formatNumberBR(Q)} L/min por ${state.continuousFlowMinutes} minutos seguidos durante a madrugada.`,
                metrics: `Vazão contínua: ${NotifyUI.formatNumberBR(Q)} L/min por ${state.continuousFlowMinutes} min • Perda estimada: ~${Math.round(Q * 60)} L/hora`,
                cause: 'Causa provável: Vaso sanitário com válvula de descarga desregulada, torneira pingando ou fissura na tubulação.',
                steps: [
                    'Inspecione os vasos sanitários da residência (causa mais frequente de perda contínua silenciosa).',
                    'Confira se torneiras externas, chuveiros ou filtros ficaram gotejando.',
                    'Feche registros individuais para identificar o ponto exato da perda de água.'
                ],
                actionLabel: 'Estancar vazão simulada (0 L/min)',
                actionFn: () => {
                    state.outflowLitersMin = 0.0;
                    state.continuousFlowMinutes = 0;
                    state.activePreset = 'normal';
                    if (typeof document !== 'undefined') {
                        const sOut = document.getElementById('sim-outflow-slider');
                        if (sOut) sOut.value = '0';
                        const sDur = document.getElementById('sim-duration-slider');
                        if (sDur) sDur.value = '0';
                    }
                    NotifyUI.refreshSliderTracks();
                    NotifyUI.clearPushBanner();
                    if (typeof window !== 'undefined' && window.UIController) window.UIController.refresh(false);
                    this.closeDiagnosticModal();
                    NotifyUI.showToast('Vazão estancada (0 L/min).', 'success');
                }
            };
        }

        return {
            badge: 'Operação Normal',
            title: 'Sistema Hidráulico Protegido',
            summary: 'Todos os indicadores de nível e vazão estão dentro dos parâmetros operacionais seguros.',
            metrics: `Nível: ${NotifyUI.formatNumberBR(H)}% (${liters} L) • Vazão: ${NotifyUI.formatNumberBR(Q)} L/min`,
            cause: 'Nenhuma anomalia detectada pelos sensores.',
            steps: ['O monitoramento segue ativo continuamente.'],
            actionLabel: null,
            actionFn: null
        };
    },

    syncDiagnosticCard(isNormal) {
        if (typeof document === 'undefined') return;
        const diagCard = document.getElementById('active-alert-diagnostic-card');
        if (!diagCard) return;

        if (isNormal) {
            diagCard.classList.add('hidden');
            return;
        }

        const info = this.getDiagnosticData();
        diagCard.classList.remove('hidden');

        const setTxt = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        const state = AppState.get();
        setTxt('diag-card-badge', info.badge);
        setTxt('diag-card-title', info.title);
        setTxt('diag-card-time', NotifyUI.formatClock(state.simHour, state.simMinute));
        setTxt('diag-card-summary', info.summary);
        setTxt('diag-card-metrics', info.metrics);
        setTxt('diag-card-cause', info.cause);

        const stepsEl = document.getElementById('diag-card-steps');
        if (stepsEl) {
            stepsEl.innerHTML = info.steps.map(s => `<li>${s}</li>`).join('');
        }

        const actionBox = document.getElementById('diag-card-quick-action');
        if (actionBox) {
            actionBox.innerHTML = '';
            if (info.actionLabel && info.actionFn) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'px-4 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-200 text-xs font-extrabold shadow-sm transition-all';
                btn.textContent = info.actionLabel;
                btn.onclick = info.actionFn;
                actionBox.appendChild(btn);
            }
        }
    },

    openDiagnosticModal() {
        if (typeof document === 'undefined') return;
        const info = this.getDiagnosticData();
        const modal = document.getElementById('alert-detail-modal');
        if (!modal) return;

        const state = AppState.get();
        const currentLiters = Math.round((state.waterLevelPercent / 100) * state.tankCapacityLiters);

        const setTxt = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        setTxt('modal-alert-badge', info.badge);
        setTxt('modal-alert-title', info.title);
        setTxt('modal-alert-desc', info.summary);
        setTxt('modal-metric-level', `${NotifyUI.formatNumberBR(state.waterLevelPercent)}% (${currentLiters} L)`);
        setTxt('modal-metric-flow', `${NotifyUI.formatNumberBR(state.outflowLitersMin)} L/min`);
        setTxt('modal-metric-time', NotifyUI.formatClock(state.simHour, state.simMinute));

        const stepsEl = document.getElementById('modal-alert-steps');
        if (stepsEl) {
            stepsEl.innerHTML = info.steps.map(s => `<li>${s}</li>`).join('');
        }

        const primaryBtn = document.getElementById('modal-primary-action-btn');
        if (primaryBtn) {
            if (info.actionLabel && info.actionFn) {
                primaryBtn.textContent = info.actionLabel;
                primaryBtn.onclick = info.actionFn;
            } else {
                primaryBtn.textContent = 'Fechar';
                primaryBtn.onclick = () => this.closeDiagnosticModal();
            }
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    },

    closeDiagnosticModal() {
        if (typeof document === 'undefined') return;
        const modal = document.getElementById('alert-detail-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    },

    logEvent(title, desc, severity) {
        const state = AppState.get();
        const badgeMap = {
            critical: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
            warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
            mnf: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
            normal: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
        };

        const timeStr = NotifyUI.formatClock(state.simHour, state.simMinute);
        state.notificationsLog.unshift({
            time: timeStr,
            title,
            desc,
            badgeClass: badgeMap[severity] || badgeMap.critical,
            severity
        });

        // Limita a 10 notificações mais recentes
        if (state.notificationsLog.length > 10) {
            state.notificationsLog.pop();
        }

        if (state.activePage !== 'alerts') {
            state.unreadAlertsCount++;
            this.updateBadge();
        }

        AppState.save();
        this.renderHistory();
    },

    updateBadge() {
        if (typeof document === 'undefined') return;
        const state = AppState.get();
        const mobDot = document.getElementById('mob-alert-dot');
        const deskBadge = document.getElementById('desk-alert-badge');

        if (state.unreadAlertsCount > 0) {
            if (mobDot) mobDot.classList.remove('hidden');
            if (deskBadge) {
                deskBadge.textContent = state.unreadAlertsCount;
                deskBadge.classList.remove('hidden');
            }
        } else {
            if (mobDot) mobDot.classList.add('hidden');
            if (deskBadge) deskBadge.classList.add('hidden');
        }
    },

    renderHistory() {
        if (typeof document === 'undefined') return;
        const list = document.getElementById('notification-history-list');
        if (!list) return;

        const state = AppState.get();
        if (state.notificationsLog.length === 0) {
            list.innerHTML = `<p class="text-xs text-slate-500 py-4 text-center">Nenhuma notificação registrada.</p>`;
            return;
        }

        list.innerHTML = state.notificationsLog.map(item => `
            <div class="p-3.5 rounded-2xl surface-elevated border ${item.badgeClass} flex items-start justify-between gap-3">
                <div>
                    <span class="text-xs font-extrabold block text-white">${item.title}</span>
                    <span class="text-xs text-slate-300 mt-0.5 block">${item.desc}</span>
                </div>
                <span class="text-[11px] font-mono text-slate-400 shrink-0">${item.time}</span>
            </div>
        `).join('');
    },

    clearHistory() {
        const state = AppState.get();
        state.notificationsLog = [];
        state.unreadAlertsCount = 0;
        AppState.save();
        this.updateBadge();
        this.renderHistory();
        NotifyUI.showToast('Histórico de notificações limpo.', 'info');
    }
};
