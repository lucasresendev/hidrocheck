<div align="center">

  🇺🇸 **[English Version](README.md)**
  <br>

  # 🔍 Pesquisas e Prompts do Projeto | HidroCheck

  **[⬅️ Voltar para o README Principal](../../README.pt-BR.md)**

</div>

---

## 📚 Como Organizamos a Pesquisa

Na etapa inicial do projeto, nosso grupo (Abner, Esmyrna, Felipe, Gabriel, Lucas e Matheus) conversou sobre problemas do dia a dia, discutiu ideias e decidiu focar no monitoramento de caixas d'água residenciais.

Para não fazer apenas buscas soltas na internet, procuramos uma forma mais organizada de estruturar o que a gente precisava levantar:

1. **Escolha do Método:**
   - Chegamos a ver matrizes de mercado como a **PESTEL**, mas achamos extensa e corporativa demais, o que ia tirar o foco da parte técnica do nosso curso.
   - Pesquisando métodos voltados para tecnologia, encontramos 3 bases teóricas:
     - *Design Science Research Methodology - DSRM* (Peffers et al., 2007)
     - *Engenharia de Software* (Pressman & Maxim, 2021)
     - *Metodologia Científica* (Gil, 2002; Marconi e Lakatos, 2003)
   - Como todas são bem grandes, deixamos a última de lado neste momento (porque foca mais na formalidade da ABNT) e juntamos as duas primeiras: a **DSRM** serviu como um mapa geral do que fazer, e o livro do **Pressman** deu as ferramentas práticas.

2. **Uso do NotebookLM e IAs de Pesquisa:**
   - Colocamos o livro e o artigo no **Google NotebookLM** e pedimos para ele cruzar as informações e montar um passo a passo de pesquisa adaptado para o nosso projeto.
   - Saíram três frentes principais de investigação:
     1. **Social e Dores**
     2. **Histórica e de Mercado**
     3. **Frente Científica e de Dados**
   - Com isso, montamos os 3 prompts abaixo e rodamos nas ferramentas **Deep Research** (Google Gemini) e **Investigar a Fundo** (Qwen), deixando claro no final que somos estudantes de faculdade e que as peças precisavam ser baratas e acessíveis para aprender.

---

## 💬 Prompts Usados na Pesquisa

Abaixo estão os 3 prompts exatos que usamos para levantar as informações e referências do projeto:

### 1. Pesquisa Histórica e de Mercado

```text
Atue como um analista de mercado de tecnologia de automação e historiador industrial. Estou desenvolvendo um "Monitor de reservatório residencial IoT inteligente" no meu curso de ADS.

Para a "Pesquisa Histórica e de Mercado", preciso que você trace um panorama comparativo completo. Elabore:
1. Uma linha do tempo histórica da evolução do controle de nível de água em reservatórios domésticos: começando pelas boias mecânicas tradicionais (válvula de flutuador), passando pelos sensores de nível eletromecânicos simples, sistemas industriais com CLP de alto custo, até chegar na telemetria IoT moderna de baixo custo.
2. Um mapeamento detalhado das soluções comerciais atualmente disponíveis no mercado brasileiro e internacional (ex: medidores de caixa d'água analógicos de LED, sistemas comerciais como Bosch ou marcas genéricas de automação inteligente via protocolo Tuya/SmartLife). Compare-os em termos de preço de aquisição, facilidade de instalação e limitações técnicas.
3. Uma Matriz de Benchmarking estruturada (tabela Markdown) comparando o meu artefato proposto (NodeMCU + ultrassônico + vazão + app de código aberto) com as soluções de mercado identificadas nos critérios: Custo de Hardware, Complexidade de Instalação, Monitoramento de Vazão Ativo, Alertas Inteligentes de Vazamento e Dependência de Ecossistemas Proprietários.
4. A identificação explícita do "Gap de Mercado" (a brecha que o meu projeto preenche): por que uma solução de baixo custo, modular e de código aberto é necessária se já existem boias mecânicas baratas e sistemas industriais caros?
```

### 2. Pesquisa Social e Dores

```text
Atue como um especialista em UX Research e Antropologia Urbana focado em soluções residenciais. Estou iniciando o Projeto Integrador I de Análise e Desenvolvimento de Sistemas (ADS) para criar um "Monitor de reservatório residencial IoT inteligente" (NodeMCU + Sensor de Vazão e Nível + App).

Para fundamentar a "Pesquisa Social e Dores", preciso que você investigue e elabore:
1. Um estudo empático detalhado sobre como a falta de visibilidade do consumo de água afeta psicologicamente e financeiramente as famílias de diferentes classes sociais (ex: medo de ficar sem água no meio do banho, surpresa com a conta de água no fim do mês, negligência com vazamentos imperceptíveis).
2. Três Personas de Usuários bem definidas;
3. Um Mapa de Empatia estruturado (O que pensa/sente, O que ouve, O que vê, O que fala/faz, Dores e Necessidades) para cada uma dessas personas em relação à gestão da água em suas residências.
4. Encontre pesquisas que já existem sobre parte social e dores, fontes, dados estatísticos quantitativos e qualitativos.
```

### 3. Frente Científica e de Dados

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

## 📊 O que Aproveitamos das Pesquisas

Depois de ler os textos gerados pelas pesquisas, descartamos as partes que eram avançadas demais e separamos os pontos principais que realmente usamos no nosso trabalho:

### 1. O Problema nas Casas e no Saneamento
- **Desperdício de água:** Vimos nos relatórios do SNIS e do Instituto Trata Brasil que quase **40% da água tratada no Brasil é perdida** no caminho antes de ser aproveitada.
- **Vazamentos que ninguém vê:** Pelos dados da Sabesp, uma válvula de descarga com defeito ou uma boia travada vazando um pequeno filete chega a desperdiçar mais de **13.500 litros no mês**, fazendo a conta de água subir muito sem o morador perceber.
- **Falta de visibilidade:** Como a caixa d'água fica fechada em cima da casa, ninguém vê o nível diminuindo no dia a dia e só percebe que faltou água na rua quando a torneira já secou.

### 2. Comparação com o que Existe no Mercado
| Solução | Preço Médio | Como Funciona | Limitação Principal |
| :--- | :--- | :--- | :--- |
| **Boia Mecânica Comum** | R$ 15 a R$ 40 | Fecha a entrada de água quando a caixa enche | Não mostra quanta água tem nem avisa se der defeito |
| **Monitores Comerciais Simples** | R$ 300 a R$ 600 | Mostram só o nível da água com luzes de LED ou app fechado | Não medem a passagem de água no cano e dependem de nuvem paga |
| **Sistemas Industriais** | R$ 1.500 a R$ 5.000+ | Sensores industriais e painéis profissionais | Muito caros para uma residência comum |
| **Nossa Proposta** | **Menos de R$ 150** | **Placa NodeMCU + Sensor Ultrassônico + Sensor de Vazão** | **Custo acessível e junta leitura de nível com leitura de vazão** |

### 3. Como os Sensores Funcionam
- **Sensor Ultrassônico (`HC-SR04` ou `JSN-SR04T`):** Fica na tampa da caixa d'água apontado para baixo. Ele emite um pulso de som e mede o tempo até o eco voltar quando bate na água. Com essa distância em centímetros, subtraímos da altura da caixa para achar a porcentagem de água sem encostar nela.
- **Sensor de Vazão (`YF-S201` de 1/2"):** Fica instalado no cano. Quando a água passa, gira uma pequena hélice lá dentro que manda pulsos elétricos para a placa calcular quantos litros por minuto (`L/min`) estão passando.
- **Aviso de Vazamento à Noite:** Se o sensor de vazão continuar marcando passagem de água de madrugada (quando todo mundo na casa está dormindo), o sistema avisa que pode haver um vazamento oculto.

### 4. Tabela de Perdas por Microvazamentos Domésticos (Dados Sabesp)

Para entender o tamanho do prejuízo financeiro causado por vazamentos não percebidos, levantamos as estimativas oficiais de perda da Sabesp:

| Tipo de Vazamento Doméstico | Perda Estimada por Dia | Perda Projetada no Mês | Impacto na Conta de Água |
| :--- | :--- | :--- | :--- |
| **Torneira gotejando devagar** | ~46 litros / dia | ~1.380 litros / mês | Pequeno acréscimo |
| **Torneira gotejando rápido** | ~140 litros / dia | ~4.200 litros / mês | Aumento visível |
| **Torneira com filete contínuo (1 mm)** | ~2.000 litros / dia | ~60.000 litros / mês | Salto tarifário abusivo |
| **Vaso sanitário (válvula com pequeno vazamento)** | ~400 litros / dia | ~12.000 litros / mês | Pode dobrar a conta |
| **Vaso sanitário (caixa acoplada desregulada)** | ~450 litros / dia | ~13.500 litros / mês | Pode dobrar a conta |
| **Boia travada / transbordo pelo ladrão** | até 10.000 litros / dia | até 300.000 litros / mês | Colapso orçamentário |

---

## 📚 Fontes e Referências Consultadas

Abaixo estão reunidas as fontes institucionais, artigos acadêmicos e manuais de componentes que consultamos durante a pesquisa do projeto:

### 1. Saneamento e Dados Hídricos Nacionais
- **SNIS (Sistema Nacional de Informações sobre Saneamento):** *Diagnóstico dos Serviços de Água e Esgoto*. Ministério do Desenvolvimento Regional.
- **Instituto Trata Brasil / GO Associados (2024):** *Estudo de Perdas de Água no Brasil (Base SNIS)*. [Acessar estudo em PDF](https://tratabrasil.org.br/wp-content/uploads/2024/06/Estudo-da-GO-Associados-Perdas-de-Agua-de-2024.pdf).
- **AESBE (2023):** *Desperdício de água potável no Brasil e perdas financeiras*. [Portal AESBE](https://aesbe.org.br/desperdicio-de-agua-potavel-aumenta-no-brasil-e-perdas-chegam-a-mais-de-r-10-bilhoes-ao-ano-aponta-estudo-2/).
- **SABESP:** *Boletins Técnicos e Dicas de Uso Racional da Água*.

### 2. Metodologia e Engenharia de Software
- **PEFFERS, K. et al. (2007):** *A Design Science Research Methodology for Information Systems Research*. Journal of Management Information Systems.
- **PRESSMAN, R. S.; MAXIM, B. R. (2021):** *Engenharia de Software: Uma Abordagem Profissional*. 9. ed. Porto Alegre: AMGH.

### 3. Componentes Eletrônicos e Manuais Técnicos
- **Eletrogate:** *Módulo sensor de distância ultrassônico HC-SR04*. [Manual e Especificação](https://www.eletrogate.com/modulo-sensor-de-distancia-ultrassonico-hc-sr04).
- **Eletrogate:** *Sensor de fluxo de água de 1/2" YF-S201*. [Manual e Especificação](https://www.eletrogate.com/sensor-de-fluxo-de-agua-de-1-2).
- **RoboCore:** *NodeMCU ESP8266-12 V2 - WiFi*. [Pinout e Documentação](https://www.robocore.net/wifi/nodemcu-esp8266-12-v2).
- **Zap Imóveis (2024):** *Vai colocar uma nova caixa d’água em casa? Veja os cuidados importantes*. [Artigo](https://www.zapimoveis.com.br/blog/casa-e-decoracao/arquitetura/vai-colocar-uma-nova-caixa-dagua-em-casa-veja-os-cuidados-importantes/).

### 4. Artigos Científicos sobre IoT e Telemetria
- **Frontiers in Water (2025):** *IoT enabled smart water metering using multi-sensor data fusion*. [Artigo](https://www.frontiersin.org/journals/water/articles/10.3389/frwa.2025.1586916/full).
- **MDPI Sensors (2016):** *Contextualising Water Use in Residential Settings: A Survey of Non-Intrusive Disaggregation*. [Artigo](https://www.mdpi.com/1424-8220/16/5/738).
- **IRJMETS (2024):** *IoT-driven Intelligent Water Distribution and Monitoring System*. [Artigo](https://www.irjmets.com/upload_newfiles/irjmets80100093245/paper_file/irjmets80100093245.pdf).
- **PMC NCBI (2020):** *Smart water consumption measurement system for houses using IoT*. [Artigo](https://pmc.ncbi.nlm.nih.gov/articles/PMC7455589/).
