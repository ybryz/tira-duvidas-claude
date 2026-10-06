// Base de conhecimento do chatbot.
// Cada entrada: id, categoria, titulo (pergunta), palavras (sinônimos para busca), resposta (markdown simples).
window.KB = [
  {
    id: "o-que-e-claude-code",
    cat: "Começando",
    titulo: "O que é o Claude Code?",
    palavras: ["claude code", "o que e", "agente de codigo", "terminal", "cli", "introducao", "comecar"],
    resposta:
      "O **Claude Code** é um agente de código da Anthropic. Ele lê e edita arquivos, roda comandos e conversa com você para executar tarefas no seu projeto.\n\nVocê pode usá-lo:\n- no **terminal** (CLI)\n- no **aplicativo desktop** (Mac/Windows)\n- na **web** (claude.ai/code)\n- em **IDEs** (VS Code, JetBrains)\n\nA documentação oficial é a melhor \"apostila\": https://docs.claude.com/pt-BR/docs/claude-code",
  },
  {
    id: "instalar",
    cat: "Começando",
    titulo: "Como instalar o Claude Code?",
    palavras: ["instalar", "instalacao", "install", "npm", "baixar", "setup", "windows"],
    resposta:
      "O jeito mais comum é pelo npm (precisa do Node.js):\n\n```\nnpm install -g @anthropic-ai/claude-code\n```\n\nDepois entre na pasta do seu projeto e rode:\n\n```\nclaude\n```\n\nNa primeira vez ele pede para você fazer login. Se preferir, o app desktop e a versão web não precisam de instalação por terminal.",
  },
  {
    id: "skills",
    cat: "Skills",
    titulo: "O que são Skills?",
    palavras: ["skill", "skills", "habilidade", "habilidades", "o que sao", "biblioteca", "skill.md"],
    resposta:
      "**Skills** são habilidades que você ensina ao Claude, escritas em Markdown. Em vez de colocar todas as instruções num prompt gigante, o Claude **carrega só a skill de que precisa, na hora em que precisa**.\n\nIsso poupa a **janela de contexto**: ele lê primeiro só o nome e a descrição, e só abre o resto do arquivo se a skill for relevante para a tarefa.\n\nPense numa biblioteca de passo a passos que o Claude consulta sob demanda.",
  },
  {
    id: "criar-skill",
    cat: "Skills",
    titulo: "Como criar uma Skill?",
    palavras: ["criar skill", "nova skill", "fazer skill", "escrever skill", "skill.md", "pasta skills", "estrutura"],
    resposta:
      "Cada skill ganha **uma pasta**, e dentro dela um arquivo chamado `SKILL.md`:\n\n```\n.claude/\n  skills/\n    briefing-make/\n      SKILL.md\n```\n\nO arquivo tem um frontmatter no topo e depois as instruções:\n\n```\n---\nname: briefing-make\ndescription: Gera um briefing completo a partir das instruções do usuário. Use quando o usuário tiver uma ideia que precisa ser elaborada.\n---\n\n1. Faça isto\n2. Depois isto\n3. Por fim isto\n```\n\nO nome do arquivo é sempre `SKILL.md`; o Claude identifica a skill pelo **nome da pasta**.\n\nAtalho: peça para o próprio Claude criar a primeira versão e depois você lê e melhora.",
  },
  {
    id: "skill-onde",
    cat: "Skills",
    titulo: "Onde ficam as skills (usuário x projeto)?",
    palavras: ["onde ficam", "pasta usuario", "global", "projeto", "pessoal", "enterprise", "plugin", "nivel"],
    resposta:
      "Depende do **nível**:\n\n- **Pessoal (usuário):** `~/.claude/skills/` — vale para todos os projetos.\n- **Projeto:** `.claude/skills/` dentro do projeto — só vale ali.\n- **Plugin:** dentro da pasta do plugin.\n- **Enterprise:** configuração central da empresa.\n\n**Dica:** deixe no nível de usuário só o que serve para qualquer projeto (commit, push, preparar o projeto). Habilidades específicas ficam no projeto, assim o Claude não precisa avaliar skills inúteis a cada conversa.",
  },
  {
    id: "descricao-skill",
    cat: "Skills",
    titulo: "Por que a descrição da skill é tão importante?",
    palavras: ["descricao", "description", "quando usar", "nao ativa", "nao usa", "skill nao funciona", "ativar"],
    resposta:
      "O Claude lê **primeiro o nome e a descrição**. Se a descrição mostrar que a skill é relevante para a tarefa, ele lê o arquivo inteiro; se não, ele ignora.\n\nPor isso, escreva a descrição com precisão e inclua **quando usar**:\n\n```\ndescription: Gera relatórios semanais de status. Use quando pedirem atualizações ou resumos de progresso.\n```\n\nSe uma skill \"não dispara\", o primeiro suspeito é uma descrição vaga.",
  },
  {
    id: "frontmatter",
    cat: "Skills",
    titulo: "O que é o frontmatter e quais campos existem?",
    palavras: ["frontmatter", "front matter", "tres tracos", "---", "campos", "yaml", "cabecalho", "allowed-tools", "model", "disable-model-invocation"],
    resposta:
      "O **frontmatter** é o bloco entre `---` e `---` no topo do arquivo. É a primeira coisa que a IA lê para decidir se precisa do resto, então mantenha-o **curto e direto**.\n\nCampos comuns (varia entre skill e subagent; confira a documentação):\n- `name` e `description`\n- `model` — qual modelo usar\n- `allowed-tools` / `tools` — ferramentas permitidas\n- `permissionMode` — nível de permissão (subagents)\n- `skills` — skills que o agente pode usar (subagents)\n- `disable-model-invocation: true` — a skill só roda quando **você** pedir\n- `hooks` — automações\n\nExemplo:\n\n```\n---\nname: gerar-quiz\ndescription: Cria um quiz sobre um tema.\ndisable-model-invocation: true\n---\n```",
  },
  {
    id: "subagents",
    cat: "Agentes",
    titulo: "O que são subagents (agentes)?",
    palavras: ["subagent", "subagents", "agente", "agentes", "o que sao", "identidade", "time de agentes", "hierarquia"],
    resposta:
      "O Claude Code já é um agente. Os **subagents** são agentes **seus**, que o Claude pode chamar para tarefas específicas.\n\nCada subagent tem:\n- uma **identidade** e função (ex.: \"avaliador de respostas\")\n- suas próprias **permissões** e ferramentas\n- sua **própria janela de contexto**, separada da conversa principal\n\nVocê pode montar um time com hierarquia: um agente líder que delega para os outros.",
  },
  {
    id: "criar-agente",
    cat: "Agentes",
    titulo: "Como criar um subagent?",
    palavras: ["criar agente", "novo agente", "fazer agente", "pasta agents", "/agents", "agents", "estrutura agente"],
    resposta:
      "Crie um arquivo Markdown dentro de `.claude/agents/`. Diferente das skills, **não precisa de subpasta**:\n\n```\n.claude/\n  agents/\n    avaliador-de-respostas.md\n```\n\nConteúdo:\n\n```\n---\nname: avaliador-de-respostas\ndescription: Avalia respostas de estudantes e dá feedback. Use depois de um exercício.\ntools: Read, Grep\nmodel: sonnet\n---\n\nVocê é um avaliador de respostas. Seu trabalho é...\n```\n\nVocê também pode digitar `/agents` no Claude Code para criar e gerenciar agentes por um assistente, ou simplesmente pedir em linguagem natural.",
  },
  {
    id: "skill-vs-agente",
    cat: "Agentes",
    titulo: "Qual a diferença entre skill e agente?",
    palavras: ["diferenca", "skill ou agente", "skill vs agente", "quando usar", "comparar", "versus"],
    resposta:
      "- **Skill** = um **passo a passo / conhecimento** que o Claude carrega quando precisa (o \"como fazer\").\n- **Subagent** = um **trabalhador** com identidade, permissões e contexto próprios (o \"quem faz\").\n\nNa prática, eles se combinam: um agente pode ter acesso a skills específicas.\n\nRegra rápida: precisa de uma **receita reutilizável**? Skill. Precisa **delegar** uma tarefa isolada, com contexto limpo? Subagent.",
  },
  {
    id: "paralelo",
    cat: "Agentes",
    titulo: "Como rodar agentes em paralelo?",
    palavras: ["agentes em paralelo", "agentes paralelo", "paralelo", "paralelizacao", "paralelizar", "delegar", "varios agentes", "ao mesmo tempo", "simultaneo"],
    resposta:
      "Peça em linguagem natural, por exemplo:\n\n> Crie os agentes e as skills necessárias para este projeto. Faça isso em paralelização. Você não executa, apenas delega.\n\nO Claude líder invoca vários outros, cada um com **janela de contexto zerada** e focado em uma única tarefa. Isso preserva o contexto da conversa principal.\n\nEle vai pedir permissão para criar pastas e arquivos conforme avança.",
  },
  {
    id: "claude-md",
    cat: "Projeto",
    titulo: "O que é o CLAUDE.md?",
    palavras: ["claude.md", "claude md", "indice", "memoria do projeto", "contexto do projeto", "arquivo de contexto"],
    resposta:
      "O **CLAUDE.md** é um arquivo na raiz do projeto que funciona como **índice e memória**: diz ao Claude o que é o projeto, a arquitetura, onde ficam as coisas e as convenções.\n\nEle é lido no início de cada conversa, então mantenha-o **enxuto** e aponte para outros arquivos em vez de copiar tudo para dentro dele.",
  },
  {
    id: "init",
    cat: "Projeto",
    titulo: "Para que serve o /init?",
    palavras: ["/init", "init", "gerar claude.md", "inicializar"],
    resposta:
      "O `/init` analisa o projeto e **cria o `CLAUDE.md`** automaticamente.\n\nFluxo sugerido no vídeo:\n1. Descreva a ideia e peça um **briefing**\n2. Rode `/clear`\n3. Rode `/init`\n4. Peça para criar agentes e skills\n\nMesmo com a pasta quase vazia, ele usa o briefing como contexto.",
  },
  {
    id: "comandos",
    cat: "Comandos",
    titulo: "Quais os principais comandos (/)?",
    palavras: ["comandos", "slash", "barra", "lista de comandos", "/help", "/clear", "/skills", "/agents", "/init", "/compact", "/model", "/mcp"],
    resposta:
      "Os mais usados:\n\n- `/help` — ajuda e lista de comandos\n- `/clear` — limpa a conversa e o contexto\n- `/compact` — resume a conversa para liberar contexto\n- `/init` — cria o `CLAUDE.md`\n- `/agents` — gerencia subagents\n- `/skills` — lista as skills disponíveis\n- `/model` — troca o modelo\n- `/mcp` — gerencia conexões MCP\n- `/permissions` — ajusta permissões\n\nDigite `/` no Claude Code para ver a lista completa da sua versão.",
  },
  {
    id: "clear-compact",
    cat: "Comandos",
    titulo: "Qual a diferença entre /clear e /compact?",
    palavras: ["clear", "compact", "limpar", "resumir", "diferenca", "contexto cheio"],
    resposta:
      "- `/clear` **apaga** a conversa e começa do zero (mantém o `CLAUDE.md`).\n- `/compact` **resume** a conversa e continua com um contexto menor.\n\nUse `/clear` ao mudar de assunto e `/compact` quando quiser seguir no mesmo trabalho sem perder o fio.",
  },
  {
    id: "janela-contexto",
    cat: "Conceitos",
    titulo: "O que é janela de contexto e por que ela importa?",
    palavras: ["janela de contexto", "contexto", "tokens", "token", "decaimento", "alucina", "alucinacao", "cheia", "limite"],
    resposta:
      "A **janela de contexto** é tudo o que a IA \"tem na cabeça\" na conversa: system prompt, `CLAUDE.md`, instruções, arquivos lidos e o histórico.\n\nQuanto mais ela enche, **pior tende a ficar o desempenho**: respostas mais fracas, mais alucinação e mais gasto de tokens. Mesmo modelos com 1 milhão de tokens sofrem esse decaimento.\n\nComo manter saudável:\n- use **skills** (carregam sob demanda)\n- use **subagents** (contexto separado)\n- use `/clear` e `/compact`\n- mantenha o `CLAUDE.md` curto",
  },
  {
    id: "mcp",
    cat: "Conceitos",
    titulo: "O que é MCP?",
    palavras: ["mcp", "model context protocol", "conectar ferramentas", "integracao", "api", "conectores"],
    resposta:
      "**MCP (Model Context Protocol)** é um protocolo criado pela Anthropic (2024) para conectar a IA a **ferramentas e dados externos** (GitHub, bancos de dados, Notion, Figma...) de forma padronizada.\n\nÉ o que permite ao Claude \"ter braços\": chamar ferramentas e executar tarefas fora do chat.\n\nGerencie as conexões com o comando `/mcp`.",
  },
  {
    id: "hooks",
    cat: "Conceitos",
    titulo: "O que são hooks?",
    palavras: ["hook", "hooks", "gancho", "ganchos", "automacao", "automatico", "antes de", "depois de"],
    resposta:
      "**Hooks** são comandos que o **Claude Code executa automaticamente** em momentos específicos (por exemplo, antes ou depois de usar uma ferramenta, ou quando termina de responder).\n\nSão configurados em `settings.json` e servem para formatar código, bloquear ações, notificar você etc. Como é o *harness* que executa, é mais confiável do que pedir \"sempre faça X\" no prompt.",
  },
  {
    id: "plan-mode",
    cat: "Comandos",
    titulo: "O que é o Plan Mode?",
    palavras: ["plan mode", "modo plano", "planejar", "plano", "shift tab", "shift+tab"],
    resposta:
      "No **Plan Mode** o Claude **só planeja**: lê o projeto e propõe um plano, sem editar nada até você aprovar.\n\nEle demora um pouco mais, mas compensa em tarefas grandes. Alterne os modos com **Shift+Tab** (por exemplo, modo de aceitar edições automaticamente).",
  },
  {
    id: "permissoes",
    cat: "Projeto",
    titulo: "Como funcionam as permissões?",
    palavras: ["permissao", "permissoes", "permission", "aceitar edicoes", "bypass", "permitir", "pedir permissao", "seguranca"],
    resposta:
      "Por padrão o Claude **pede permissão** antes de criar arquivos, rodar comandos etc. Você pode:\n\n- aprovar caso a caso\n- usar o modo de **aceitar edições** (Shift+Tab)\n- configurar regras de permitir/negar em `settings.json` ou com `/permissions`\n\nEm subagents, o campo `permissionMode` define o nível de cada agente. Evite modos que ignoram permissões, a menos que saiba bem o que está fazendo.",
  },
  {
    id: "modelos",
    cat: "Conceitos",
    titulo: "Quais modelos posso usar (Opus, Sonnet, Haiku)?",
    palavras: ["modelo", "modelos", "opus", "sonnet", "haiku", "qual modelo", "trocar modelo", "/model"],
    resposta:
      "A família Claude tem modelos de tamanhos diferentes: em geral **Opus** (mais capaz), **Sonnet** (equilíbrio) e **Haiku** (mais rápido e barato).\n\nVocê troca com `/model`, ou fixa um modelo por agente/skill com o campo `model` no frontmatter. Uma boa estratégia é usar um modelo menor em agentes simples e o maior em tarefas difíceis.",
  },
  {
    id: "briefing",
    cat: "Projeto",
    titulo: "Como começar um projeto do zero com o Claude?",
    palavras: ["comecar projeto", "novo projeto", "briefing", "passo a passo", "fluxo", "workflow", "do zero", "exemplo"],
    resposta:
      "Um fluxo simples (o do vídeo):\n\n1. Crie uma pasta e abra no seu editor/terminal\n2. Rode `claude`\n3. Explique a ideia e peça um **briefing** (opcional: `Plan Mode`)\n4. `/clear` e depois `/init` → cria o `CLAUDE.md`\n5. Peça: \"crie os agentes e skills necessários, em paralelo\"\n6. Confira com `/agents` e `/skills`\n7. Leia, ajuste os arquivos e refine\n\nNão precisa acertar de primeira — comece simples e evolua.",
  },
  {
    id: "estrutura-pastas",
    cat: "Projeto",
    titulo: "Qual a estrutura de pastas de agentes e skills?",
    palavras: ["estrutura", "pastas", "arquitetura", ".claude", "diretorio", "onde colocar"],
    resposta:
      "```\nmeu-projeto/\n  CLAUDE.md\n  briefing.md\n  .claude/\n    agents/\n      explicador.md          ← arquivo direto\n      avaliador.md\n    skills/\n      gerar-quiz/\n        SKILL.md             ← pasta + SKILL.md\n      plano-de-estudos/\n        SKILL.md\n```\n\n**Agentes:** o `.md` fica direto em `agents/`.\n**Skills:** cada uma tem uma pasta com um `SKILL.md` dentro.",
  },
  {
    id: "melhores-praticas",
    cat: "Dicas",
    titulo: "Dicas para escrever boas instruções",
    palavras: ["dicas", "boas praticas", "melhorar", "otimizar", "escrever instrucoes", "prompt", "como escrever"],
    resposta:
      "- Seja **específico** na descrição (o que faz e quando usar)\n- Instruções em **passos numerados** e claros\n- Uma skill/agente = **uma responsabilidade**\n- Mantenha o frontmatter **curto**\n- Peça para a IA gerar a primeira versão, **leia** e ajuste\n- Teste com tarefas reais e refine\n- Se você ainda não tem um método, peça para o Claude propor um framework",
  },
  {
    id: "erros-comuns",
    cat: "Dicas",
    titulo: "Minha skill ou agente não aparece / não funciona",
    palavras: ["nao aparece", "nao funciona", "erro", "problema", "bug", "nao carrega", "nao reconhece", "travou"],
    resposta:
      "Checklist rápido:\n\n1. O arquivo está no lugar certo? (`.claude/agents/x.md` ou `.claude/skills/x/SKILL.md`)\n2. O nome da skill é exatamente `SKILL.md` (maiúsculas)?\n3. O frontmatter tem `---` em cima e embaixo, com `name` e `description`?\n4. Rode `/skills` ou `/agents` para ver se ele listou\n5. Reinicie o Claude (`/clear` ou abra um novo) — às vezes ele não recarrega\n6. A descrição está clara sobre **quando** usar?\n7. Há `disable-model-invocation: true`? Então só roda se você pedir",
  },
  {
    id: "historia",
    cat: "Conceitos",
    titulo: "Qual a diferença entre assistente, agente e agente de código?",
    palavras: ["assistente", "historia", "evolucao", "agente de codigo", "chatgpt", "2022", "era dos agentes"],
    resposta:
      "- **Assistente** (2022–2024): você pergunta, a IA responde.\n- **Agente** (2025): a IA usa **ferramentas** (via MCP/APIs) e executa tarefas.\n- **Agente de código** (fim de 2025 em diante): agentes que vivem no terminal e nas IDEs, como o Claude Code.\n\nCom o crescimento dos agentes, surgiu o desafio de gerenciar a janela de contexto — e daí vieram as **skills**.",
  },
];

// Perguntas sugeridas na tela inicial.
window.SUGESTOES = [
  "O que são Skills?",
  "Como criar um subagent?",
  "Qual a diferença entre skill e agente?",
  "Para que serve o CLAUDE.md?",
  "Como rodar agentes em paralelo?",
  "O que é MCP?",
];
