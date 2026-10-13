import test from 'node:test';
import assert from 'node:assert/strict';
import { AppState } from '../js/state.js';
import { AlertEngine } from '../js/rules.js';

test('AlertEngine: Cenário C1 — Nível Crítico Baixo', () => {
    AppState.init();
    const state = AppState.get();
    state.waterLevelPercent = 12.0;
    state.rules.criticalLowPercent = 15;
    state.outflowLitersMin = 3.0;

    const rule = AlertEngine.evaluate(false, false);
    assert.strictEqual(rule, 'C1_LOW', 'Deve acionar regra C1_LOW quando nível for inferior a 15%');

    const diag = AlertEngine.getDiagnosticData();
    assert.strictEqual(diag.badge, "Risco de Falta d'Água");
    assert.ok(diag.steps.length > 0);
    assert.ok(typeof diag.actionFn === 'function');
});

test('AlertEngine: Cenário C2 — Risco de Transbordamento (Boia travada)', () => {
    AppState.init();
    const state = AppState.get();
    state.waterLevelPercent = 97.0;
    state.rules.criticalHighPercent = 95;
    state.inflowLitersMin = 14.0;

    const rule = AlertEngine.evaluate(false, false);
    assert.strictEqual(rule, 'C2_HIGH', 'Deve acionar regra C2_HIGH quando nível ultrapassar 95%');

    const diag = AlertEngine.getDiagnosticData();
    assert.strictEqual(diag.badge, 'Risco de Transbordamento');
    assert.ok(typeof diag.actionFn === 'function');
});

test('AlertEngine: Cenário C3 — Método MNF (Vazamento noturno)', () => {
    AppState.init();
    const state = AppState.get();
    state.waterLevelPercent = 70.0;
    state.outflowLitersMin = 1.5;
    state.simHour = 3; // Madrugada (entre 2h e 5h)
    state.continuousFlowMinutes = 25; // Acima dos 15 min
    state.rules.mnfStartHour = 2;
    state.rules.mnfEndHour = 5;
    state.rules.mnfMinDuration = 15;

    const rule = AlertEngine.evaluate(false, false);
    assert.strictEqual(rule, 'C3_MNF', 'Deve acionar regra C3_MNF para fluxo contínuo na madrugada');

    const diag = AlertEngine.getDiagnosticData();
    assert.ok(diag.badge.includes('Vazamento'));
});

test('AlertEngine: Cenário C3 não dispara durante o dia normal', () => {
    AppState.init();
    const state = AppState.get();
    state.waterLevelPercent = 75.0;
    state.outflowLitersMin = 4.0;
    state.simHour = 14; // 14h da tarde (fora da janela da madrugada)
    state.continuousFlowMinutes = 20;

    const rule = AlertEngine.evaluate(false, false);
    assert.strictEqual(rule, 'NORMAL', 'Não deve disparar C3_MNF durante o dia');
});

test('AlertEngine: Prioridade de proteção — C1 tem precedência sobre C2 e C3', () => {
    AppState.init();
    const state = AppState.get();
    state.waterLevelPercent = 10.0; // Ativa C1
    state.outflowLitersMin = 2.0;
    state.simHour = 3;
    state.continuousFlowMinutes = 30; // Ativaria C3 se C1 não existisse

    const rule = AlertEngine.evaluate(false, false);
    assert.strictEqual(rule, 'C1_LOW', 'C1_LOW tem prioridade máxima no fluxograma de segurança');
});
