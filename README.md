# HidroCheck — Monitoramento Inteligente de Reservatórios

Sistema de telemetria hidráulica residencial em tempo real com IoT, arquitetura em 3 camadas (NodeMCU ESP8266 + Sensores HC-SR04 & YF-S201) e proteção automática contra desperdício e desabastecimento através do método **MNF (Minimum Night Flow)**.

Desenvolvido para execução como aplicação estática de alta performance, compatível nativamente com o **GitHub Pages**.

---

## 🛠️ Tecnologias e Arquitetura

- **Frontend & UI**: HTML5 Semântico, Tailwind CSS, Vanilla CSS moderno (Glassmorphism, gradientes HSL e animações hidráulicas).
- **Tipografia**: *Plus Jakarta Sans* e *JetBrains Mono*.
- **Ícones**: Lucide Icons com SVG nativo inline de fallback.
- **Gráficos & Telemetria**: Renderizador Canvas 2D vetorizado com suporte nativo a telas Retina (High-DPI).
- **Notificações Híbridas**:
  - API nativa de Notificações do Navegador (**Web Notifications API**).
  - Banners in-app de alta prioridade com contagem regressiva e som sintetizado (**Web Audio API**).
  - Histórico de eventos e contador de alertas não lidos.
  - Alerta tátil via vibração (`navigator.vibrate`) em smartphones.
- **Testes Automatizados**: Suíte de testes unitários e de integridade do DOM com `node:test` (21 testes, tempo de execução < 100ms, sem dependências externas).

---

## 📁 Estrutura Modular do Projeto

```
hidrocheck/
├── index.html                  # Ponto de entrada principal para o GitHub Pages
├── package.json                # Scripts npm de teste e execução
├── README.md                   # Documentação do projeto
├── .github/
│   └── workflows/
│       └── deploy.yml          # Pipeline CI/CD automático para o GitHub Pages
├── css/
│   ├── main.css                # Reset, tipografia base, scrollbar e superfícies
│   └── components.css          # Animações de ondas, sliders e banners de notificação
├── js/
│   ├── app.js                  # Ponto de entrada, auto-testes e loop físico em tempo real
│   ├── constants.js            # Fatores físicos dos sensores, presets e chaves de storage
│   ├── state.js                # Gerenciador de estado reativo com persistência no localStorage
│   ├── audio.js                # Sintetizador sonoro para alarmes críticos (Web Audio API)
│   ├── notify.js               # Notificações híbridas (Web Push, banner smartphone e toast)
│   ├── rules.js                # Motor de regras de proteção (C1, C2, C3 MNF) e diagnóstico
│   ├── physics.js              # Fórmulas hidráulicas, ToF ultrassônico, pulsos Hall e MQTT
│   ├── chart.js                # Gráfico de telemetria em Canvas 2D com correção High-DPI
│   ├── auth.js                 # Sessão, credenciais e botão de Acesso Rápido (Demonstração)
│   ├── onboarding.js           # Assistente de pareamento Wi-Fi e SoftAP simulado
│   ├── simulator.js            # Sliders de sensores e carregador de cenários pré-configurados
│   └── ui.js                   # Sincronização de métricas do DOM e navegação entre 4 abas
└── tests/
    ├── rules.test.js           # Testes das regras C1, C2, C3 e prioridade do fluxograma
    ├── physics.test.js         # Testes de volume, balanço líquido, frequência Hall e ToF
    ├── state.test.js           # Testes de estado reativo, presets e persistência
    ├── notify.test.js          # Testes de formatação, buffer de histórico e badges
    └── dom-integrity.test.js   # Validação de integridade de todos os IDs e eventos do HTML
```

---

## ⚙️ Regras de Proteção Hidráulica

| Regra | Condição | Ação do Sistema |
|---|---|---|
| **C1 (Nível Crítico Baixo)** | $H < 15\%$ | Alerta de desabastecimento, cálculo de autonomia restante e opção de abertura imediata de entrada. |
| **C2 (Risco de Transbordo)** | $H > 95\%$ | Alerta de falha na boia/ladrão, aviso sonoro e fechamento da válvula de alimentação. |
| **C3 (Método MNF Noturno)** | Janela 02h–05h + Vazão contínua $> 15$ min | Detecção de vazamento silencioso em ramais internos ou válvulas de descarga defeituosas. |
| **Modo Casa Vazia** | Residência desocupada + Vazão $> 0$ | Disparo imediato de alerta preventivo contra perdas contínuas. |

---

## 🚀 Como Executar Localmente

### 1. Clonar o Repositório
```bash
git clone https://github.com/SEU-USUARIO/hidrocheck.git
cd hidrocheck
```

### 2. Rodar os Testes Automatizados
```bash
npm test
```
*Executa todos os 21 testes de unidade e integridade em menos de 100 milissegundos utilizando o motor nativo do Node.js.*

### 3. Iniciar Servidor Local
```bash
npm start
```
Acesse `http://localhost:4173/` no navegador.

---

## 🌐 Publicação no GitHub Pages

O projeto já vem pronto para o GitHub Pages de duas maneiras:

### Opção 1: Automático via GitHub Actions (Recomendado)
1. Crie o repositório no GitHub e envie o código (`git push origin main`).
2. Acesse no GitHub: **Settings** > **Pages** > **Build and deployment**.
3. Em **Source**, selecione **GitHub Actions**.
4. O workflow `.github/workflows/deploy.yml` executará os testes e publicará o site automaticamente a cada commit.

### Opção 2: Direto pelo Branch `main`
1. Acesse **Settings** > **Pages**.
2. Em **Source**, escolha **Deploy from a branch**.
3. Selecione a branch `main` e a pasta `/ (root)`.
4. Salve. O site estará disponível em instantes no link fornecido pelo GitHub.

---

## 🔑 Acesso de Demonstração

Para facilitar a navegação em bancas avaliadoras e visualizadores do GitHub Pages:
- **Botão Rápido**: Clique em **⚡ Acesso Rápido (Demonstração)** na tela inicial.
- **Credenciais Manuais**:
  - Usuário: `fatec`
  - Senha: `fatec`
