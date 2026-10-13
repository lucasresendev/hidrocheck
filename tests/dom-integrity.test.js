import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('DOM Integrity: Todos os IDs requisitados pelos módulos JS existem no index.html', () => {
    const html = fs.readFileSync(path.resolve('index.html'), 'utf8');

    // Extrai todos os IDs declarados no HTML
    const declaredIds = new Set();
    const idRegex = /\bid=["']([^"']+)["']/g;
    let match;
    while ((match = idRegex.exec(html)) !== null) {
        declaredIds.add(match[1]);
    }

    // Extrai todos os IDs chamados via document.getElementById em todos os arquivos de js/
    const jsFiles = fs.readdirSync(path.resolve('js')).filter(f => f.endsWith('.js'));
    const requestedIds = new Set();

    jsFiles.forEach(file => {
        const code = fs.readFileSync(path.resolve('js', file), 'utf8');
        const getElemRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
        let m;
        while ((m = getElemRegex.exec(code)) !== null) {
            requestedIds.add(m[1]);
        }
    });

    const missingIds = [];
    for (const id of requestedIds) {
        if (!declaredIds.has(id)) {
            missingIds.push(id);
        }
    }

    assert.strictEqual(
        missingIds.length,
        0,
        `IDs ausentes encontrados no HTML: ${missingIds.join(', ')}`
    );
});

test('DOM Integrity: Todos os manipuladores inline no index.html apontam para controladores válidos', () => {
    const html = fs.readFileSync(path.resolve('index.html'), 'utf8');

    // Encontra expressões on*="..."
    const handlerRegex = /\bon[a-z]+=["']([^"']+)["']/gi;
    const validNamespaces = [
        'AppAuth',
        'UIController',
        'AlertEngine',
        'SimulatorController',
        'NotifyUI',
        'OnboardingController'
    ];

    let match;
    const invalidCalls = [];
    while ((match = handlerRegex.exec(html)) !== null) {
        const expr = match[1].trim();
        // Verifica se a expressão invoca um dos namespaces ou função válida
        const hasValidNs = validNamespaces.some(ns => expr.includes(`${ns}.`));
        if (!hasValidNs) {
            invalidCalls.push(expr);
        }
    }

    assert.strictEqual(
        invalidCalls.length,
        0,
        `Chamadas inline com namespaces desconhecidos: ${invalidCalls.join('; ')}`
    );
});

test('DOM Integrity: Elementos essenciais de acessibilidade e meta tags', () => {
    const html = fs.readFileSync(path.resolve('index.html'), 'utf8');

    assert.ok(html.includes('<meta name="viewport"'), 'Deve conter viewport meta tag');
    assert.ok(html.includes('<title>'), 'Deve conter title tag');
    assert.ok(html.includes('lang="pt-BR"'), 'Deve especificar lang pt-BR');
    assert.ok(html.includes('<main'), 'Deve conter tag semântica <main>');
    assert.ok(html.includes('<header'), 'Deve conter tag semântica <header>');
    assert.ok(html.includes('<nav'), 'Deve conter tag semântica <nav>');
    assert.ok(html.includes('id="push-notification-container"'), 'Deve conter container de push');
    assert.ok(html.includes('id="toast-container"'), 'Deve conter container de toast');
});
