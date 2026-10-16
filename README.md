# Teste de Chatbot

Chatbot em português para tirar dúvidas sobre o Claude Code: skills, subagents, `CLAUDE.md`, MCP, hooks, comandos e mais.

Site estático (HTML, CSS e JavaScript), sem backend e sem chave de API. As respostas vêm de uma base de conhecimento local.

## Como usar

Abra o `index.html` no navegador.

## Como adicionar conteúdo

Edite `kb.js` e copie uma entrada existente, mudando:

- `titulo`: a pergunta
- `palavras`: sinônimos que as pessoas podem digitar
- `resposta`: o texto da resposta (Markdown simples)

## Arquivos

- `index.html`: a página
- `style.css`: o visual (tema claro e escuro)
- `app.js`: busca e interface do chat
- `kb.js`: base de conhecimento

Para detalhes e novidades, consulte a [documentação oficial](https://docs.claude.com/pt-BR/docs/claude-code).
