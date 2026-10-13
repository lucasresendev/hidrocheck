import test from 'node:test';
import assert from 'node:assert/strict';
import { AppState } from '../js/state.js';
import { PRESETS } from '../js/constants.js';

test('AppState: Estrutura inicial e valores padrão', () => {
    AppState.init();
    const state = AppState.get();

    assert.strictEqual(state.authenticated, false);
    assert.strictEqual(state.tankCapacityLiters, 1000);
    assert.strictEqual(state.waterLevelPercent, 78.0);
    assert.strictEqual(state.outflowLitersMin, 4.5);
    assert.strictEqual(state.rules.criticalLowPercent, 15);
    assert.strictEqual(state.rules.criticalHighPercent, 95);
    assert.strictEqual(state.rules.pushEnabled, true);
    assert.strictEqual(state.rules.soundEnabled, true);
});

test('AppState: Cenários pré-configurados (Presets)', () => {
    assert.ok(PRESETS.normal);
    assert.ok(PRESETS.critical);
    assert.ok(PRESETS.overflow);
    assert.ok(PRESETS.leak);
    assert.ok(PRESETS.shower);
    assert.ok(PRESETS.refill);

    assert.strictEqual(PRESETS.critical.level, 11);
    assert.strictEqual(PRESETS.overflow.level, 97);
    assert.strictEqual(PRESETS.leak.hour, 3);
});

test('AppState: Notificação de ouvintes reativos via subscribe()', () => {
    AppState.init();
    let notified = false;
    let receivedLevel = 0;

    const unsubscribe = AppState.subscribe((st) => {
        notified = true;
        receivedLevel = st.waterLevelPercent;
    });

    AppState.set({ waterLevelPercent: 55.5 });
    assert.strictEqual(notified, true);
    assert.strictEqual(receivedLevel, 55.5);

    unsubscribe();
    notified = false;
    AppState.set({ waterLevelPercent: 40.0 });
    assert.strictEqual(notified, false, 'Listener cancelado não deve ser chamado');
});

test('SimulatorController: applyPreset aplica valores do cenário corretamente', async () => {
    const { SimulatorController } = await import('../js/simulator.js');
    AppState.init();

    SimulatorController.applyPreset('critical');
    const state = AppState.get();
    assert.strictEqual(state.activePreset, 'critical');
    assert.strictEqual(state.waterLevelPercent, 11);
    assert.strictEqual(state.outflowLitersMin, 3.5);

    SimulatorController.applyPreset('normal');
    assert.strictEqual(state.activePreset, 'normal');
    assert.strictEqual(state.waterLevelPercent, 78);
});

test('SimulatorController: setSpeed atualiza simSpeedMultiplier com validação', async () => {
    const { SimulatorController } = await import('../js/simulator.js');
    AppState.init();

    SimulatorController.setSpeed(60);
    assert.strictEqual(AppState.get().simSpeedMultiplier, 60);

    SimulatorController.setSpeed(1);
    assert.strictEqual(AppState.get().simSpeedMultiplier, 1);

    SimulatorController.setSpeed(15);
    assert.strictEqual(AppState.get().simSpeedMultiplier, 15);

    // Valor inválido deve fazer fallback para 15
    SimulatorController.setSpeed(999);
    assert.strictEqual(AppState.get().simSpeedMultiplier, 15);
});
