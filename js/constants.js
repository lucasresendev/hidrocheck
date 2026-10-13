/**
 * HidroCheck — Constantes Globais, Sensores e Cenários Pré-configurados
 */

export const SENSOR_CONSTANTS = {
    // HC-SR04: Tempo de ida e volta do som (~343 m/s) em microssegundos por cm
    TOF_MICROS_PER_CM: 58.3,
    // YF-S201: Fator de conversão de vazão para frequência do rotor Hall (Hz por L/min)
    HALL_FREQ_FACTOR: 7.5,
    // Capacidades padronizadas de reservatório (Litros)
    VALID_CAPACITIES: [500, 1000, 2000, 5000],
    // Consumo médio residencial de referência por pessoa (L/dia)
    LITERS_PER_PERSON_DAILY: 150
};

export const AUTH_DEFAULTS = {
    USER: 'fatec',
    PASS: 'fatec'
};

export const PRESETS = {
    normal: {
        name: 'Abastecimento normal',
        level: 78,
        outflow: 4.5,
        inflow: 0.0,
        hour: 14,
        duration: 4,
        noise: 2,
        rssi: -54
    },
    critical: {
        name: "Risco de falta d'água",
        level: 11,
        outflow: 3.5,
        inflow: 0.0,
        hour: 16,
        duration: 5,
        noise: 2,
        rssi: -58
    },
    overflow: {
        name: 'Alerta de boia travada',
        level: 97,
        outflow: 0.0,
        inflow: 14.0,
        hour: 11,
        duration: 0,
        noise: 4,
        rssi: -55
    },
    leak: {
        name: 'Vazamento noturno (MNF)',
        level: 62,
        outflow: 1.2,
        inflow: 0.0,
        hour: 3,
        duration: 22,
        noise: 1,
        rssi: -52
    },
    shower: {
        name: 'Uso intenso (Banho)',
        level: 64,
        outflow: 18.0,
        inflow: 0.0,
        hour: 19,
        duration: 8,
        noise: 4,
        rssi: -58
    },
    refill: {
        name: 'Abastecimento rápido',
        level: 45,
        outflow: 2.0,
        inflow: 24.0,
        hour: 10,
        duration: 2,
        noise: 5,
        rssi: -55
    }
};

export const STORAGE_KEYS = {
    AUTH_STATE: 'hidrocheck_auth_v1',
    HOUSE_NAME: 'hidrocheck_house_name_v1',
    RULES: 'hidrocheck_rules_v1',
    NOTIFICATIONS: 'hidrocheck_notifications_v1',
    TANK_CAPACITY: 'hidrocheck_tank_capacity_v1'
};
