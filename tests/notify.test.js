import test from 'node:test';
import assert from 'node:assert/strict';
import { NotifyUI } from '../js/notify.js';
import { AlertEngine } from '../js/rules.js';
import { AppState } from '../js/state.js';

test('NotifyUI: Formatação numérica e relógio brasileiro', () => {
    assert.strictEqual(NotifyUI.formatNumberBR(12.34, 1), '12,3');
    assert.strictEqual(NotifyUI.formatNumberBR(0, 1), '0,0');
    assert.strictEqual(NotifyUI.formatNumberBR(100.567, 2), '100,57');

    assert.strictEqual(NotifyUI.formatClock(8, 5), '08:05');
    assert.strictEqual(NotifyUI.formatClock(14, 30), '14:30');
    assert.strictEqual(NotifyUI.formatClock(0, 0), '00:00');
});

test('AlertEngine: Histórico de notificações e limitação de capacidade', () => {
    AppState.init();
    const state = AppState.get();
    state.notificationsLog = [];

    // Adiciona 12 notificações
    for (let i = 1; i <= 12; i++) {
        AlertEngine.logEvent(`Alerta ${i}`, `Descrição ${i}`, 'critical');
    }

    // Deve manter no máximo 10
    assert.strictEqual(state.notificationsLog.length, 10, 'Histórico deve reter no máximo 10 notificações');
    // A mais recente deve estar no topo
    assert.strictEqual(state.notificationsLog[0].title, 'Alerta 12');
});

test('AlertEngine: Contador de alertas não lidos incrementa fora da aba Alertas', () => {
    AppState.init();
    const state = AppState.get();
    state.activePage = 'dashboard';
    state.unreadAlertsCount = 0;

    AlertEngine.logEvent('Novo Alerta', 'Descrição', 'warning');
    assert.strictEqual(state.unreadAlertsCount, 1, 'Contador de alertas não lidos deve incrementar');

    AlertEngine.logEvent('Outro Alerta', 'Descrição', 'critical');
    assert.strictEqual(state.unreadAlertsCount, 2);
});
