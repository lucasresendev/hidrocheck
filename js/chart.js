/**
 * HidroCheck — Renderizador de Telemetria Gráfica em Canvas 2D com Suporte a High-DPI (Retina)
 */
import { AppState } from './state.js';

export const ChartRenderer = {
    draw() {
        if (typeof document === 'undefined') return;
        const canvas = document.getElementById('telemetry-chart');
        if (!canvas || !canvas.parentElement) return;

        const rect = canvas.parentElement.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;

        // Ajusta as dimensões lógicas do CSS para evitar distorção em telas Retina
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.resetTransform?.();
        ctx.scale(dpr, dpr);

        const w = rect.width;
        const h = rect.height;
        const padLeft = 34;
        const padRight = 12;
        const padTop = 10;
        const padBottom = 18;
        const plotW = w - padLeft - padRight;
        const plotH = h - padTop - padBottom;

        ctx.clearRect(0, 0, w, h);

        // Linhas de Grade e Eixo Y
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#64748b';
        ctx.font = '11px "Plus Jakarta Sans", sans-serif';

        [0, 50, 100].forEach(val => {
            const y = padTop + plotH - (val / 100) * plotH;
            ctx.beginPath();
            ctx.moveTo(padLeft, y);
            ctx.lineTo(w - padRight, y);
            ctx.stroke();
            ctx.fillText(`${val}%`, 2, y + 4);
        });

        const state = AppState.get();
        const points = state.historyLevel.length;
        if (points < 2) return;

        // 1. Curva de Nível H (%) em Azul Celeste
        ctx.beginPath();
        state.historyLevel.forEach((lvl, idx) => {
            const x = padLeft + (idx / (points - 1)) * plotW;
            const y = padTop + plotH - (Math.max(0, Math.min(100, lvl)) / 100) * plotH;
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Área preenchida com gradiente sob a curva de nível
        ctx.lineTo(padLeft + plotW, padTop + plotH);
        ctx.lineTo(padLeft, padTop + plotH);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
        ctx.fillStyle = grad;
        ctx.fill();

        // 2. Curva de Vazão Q (L/min) em Verde Esmeralda
        ctx.beginPath();
        state.historyFlow.forEach((flw, idx) => {
            const x = padLeft + (idx / (points - 1)) * plotW;
            const norm = Math.max(0, Math.min(30, flw)) / 30;
            const y = padTop + plotH - norm * plotH;
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2.5;
        ctx.stroke();
    }
};
