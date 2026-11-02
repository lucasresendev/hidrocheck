<div align="center">

  🇧🇷 **[Versão em Português](README.pt-BR.md)**
  <br>

  # 🔍 Project Research & Prompts | HidroCheck

  **[⬅️ Back to Main README](../../README.md)**

</div>

---

## 📚 How We Organized the Research

During the initial stage of the project, our group (Abner, Esmyrna, Felipe, Gabriel, Lucas, and Matheus) spent time brainstorming ideas, discussing everyday problems, and decided to focus on monitoring residential water tanks.

Instead of just doing random searches online, we looked for a structured way to organize what we needed to investigate:

1. **Choosing a Method:**
   - We looked into business matrices like **PESTEL**, but found them too corporate and broad, which would pull focus away from the technical side of our course.
   - Looking into technology-focused methods, we found 3 references:
     - *Design Science Research Methodology - DSRM* (Peffers et al., 2007)
     - *Software Engineering* (Pressman & Maxim, 2021)
     - *Scientific Methodology* (Gil, 2002; Marconi & Lakatos, 2003)
   - Since all three are extensive, we set the last one aside for now (as it focuses heavily on formal academic formatting rules) and combined the first two: **DSRM** gave us a general map of the steps, and **Pressman's book** gave us practical tools.

2. **Using NotebookLM and Research AIs:**
   - We uploaded the book and the paper to **Google NotebookLM** and asked it to cross-reference the material to create a step-by-step research plan for our project.
   - That gave us three core research areas:
     1. **Social & User Pains**
     2. **History & Market Comparison**
     3. **Scientific Data & Sensors**
   - Based on that, we wrote the 3 prompts below and ran them using **Deep Research** (Google Gemini) and **Investigar a Fundo** (Qwen), making sure to state at the end that this is a college project and that the parts needed to be cheap and easy to learn.

---

## 💬 Prompts Used in the Research

Below are the exact 3 prompts (in Portuguese) that we used to gather information and references for the project:

### 1. History & Market Research

```text
Atue como um analista de mercado de tecnologia de automação e historiador industrial. Estou desenvolvendo um "Monitor de reservatório residencial IoT inteligente" no meu curso de ADS.

Para a "Pesquisa Histórica e de Mercado", preciso que você trace um panorama comparativo completo. Elabore:
1. Uma linha do tempo histórica da evolução do controle de nível de água em reservatórios domésticos: começando pelas boias mecânicas tradicionais (válvula de flutuador), passando pelos sensores de nível eletromecânicos simples, sistemas industriais com CLP de alto custo, até chegar na telemetria IoT moderna de baixo custo.
2. Um mapeamento detalhado das soluções comerciais atualmente disponíveis no mercado brasileiro e internacional (ex: medidores de caixa d'água analógicos de LED, sistemas comerciais como Bosch ou marcas genéricas de automação inteligente via protocolo Tuya/SmartLife). Compare-os em termos de preço de aquisição, facilidade de instalação e limitações técnicas.
3. Uma Matriz de Benchmarking estruturada (tabela Markdown) comparando o meu artefato proposto (NodeMCU + ultrassônico + vazão + app de código aberto) com as soluções de mercado identificadas nos critérios: Custo de Hardware, Complexidade de Instalação, Monitoramento de Vazão Ativo, Alertas Inteligentes de Vazamento e Dependência de Ecossistemas Proprietários.
4. A identificação explícita do "Gap de Mercado" (a brecha que o meu projeto preenche): por que uma solução de baixo custo, modular e de código aberto é necessária se já existem boias mecânicas baratas e sistemas industriais caros?
```

### 2. Social & User Pains

```text
Atue como um especialista em UX Research e Antropologia Urbana focado em soluções residenciais. Estou iniciando o Projeto Integrador I de Análise e Desenvolvimento de Sistemas (ADS) para criar um "Monitor de reservatório residencial IoT inteligente" (NodeMCU + Sensor de Vazão e Nível + App).

Para fundamentar a "Pesquisa Social e Dores", preciso que você investigue e elabore:
1. Um estudo empático detalhado sobre como a falta de visibilidade do consumo de água afeta psicologicamente e financeiramente as famílias de diferentes classes sociais (ex: medo de ficar sem água no meio do banho, surpresa com a conta de água no fim do mês, negligência com vazamentos imperceptíveis).
2. Três Personas de Usuários bem definidas;
3. Um Mapa de Empatia estruturado (O que pensa/sente, O que ouve, O que vê, O que fala/faz, Dores e Necessidades) para cada uma dessas personas em relação à gestão da água em suas residências.
4. Encontre pesquisas que já existem sobre parte social e dores, fontes, dados estatísticos quantitativos e qualitativos.
```

### 3. Scientific Data & Sensors

```text
Atue como um pesquisador acadêmico sênior na área de Smart Cities, IoT (Internet das Coisas) e Engenharia Sanitária. Estou na fase de fundamentação teórica ("Frente Científica e de Dados") do meu projeto de monitoramento inteligente de água residenciais para o curso de ADS.

Preciso de um levantamento rigoroso de fundamentação acadêmica e dados estatísticos. Elabore:
1. Um resumo crítico do Estado da Arte baseado em pesquisas científicas recentes (como artigos do IEEE, ACM, Springer e periódicos nacionais sobre IoT e recursos hídricos). Quais são os métodos mais aceitos para monitorar água residencial usando microcontroladores?
2. Dados estatísticos consolidados e com fontes reais (ex: ANA - Agência Nacional de Águas, SNIS, ONU, Sabesp ou referências equivalentes) sobre as perdas de água por vazamentos residenciais internos (vazamentos de bacia sanitária, torneiras pingando, infiltrações) e o impacto econômico e ecológico disso em nível nacional.
3. O embasamento físico-matemático dos sensores que irei usar:
   - A física da propagação do som sob diferentes condições de temperatura e umidade para o sensor ultrassônico HC-SR04, detalhando a fórmula de velocidade do som ajustada e como isso afeta a precisão da leitura de nível em um reservatório úmido.
   - O cálculo físico-matemático de conversão de pulsos de frequência (Frequência em Hz gerada pelo rotor de efeito Hall) do Sensor de Vazão (ex: YF-S201) em vazão de litros por minuto (L/min) e consumo acumulado em metros cúbicos.
4. Uma bibliografia simulada em formato ABNT com pelo menos 5 artigos acadêmicos ou livros cruciais que representam a vanguarda tecnológica deste problema (autores, títulos reais ou altamente plausíveis de serem pesquisados no Google Acadêmico).

Observação: pensei em usar: "- Sensor ultrassônico - Sensor de Vazão - Placa NodeMCU - Fonte 5V", pois é um projeto de faculdade, então no geral, apesar de pesquisar as melhores práticas, devem ser práticas acessíveis para realização e aprendizado.
```

---

## 📊 What We Used from the Research

After reading through the research results, we discarded the parts that were too complex for our level and kept the key takeaways that we used in our work:

### 1. The Household & Sanitation Problem
- **Water waste:** Reports from SNIS and Instituto Trata Brasil show that nearly **40% of treated water in Brazil is lost** in distribution before being used.
- **Unseen leaks:** According to Sabesp data, a faulty toilet valve or a stuck tank float leaking a thin stream can waste over **13,500 liters per month**, causing the monthly water bill to spike without the resident noticing.
- **Lack of visibility:** Since the water tank sits closed under the roof, nobody sees the water level dropping day to day and only realizes there is a street outage when the tap runs dry.

### 2. Market Comparison
| Solution | Average Price | How It Works | Main Limitation |
| :--- | :--- | :--- | :--- |
| **Traditional Mechanical Float** | R$ 15 to R$ 40 | Closes the water inlet when the tank fills up | Shows no water level and gives no warning if it breaks |
| **Basic Commercial Monitors** | R$ 300 to R$ 600 | Show static water level only via LEDs or closed apps | Do not measure pipe flow and rely on paid third-party clouds |
| **Industrial Systems** | R$ 1,500 to R$ 5,000+ | Industrial sensors and professional control panels | Too expensive for a regular family home |
| **Our Proposal** | **Under R$ 150** | **NodeMCU Board + Ultrasonic Sensor + Flow Sensor** | **Affordable cost and combines level reading with pipe flow** |

### 3. How the Sensors Work
- **Ultrasonic Sensor (`HC-SR04` or `JSN-SR04T`):** Sits on the top lid of the water tank pointing down. It sends a sound pulse and measures the time for the echo to bounce back off the water. Using that distance in centimeters, we subtract it from the tank height to find the water percentage without touching the water.
- **Flow Sensor (`YF-S201` 1/2"):** Installed inline in the pipe. As water flows through, it spins a small internal pinwheel that sends electrical pulses to the board to calculate how many liters per minute (`L/min`) are passing.
- **Night Leak Alert:** If the flow sensor keeps registering water passing late at night (when everyone in the house is asleep), the system warns that there may be a hidden leak.

### 4. Household Leak Waste Estimates (Sabesp Data)

To understand the financial impact caused by unseen leaks, we surveyed official loss estimates published by sanitation utility Sabesp:

| Household Leak Type | Estimated Daily Loss | Projected Monthly Loss | Water Bill Impact |
| :--- | :--- | :--- | :--- |
| **Slow dripping faucet** | ~46 liters / day | ~1,380 liters / month | Minor increase |
| **Fast dripping faucet** | ~140 liters / day | ~4,200 liters / month | Noticeable increase |
| **Continuous thin stream (1 mm)** | ~2,000 liters / day | ~60,000 liters / month | Drastic tariff jump |
| **Toilet valve with minor leak** | ~400 liters / day | ~12,000 liters / month | Can double the bill |
| **Defective dual-flush toilet tank** | ~450 liters / day | ~13,500 liters / month | Can double the bill |
| **Stuck float / overflow pipe spill** | up to 10,000 liters / day | up to 300,000 liters / month | Budget collapse |

---

## 📚 Consulted Sources & References

Below are the institutional reports, academic papers, and component datasheets consulted during the project research:

### 1. Sanitation & Brazilian Water Data
- **SNIS (National Sanitation Information System):** *Diagnostic of Water and Sewage Services*. Brazilian Ministry of Regional Development.
- **Instituto Trata Brasil / GO Associados (2024):** *Water Loss Study in Brazil (SNIS Base)*. [Access study PDF](https://tratabrasil.org.br/wp-content/uploads/2024/06/Estudo-da-GO-Associados-Perdas-de-Agua-de-2024.pdf).
- **AESBE (2023):** *Drinking water waste in Brazil and financial losses*. [AESBE Portal](https://aesbe.org.br/desperdicio-de-agua-potavel-aumenta-no-brasil-e-perdas-chegam-a-mais-de-r-10-bilhoes-ao-ano-aponta-estudo-2/).
- **SABESP:** *Technical Bulletins and Water Conservation Guidelines*.

### 2. Methodology & Software Engineering
- **PEFFERS, K. et al. (2007):** *A Design Science Research Methodology for Information Systems Research*. Journal of Management Information Systems.
- **PRESSMAN, R. S.; MAXIM, B. R. (2021):** *Software Engineering: A Practitioner's Approach*. 9th ed. Porto Alegre: AMGH.

### 3. Electronic Components & Technical Manuals
- **Eletrogate:** *HC-SR04 Ultrasonic Distance Sensor Module*. [Datasheet & Manual](https://www.eletrogate.com/modulo-sensor-de-distancia-ultrassonico-hc-sr04).
- **Eletrogate:** *YF-S201 1/2" Water Flow Sensor*. [Datasheet & Manual](https://www.eletrogate.com/sensor-de-fluxo-de-agua-de-1-2).
- **RoboCore:** *NodeMCU ESP8266-12 V2 - WiFi*. [Pinout & Documentation](https://www.robocore.net/wifi/nodemcu-esp8266-12-v2).
- **Zap Imóveis (2024):** *Installing a new water tank at home? Key precautions*. [Article](https://www.zapimoveis.com.br/blog/casa-e-decoracao/arquitetura/vai-colocar-uma-nova-caixa-dagua-em-casa-veja-os-cuidados-importantes/).

### 4. Scientific Papers on IoT & Smart Water Metering
- **Frontiers in Water (2025):** *IoT enabled smart water metering using multi-sensor data fusion*. [Paper](https://www.frontiersin.org/journals/water/articles/10.3389/frwa.2025.1586916/full).
- **MDPI Sensors (2016):** *Contextualising Water Use in Residential Settings: A Survey of Non-Intrusive Disaggregation*. [Paper](https://www.mdpi.com/1424-8220/16/5/738).
- **IRJMETS (2024):** *IoT-driven Intelligent Water Distribution and Monitoring System*. [Paper](https://www.irjmets.com/upload_newfiles/irjmets80100093245/paper_file/irjmets80100093245.pdf).
- **PMC NCBI (2020):** *Smart water consumption measurement system for houses using IoT*. [Paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC7455589/).
