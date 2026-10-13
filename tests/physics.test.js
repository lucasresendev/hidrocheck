import test from 'node:test';
import assert from 'node:assert/strict';
import { HydraulicPhysics } from '../js/physics.js';

test('HydraulicPhysics: Cálculo de volume em litros', () => {
    assert.strictEqual(HydraulicPhysics.calculateLiters(78, 1000), 780);
    assert.strictEqual(HydraulicPhysics.calculateLiters(50, 2000), 1000);
    assert.strictEqual(HydraulicPhysics.calculateLiters(0, 1000), 0);
    assert.strictEqual(HydraulicPhysics.calculateLiters(100, 5000), 5000);
    // Deve limitar entre 0 e 100%
    assert.strictEqual(HydraulicPhysics.calculateLiters(-10, 1000), 0);
    assert.strictEqual(HydraulicPhysics.calculateLiters(120, 1000), 1000);
});

test('HydraulicPhysics: Balanço líquido de vazão', () => {
    assert.strictEqual(HydraulicPhysics.calculateNetFlow(18, 4.5), 13.5);
    assert.strictEqual(HydraulicPhysics.calculateNetFlow(0, 4.5), -4.5);
    assert.strictEqual(HydraulicPhysics.calculateNetFlow(0, 0), 0);
});

test('HydraulicPhysics: Estimativa de autonomia', () => {
    // Esvaziando: 600L a 2 L/min = 300 min (5h)
    const draining = HydraulicPhysics.calculateAutonomy(600, -2, 1000);
    assert.strictEqual(draining.type, 'draining');
    assert.strictEqual(draining.minutesLeft, 300);
    assert.strictEqual(draining.label, '~ 5h 0m');

    // Enchendo: faltando 200L com entrada líquida de +10 L/min = 20 min
    const filling = HydraulicPhysics.calculateAutonomy(800, 10, 1000);
    assert.strictEqual(filling.type, 'filling');
    assert.strictEqual(filling.minutesToFull, 20);

    // Estável
    const stable = HydraulicPhysics.calculateAutonomy(800, 0, 1000);
    assert.strictEqual(stable.type, 'stable');
    assert.strictEqual(stable.label, 'Estável');
});

test('HydraulicPhysics: Sensor ultrassônico HC-SR04 (distância e ToF)', () => {
    // Para nível 78%, zona morta 15 cm e altura 100 cm:
    // Distância = 15 + (100 - 78) * 1.0 = 37.0 cm
    const dist = HydraulicPhysics.calculateUltrasonicDistance(78, 15, 100);
    assert.strictEqual(dist, 37.0);

    // ToF = 37.0 * 58.3 = 2157 µs
    const tof = HydraulicPhysics.calculateTimeOfFlightMicros(dist);
    assert.strictEqual(tof, Math.round(37.0 * 58.3));
});

test('HydraulicPhysics: Sensor de vazão YF-S201 (Pulsos Hall)', () => {
    // F (Hz) = 7.5 * Q (L/min)
    assert.strictEqual(HydraulicPhysics.calculateHallFrequencyHz(4.5), 33.8);
    assert.strictEqual(HydraulicPhysics.calculateHallFrequencyHz(0), 0.0);
    assert.strictEqual(HydraulicPhysics.calculateHallFrequencyHz(20), 150.0);
});

test('HydraulicPhysics: Estrutura do payload MQTT NodeMCU ESP8266', () => {
    const mockState = {
        waterLevelPercent: 80,
        sensorDeadZoneCm: 15,
        tankHeightCm: 100,
        outflowLitersMin: 5.0,
        wifiSsid: 'Teste_WiFi',
        wifiRssiDbm: -55,
        continuousFlowMinutes: 8,
        lastTriggeredRuleKey: 'NORMAL'
    };

    const payload = HydraulicPhysics.generateMqttPayload(mockState, '15:30');
    assert.strictEqual(payload.device, 'NodeMCU-ESP8266');
    assert.strictEqual(payload.timestamp, '15:30');
    assert.strictEqual(payload.sensors.yf_s201_flow_l_min, 5.0);
    assert.strictEqual(payload.sensors.yf_s201_freq_hz, 37.5);
    assert.strictEqual(payload.protection_state.status, 'NORMAL');
});
