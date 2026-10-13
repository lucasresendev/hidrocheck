/**
 * HidroCheck — Gerenciador de Estado Reativo e Persistência Local
 */
import { AUTH_DEFAULTS, PRESETS, STORAGE_KEYS } from './constants.js';

export class AppStateStore {
    constructor() {
        this.listeners = new Set();
        this.init();
    }

    init() {
        // Carrega preferências persistidas de forma segura
        let savedRules = null;
        let savedLogs = null;
        let savedHouse = null;
        let savedCapacity = null;

        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const r = localStorage.getItem(STORAGE_KEYS.RULES);
                if (r) savedRules = JSON.parse(r);

                const n = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
                if (n) savedLogs = JSON.parse(n);

                savedHouse = localStorage.getItem(STORAGE_KEYS.HOUSE_NAME);
                savedCapacity = Number(localStorage.getItem(STORAGE_KEYS.TANK_CAPACITY));
            }
        } catch (_) {
            // Falha silenciosa em navegadores com cookies/storage bloqueados
        }

        this.data = {
            authKeyUser: AUTH_DEFAULTS.USER,
            authKeyPass: AUTH_DEFAULTS.PASS,
            authenticated: false,
            activePage: 'dashboard',
            activePreset: 'normal',
            houseName: savedHouse || 'Minha Casa',
            wifiSsid: 'Casa_Familia_2.4G',
            residentsCount: 3,
            dailyGoalLiters: 450,
            simSpeedMultiplier: 15,
            tankCapacityLiters: [500, 1000, 2000, 5000].includes(savedCapacity) ? savedCapacity : 1000,
            tankHeightCm: 100,
            sensorDeadZoneCm: 15,
            waterLevelPercent: 78.0,
            rawWaterLevelPercent: 78.0,
            outflowLitersMin: 4.5,
            inflowLitersMin: 0.0,
            ultrasonicNoisePercent: 2,
            wifiRssiDbm: -54,
            dailyConsumptionLiters: 184.0,
            uptimeSeconds: 862,
            simHour: 14,
            simMinute: 30,
            continuousFlowMinutes: 4,
            isDraggingSlider: false,
            rules: {
                criticalLowPercent: 15,
                criticalHighPercent: 95,
                mnfStartHour: 2,
                mnfEndHour: 5,
                mnfMinDuration: 15,
                pushEnabled: true,
                soundEnabled: true,
                ...(savedRules || {})
            },
            lastTriggeredRuleKey: 'NORMAL',
            unreadAlertsCount: 0,
            notificationsLog: Array.isArray(savedLogs) && savedLogs.length > 0 ? savedLogs : [
                {
                    time: '08:00',
                    title: 'Sistema conectado ao Wi-Fi 2.4 GHz',
                    desc: 'Sensores HC-SR04 e YF-S201 calibrados e em operação normal.',
                    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
                    severity: 'normal'
                }
            ],
            historyLevel: [79.0, 78.8, 78.6, 78.5, 78.3, 78.2, 78.1, 78.0, 78.0, 78.0],
            historyFlow: [4.2, 4.4, 4.5, 4.5, 4.6, 4.5, 4.4, 4.5, 4.5, 4.5],
            lastJsonPayload: {},
            presets: PRESETS
        };
    }

    get() {
        return this.data;
    }

    set(partial) {
        Object.assign(this.data, partial);
        this.save();
        this.notify();
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        for (const listener of this.listeners) {
            try {
                listener(this.data);
            } catch (err) {
                console.error('[AppState] Erro no listener:', err);
            }
        }
    }

    save() {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(this.data.rules));
                localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.data.notificationsLog));
                localStorage.setItem(STORAGE_KEYS.HOUSE_NAME, this.data.houseName);
                localStorage.setItem(STORAGE_KEYS.TANK_CAPACITY, String(this.data.tankCapacityLiters));
            }
        } catch (_) {}
    }
}

export const AppState = new AppStateStore();
