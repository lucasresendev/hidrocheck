/**
 * HidroCheck — Modelagem Física Hidráulica, Sensores e Telemetria
 */
import { SENSOR_CONSTANTS } from './constants.js';

export const HydraulicPhysics = {
    /**
     * Calcula o volume atual em litros a partir da porcentagem de nível e capacidade
     */
    calculateLiters(levelPercent, capacityLiters) {
        const clampedLevel = Math.max(0, Math.min(100, Number(levelPercent) || 0));
        return (clampedLevel / 100) * Number(capacityLiters);
    },

    /**
     * Balanço líquido de vazão (Entrada - Saída) em L/min
     */
    calculateNetFlow(inflowLitersMin, outflowLitersMin) {
        return Number(inflowLitersMin || 0) - Number(outflowLitersMin || 0);
    },

    /**
     * Estima autonomia em minutos ou tempo até encher
     */
    calculateAutonomy(currentLiters, netFlow, capacityLiters) {
        if (netFlow < -0.05) {
            const minutesLeft = currentLiters / Math.abs(netFlow);
            const hours = Math.floor(minutesLeft / 60);
            const mins = Math.round(minutesLeft % 60);
            const label = hours > 48 ? 'Mais de 2 dias' : `~ ${hours}h ${mins}m`;
            return {
                type: 'draining',
                minutesLeft,
                label,
                flowLabel: `Descendo ${Math.abs(netFlow).toFixed(1).replace('.', ',')} L/min`
            };
        } else if (netFlow > 0.05) {
            const litersToFull = capacityLiters - currentLiters;
            const minsToFull = Math.max(1, Math.round(litersToFull / netFlow));
            const label = currentLiters >= capacityLiters * 0.99 ? 'Reservatório cheio' : `Enche em ~${minsToFull} min`;
            return {
                type: 'filling',
                minutesToFull: minsToFull,
                label,
                flowLabel: `Subindo +${netFlow.toFixed(1).replace('.', ',')} L/min`
            };
        }
        return {
            type: 'stable',
            label: 'Estável',
            flowLabel: 'Sem variação líquida'
        };
    },

    /**
     * Distância do sensor ultrassônico HC-SR04 até a lâmina d'água (cm)
     */
    calculateUltrasonicDistance(levelPercent, deadZoneCm = 15, tankHeightCm = 100) {
        const clamped = Math.max(0, Math.min(100, Number(levelPercent) || 0));
        return deadZoneCm + ((100 - clamped) * (tankHeightCm / 100));
    },

    /**
     * Tempo de voo do eco sonoro (ToF) em microssegundos
     */
    calculateTimeOfFlightMicros(distanceCm) {
        return Math.round(distanceCm * SENSOR_CONSTANTS.TOF_MICROS_PER_CM);
    },

    /**
     * Frequência de pulsos do sensor de efeito Hall YF-S201 (Hz)
     * Fórmula do datasheet: F (Hz) = 7.5 * Q (L/min)
     */
    calculateHallFrequencyHz(outflowLitersMin) {
        return Number((Math.max(0, outflowLitersMin) * SENSOR_CONSTANTS.HALL_FREQ_FACTOR).toFixed(1));
    },

    /**
     * Gera o payload padronizado em JSON do microcontrolador NodeMCU ESP8266
     */
    generateMqttPayload(state, clockStr) {
        const level = Math.max(0, Math.min(100, state.waterLevelPercent));
        const distanceCm = this.calculateUltrasonicDistance(level, state.sensorDeadZoneCm, state.tankHeightCm);
        const tofMicros = this.calculateTimeOfFlightMicros(distanceCm);
        const hallFrequencyHz = this.calculateHallFrequencyHz(state.outflowLitersMin);

        return {
            device: "NodeMCU-ESP8266",
            wifi_ssid: state.wifiSsid,
            timestamp: clockStr,
            wifi_rssi_dbm: state.wifiRssiDbm,
            sensors: {
                hc_sr04_distance_cm: Number(distanceCm.toFixed(2)),
                hc_sr04_tof_us: tofMicros,
                yf_s201_flow_l_min: Number(state.outflowLitersMin.toFixed(2)),
                yf_s201_freq_hz: Number(hallFrequencyHz)
            },
            protection_state: {
                level_H_percent: Number(level.toFixed(1)),
                flow_Q_l_min: Number(state.outflowLitersMin.toFixed(1)),
                continuous_flow_min: state.continuousFlowMinutes,
                status: state.lastTriggeredRuleKey
            }
        };
    }
};
