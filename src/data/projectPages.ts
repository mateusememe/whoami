import type { LocalizedString } from "@/data/portfolio";

export interface LocalizedList {
  pt: string[];
  en: string[];
  es: string[];
}

/** Content of a project's own page (featured projects only). */
export interface ProjectPageContent {
  /** What the animated cover shows, in one sentence. */
  cover: LocalizedString;
  /** Facts about the project: 2 or 4 per language, same count in each. Backticks mark code. */
  highlights: LocalizedList;
}

/**
 * Content of the project pages, one entry per featured project. Kept out of
 * portfolio.ts so the main bundle does not carry it: the project page (a
 * lazy chunk), the agent files and the build read it.
 */
export const projectPages: Record<string, ProjectPageContent> = {
  "rinha-backend-2026-c": {
    cover: {
      pt: "O ponto de consulta busca no próprio bucket espacial e nos vizinhos e liga os 5 vetores de referência mais próximos.",
      en: "The query point searches its own spatial bucket and the neighbouring ones, then links its 5 nearest reference vectors.",
      es: "El punto de consulta busca en su propio bucket espacial y en los vecinos, y une los 5 vectores de referencia más cercanos.",
    },
    highlights: {
      pt: [
        "Latência mediana perto de 250 µs e p95 perto de 430 µs sob carga, cerca de 2.400 requisições por segundo em um único núcleo de worker.",
        "Três binários em C compartilham memória via POSIX SHM: um loader que quantiza 1.000.000 de vetores de referência em 4.096 buckets espaciais, workers HTTP que rodam KNN com k = 5 e um balanceador de carga.",
        "Cada consulta lê o próprio bucket e os mais próximos, cerca de 8.000 registros em vez de 1.000.000, e para antes quando os primeiros 1.024 registros dão 5 rótulos iguais.",
        "As distâncias usam SIMD ARM Neon sobre valores em ponto fixo de 16 bits, e cada registro ocupa 64 bytes para caber em uma linha de cache.",
      ],
      en: [
        "Median latency near 250 µs and p95 near 430 µs under load, about 2,400 requests per second on a single worker core.",
        "Three C binaries share memory over POSIX SHM: a loader that quantizes 1,000,000 reference vectors into 4,096 spatial buckets, HTTP workers that run KNN with k = 5, and a load balancer.",
        "A query reads its own bucket and the nearest ones, about 8,000 records instead of 1,000,000, and stops early when the first 1,024 records give 5 identical labels.",
        "Distances use ARM Neon SIMD on 16-bit fixed-point values, and each record is padded to 64 bytes so it sits on one cache line.",
      ],
      es: [
        "Latencia mediana cercana a 250 µs y p95 cercano a 430 µs bajo carga, unas 2.400 solicitudes por segundo en un solo núcleo de worker.",
        "Tres binarios en C comparten memoria vía POSIX SHM: un loader que cuantiza 1.000.000 de vectores de referencia en 4.096 buckets espaciales, workers HTTP que ejecutan KNN con k = 5 y un balanceador de carga.",
        "Cada consulta lee su propio bucket y los más cercanos, unos 8.000 registros en lugar de 1.000.000, y termina antes cuando los primeros 1.024 registros dan 5 etiquetas iguales.",
        "Las distancias usan SIMD ARM Neon sobre valores en punto fijo de 16 bits, y cada registro ocupa 64 bytes para caber en una línea de caché.",
      ],
    },
  },
  "megabrain-context-protocol": {
    cover: {
      pt: "Um agente de código abre a sessão com o servidor MCP: `initialize`, capabilities e `tools/list`, antes de perguntar se a branch está pronta.",
      en: "A coding agent opens a session with the MCP server: `initialize`, capabilities and `tools/list`, before it asks whether the branch is ready.",
      es: "Un agente de código abre la sesión con el servidor MCP: `initialize`, capabilities y `tools/list`, antes de preguntar si la rama está lista.",
    },
    highlights: {
      pt: [
        "O DevBrain responde uma pergunta para o agente de código: esta branch está pronta para virar pull request? As regras de revisão ficam no código, e o agente justifica a resposta com o que as tools devolveram.",
        "O servidor é dividido em domain, application e adapters, e os testes o usam pelo cliente MCP, sem LLM no meio.",
        "O mesmo servidor roda no Antigravity, Gemini CLI, Claude Code, GitHub Copilot e Codex; o repositório traz uma configuração para cada host.",
        "O guia do aluno tem os labs na ordem da aula, e os 56 slides são um deck em reveal.js que abre sem internet. Ministrado com Maria Beatriz França.",
      ],
      en: [
        "DevBrain answers one question for a coding agent: is this branch ready for a pull request? The review rules live in code, and the agent backs its answer with what the tools returned.",
        "The server is split into domain, application and adapters, and its tests drive it through the MCP client with no LLM in the loop.",
        "The same server runs in Antigravity, Gemini CLI, Claude Code, GitHub Copilot and Codex; the repository ships a config for each host.",
        "The student guide has the labs in class order, and the 56 slides are a reveal.js deck that opens offline. Taught with Maria Beatriz França.",
      ],
      es: [
        "DevBrain responde una pregunta para el agente de código: ¿esta rama está lista para un pull request? Las reglas de revisión viven en el código, y el agente justifica su respuesta con lo que devolvieron las tools.",
        "El servidor se divide en domain, application y adapters, y sus pruebas lo usan a través del cliente MCP, sin LLM en el medio.",
        "El mismo servidor funciona en Antigravity, Gemini CLI, Claude Code, GitHub Copilot y Codex; el repositorio trae una configuración para cada host.",
        "La guía del alumno tiene los labs en el orden de la clase, y las 56 diapositivas son un deck en reveal.js que abre sin internet. Impartido con Maria Beatriz França.",
      ],
    },
  },
  syntroph: {
    cover: {
      pt: "Os eventos saem do núcleo hexagonal pelo barramento para um adaptador de cada vez, e cada passagem entra no saga journal.",
      en: "Events leave the hexagonal core through the bus to one adapter at a time, and each hand-off is appended to the saga journal.",
      es: "Los eventos salen del núcleo hexagonal por el bus hacia un adaptador a la vez, y cada paso se agrega al saga journal.",
    },
    highlights: {
      pt: [
        "Núcleo hexagonal com um barramento de eventos síncrono em processo: a saída de um adaptador vira a entrada do próximo, e um saga journal append-only registra cada passo.",
        "A memória de sessão é gravada localmente em `.syntroph/memory/` e espelhada no GitHub Issues ou na Wiki por um provedor explícito: REST, MCP ou o repositório Git da wiki.",
        "Uma queda do remoto nunca falha uma escrita local: ela vira uma sincronização pendente, tratada pelos comandos `sync status`, `sync recovery`, `sync retry` e `sync resolve`.",
        "Roda com os CLIs do Claude Code, Codex e Antigravity, e mantém um catálogo de skills de engenharia offline, publicado só depois de verificado.",
      ],
      en: [
        "A hexagonal core with a synchronous in-process event bus: one adapter's output becomes the next adapter's input, and an append-only saga journal records each step.",
        "Session memory is written locally under `.syntroph/memory/` and mirrored to GitHub Issues or the Wiki through one explicit provider: REST, MCP or the wiki Git repository.",
        "A remote outage never fails a local write. It becomes a pending sync, handled by the `sync status`, `sync recovery`, `sync retry` and `sync resolve` commands.",
        "Runs with the Claude Code, Codex and Antigravity CLIs, and keeps an offline catalog of engineering skills that is published only once verified.",
      ],
      es: [
        "Un núcleo hexagonal con un bus de eventos síncrono en proceso: la salida de un adaptador se vuelve la entrada del siguiente, y un saga journal append-only registra cada paso.",
        "La memoria de sesión se escribe localmente en `.syntroph/memory/` y se refleja en GitHub Issues o en la Wiki mediante un proveedor explícito: REST, MCP o el repositorio Git de la wiki.",
        "Una caída del remoto nunca hace fallar una escritura local: se vuelve una sincronización pendiente, atendida por los comandos `sync status`, `sync recovery`, `sync retry` y `sync resolve`.",
        "Funciona con los CLI de Claude Code, Codex y Antigravity, y mantiene un catálogo de skills de ingeniería offline que solo se publica después de verificado.",
      ],
    },
  },
  "transaction-ledger": {
    cover: {
      pt: "Os eventos passam por API, tabela, stream e fila; uma chave de idempotência repetida é recusada com 409.",
      en: "Events cross the API, the table, the stream and the queue; a repeated idempotency key is rejected with 409.",
      es: "Los eventos pasan por la API, la tabla, el stream y la cola; una clave de idempotencia repetida se rechaza con 409.",
    },
    highlights: {
      pt: [
        "API Gateway com throttling (burst 20, rate 10) e um Lambda authorizer de JWT na frente de um serviço FastAPI rodando em AWS Lambda.",
        "Escritas condicionais no DynamoDB sobre uma chave de idempotência, então uma requisição repetida nunca cria uma segunda ordem.",
        "O DynamoDB Streams alimenta um Lambda de outbox que publica o evento de ordem criada; depois de 3 tentativas, a mensagem vai para uma dead-letter queue no SQS vigiada por alarmes do CloudWatch.",
        "A validação do solicitante fica atrás de um circuit breaker com retry, e LocalStack com WireMock reproduzem o ambiente AWS no Docker Compose.",
      ],
      en: [
        "API Gateway with throttling (burst 20, rate 10) and a JWT Lambda authorizer in front of a FastAPI service running on AWS Lambda.",
        "DynamoDB conditional writes on an idempotency key, so a retried request never creates a second order.",
        "DynamoDB Streams feed an outbox Lambda that publishes the order-created event; after 3 failed attempts a message moves to an SQS dead-letter queue watched by CloudWatch alarms.",
        "Requester validation sits behind a circuit breaker with retry, and LocalStack with WireMock reproduce the AWS setup in Docker Compose.",
      ],
      es: [
        "API Gateway con throttling (burst 20, rate 10) y un Lambda authorizer de JWT delante de un servicio FastAPI que corre en AWS Lambda.",
        "Escrituras condicionales en DynamoDB sobre una clave de idempotencia, así una solicitud repetida nunca crea una segunda orden.",
        "DynamoDB Streams alimenta un Lambda de outbox que publica el evento de orden creada; tras 3 intentos fallidos, el mensaje pasa a una dead-letter queue de SQS vigilada por alarmas de CloudWatch.",
        "La validación del solicitante está detrás de un circuit breaker con retry, y LocalStack con WireMock reproducen el entorno de AWS en Docker Compose.",
      ],
    },
  },
  codecash: {
    cover: {
      pt: "Uma requisição faz o caminho do cache miss até o PostgreSQL, e a seguinte é servida pelo Redis.",
      en: "A request takes the cache-miss path to PostgreSQL, and the next one is served from Redis.",
      es: "Una solicitud hace el camino del cache miss hasta PostgreSQL, y la siguiente se sirve desde Redis.",
    },
    highlights: {
      pt: [
        "API transacional em Spring Boot com schema GraphQL, PostgreSQL para armazenamento e Redis como cache de leitura, subida com Docker Compose.",
        "Feita para o curso API Hero no DevFest Presidente Prudente 2025; os slides estão no repositório em PDF.",
      ],
      en: [
        "Transactional API in Spring Boot with a GraphQL schema, PostgreSQL for storage and Redis as a read cache, started with Docker Compose.",
        "Built for the API Hero course at DevFest Presidente Prudente 2025; the slides are in the repository as a PDF.",
      ],
      es: [
        "API transaccional en Spring Boot con schema GraphQL, PostgreSQL para el almacenamiento y Redis como caché de lectura, levantada con Docker Compose.",
        "Hecha para el curso API Hero en DevFest Presidente Prudente 2025; las diapositivas están en el repositorio en PDF.",
      ],
    },
  },
  "8-puzzle": {
    cover: {
      pt: "O A* resolve um tabuleiro embaralhado movimento a movimento; os contadores mostram g, h e f = g + h.",
      en: "A* solves a scrambled board move by move; the counters show g, h and f = g + h.",
      es: "A* resuelve un tablero mezclado movimiento a movimiento; los contadores muestran g, h y f = g + h.",
    },
    highlights: {
      pt: [
        "Resolve o quebra-cabeça deslizante 3 × 3 com A* e Best-First Search, os dois guiados pela distância de Manhattan de cada peça até o destino.",
        "Interface em Pygame, com build em cx_Freeze para um executável Windows. Escrito com Vinicius Santana em 2021.",
      ],
      en: [
        "Solves the 3 × 3 sliding puzzle with A* and Best-First Search, both guided by the Manhattan distance of each tile to its goal.",
        "Pygame interface, with a cx_Freeze build for a Windows executable. Written with Vinicius Santana in 2021.",
      ],
      es: [
        "Resuelve el rompecabezas deslizante 3 × 3 con A* y Best-First Search, ambos guiados por la distancia de Manhattan de cada pieza a su destino.",
        "Interfaz en Pygame, con build en cx_Freeze para un ejecutable de Windows. Escrito con Vinicius Santana en 2021.",
      ],
    },
  },
  "fuzzymeans-ai": {
    cover: {
      pt: "Os centróides se movem a cada iteração do Fuzzy C-Means; as barras mostram a pertinência de um ponto em cada cluster.",
      en: "Centroids move with each Fuzzy C-Means iteration; the bars show one point's membership in each cluster.",
      es: "Los centroides se mueven en cada iteración de Fuzzy C-Means; las barras muestran la pertenencia de un punto a cada cluster.",
    },
    highlights: {
      pt: [
        "Imputa custos de danos ausentes em registros de acidentes em passagens de nível da FRA, agrupando por latitude, longitude, velocidade do trem e velocidade do veículo.",
        "O Noise Clustering (Davé, 1991) adiciona um cluster de ruído a uma distância fixa, então outliers como danos de bilhões digitados errado deixam de puxar os centróides reais.",
        "Cada custo imputado é a média dos clusters ponderada pelas pertinências do acidente: uma equação que qualquer pessoa pode auditar.",
        "A validação esconde 30% dos custos conhecidos em 5 sementes e compara MAE e RMSE em dólares com os baselines média, mediana, k-NN e MICE. Artigo e slides em LaTeX.",
      ],
      en: [
        "Imputes missing damage costs in FRA highway-rail crossing accident records by clustering on latitude, longitude, train speed and vehicle speed.",
        "Noise Clustering (Davé, 1991) adds a noise cluster at a fixed distance, so outliers such as mistyped billion-dollar damages stop pulling the real centroids.",
        "Each imputed cost is the cluster means weighted by the accident's memberships: an equation anyone can audit.",
        "Validation hides 30% of the known costs over 5 random seeds and compares MAE and RMSE in US dollars with mean, median, k-NN and MICE baselines. Paper and slides are in LaTeX.",
      ],
      es: [
        "Imputa costos de daños ausentes en registros de accidentes en pasos a nivel de la FRA, agrupando por latitud, longitud, velocidad del tren y velocidad del vehículo.",
        "Noise Clustering (Davé, 1991) agrega un cluster de ruido a una distancia fija, así los outliers como daños de miles de millones mal escritos dejan de arrastrar a los centroides reales.",
        "Cada costo imputado es la media de los clusters ponderada por las pertenencias del accidente: una ecuación que cualquiera puede auditar.",
        "La validación oculta el 30% de los costos conocidos en 5 semillas y compara MAE y RMSE en dólares con los baselines media, mediana, k-NN y MICE. Artículo y diapositivas en LaTeX.",
      ],
    },
  },
  "lime-stability": {
    cover: {
      pt: "Um substituto linear local é reajustado sobre perturbações reamostradas; a dispersão dos pesos é a instabilidade medida.",
      en: "A local linear surrogate is refit over resampled perturbations; the spread of its weights is the instability being measured.",
      es: "Un sustituto lineal local se reajusta sobre perturbaciones remuestreadas; la dispersión de sus pesos es la inestabilidad que se mide.",
    },
    highlights: {
      pt: [
        "Mede quanto as explicações do LIME mudam quando os valores ausentes são preenchidos por técnicas de imputação diferentes, em modelos RandomForest e GradientBoosting.",
        "Parte da pesquisa de mestrado na UNESP. O repositório é privado.",
      ],
      en: [
        "Measures how much LIME explanations change when missing values are filled by different imputation techniques, on RandomForest and GradientBoosting models.",
        "Part of the MSc research at UNESP. The repository is private.",
      ],
      es: [
        "Mide cuánto cambian las explicaciones de LIME cuando los valores ausentes se completan con técnicas de imputación distintas, en modelos RandomForest y GradientBoosting.",
        "Parte de la investigación de maestría en la UNESP. El repositorio es privado.",
      ],
    },
  },
  "git-github-in-action": {
    cover: {
      pt: "Branches saem da main, recebem commits e voltam com merge, desenhados da esquerda para a direita.",
      en: "Branches split from main, receive commits and merge back, drawn left to right.",
      es: "Las ramas salen de main, reciben commits y vuelven con merge, dibujadas de izquierda a derecha.",
    },
    highlights: {
      pt: [
        "Minicurso da 35ª Infoeste sobre controle de versão com Git e desenvolvimento colaborativo no GitHub.",
        "O repositório tem os slides do primeiro dia, o programa em C usado nos exercícios e uma lista de leituras sobre padrões de commit, gitmoji e o jogo Oh My Git!.",
      ],
      en: [
        "Short course at the 35th Infoeste on version control with Git and collaborative development on GitHub.",
        "The repository has the day-one slides, the C program used in the exercises and a reading list on commit conventions, gitmoji and the Oh My Git! game.",
      ],
      es: [
        "Minicurso de la 35ª Infoeste sobre control de versiones con Git y desarrollo colaborativo en GitHub.",
        "El repositorio tiene las diapositivas del primer día, el programa en C usado en los ejercicios y una lista de lecturas sobre convenciones de commit, gitmoji y el juego Oh My Git!.",
      ],
    },
  },
  "algorithm-forest": {
    cover: {
      pt: "Chaves entram em uma árvore AVL; uma rotação aparece como nós trocando de lugar para manter a altura balanceada.",
      en: "Keys go into an AVL tree; a rotation shows as nodes changing place to keep the height balanced.",
      es: "Las claves entran en un árbol AVL; una rotación se ve como nodos que cambian de lugar para mantener la altura balanceada.",
    },
    highlights: {
      pt: [
        "Árvore binária de busca e árvore AVL em Java, com as rotações que mantêm a AVL balanceada.",
        "Um estudo de estruturas em árvore de 2021, da graduação em Ciência da Computação.",
      ],
      en: [
        "Binary search tree and AVL tree in Java, with the rotations that keep the AVL tree balanced.",
        "A 2021 study of tree structures from the bachelor's in Computer Science.",
      ],
      es: [
        "Árbol binario de búsqueda y árbol AVL en Java, con las rotaciones que mantienen el AVL balanceado.",
        "Un estudio de estructuras de árbol de 2021, de la licenciatura en Ciencias de la Computación.",
      ],
    },
  },
  "zhang-suen-thinning": {
    cover: {
      pt: "Uma forma é erodida passe a passe até sobrar um esqueleto com um pixel de largura.",
      en: "A shape erodes pass by pass until a skeleton one pixel wide is left.",
      es: "Una forma se erosiona pasada a pasada hasta que queda un esqueleto de un píxel de ancho.",
    },
    highlights: {
      pt: [
        "Cada iteração roda duas subpassadas que apagam pixels de borda conforme a vizinhança, até a forma ter um pixel de largura e continuar conectada.",
        "Escrito em Python em 2021, para imagens binárias.",
      ],
      en: [
        "Each iteration runs two sub-passes that delete boundary pixels based on their neighbourhood, until the shape is one pixel wide and still connected.",
        "Written in Python in 2021, for binary images.",
      ],
      es: [
        "Cada iteración ejecuta dos subpasadas que borran píxeles de borde según su vecindad, hasta que la forma tiene un píxel de ancho y sigue conectada.",
        "Escrito en Python en 2021, para imágenes binarias.",
      ],
    },
  },
};
