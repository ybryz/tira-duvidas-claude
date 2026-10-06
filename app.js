(function () {
  const KB = window.KB;
  const $ = (id) => document.getElementById(id);
  const messages = $("messages");
  const form = $("form");
  const input = $("input");
  const sidebar = $("sidebar");
  const backdrop = $("backdrop");

  // ---------- Busca ----------
  const STOP = new Set(
    ("a o as os um uma uns umas de do da dos das em no na nos nas por para pra com sem sobre e ou que qual quais " +
      "como quando onde porque por que eh e eu voce me meu minha seu sua ao aos ser sao tem ter fazer faco " +
      "posso pode podem preciso quero queria gostaria usar uso").split(" ")
  );

  const norm = (s) =>
    s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9/.\-\s]/g, " ");

  const tokens = (s) =>
    norm(s).split(/\s+/).filter((t) => t.length > 1 && !STOP.has(t));

  const stem = (t) => (t.length > 4 ? t.replace(/(s|es|ns)$/, "") : t);

  const index = KB.map((e) => ({
    e,
    kwPhrases: e.palavras.map(norm).map((p) => p.trim()),
    kwTokens: new Set(e.palavras.flatMap(tokens).map(stem)),
    titleTokens: new Set(tokens(e.titulo).map(stem)),
    bodyTokens: new Set(tokens(e.resposta).map(stem)),
  }));

  function search(query) {
    const q = norm(query);
    const qt = [...new Set(tokens(query).map(stem))];
    if (!qt.length) return [];
    const scored = index.map((it) => {
      let score = 0;
      for (const p of it.kwPhrases) if (p.length > 2 && q.includes(p)) score += 6;
      if (q.includes(norm(it.e.titulo).trim())) score += 10;
      for (const t of qt) {
        if (it.titleTokens.has(t)) score += 3;
        if (it.kwTokens.has(t)) score += 3;
        if (it.bodyTokens.has(t)) score += 0.5;
      }
      return { e: it.e, score };
    });
    return scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  }

  // ---------- Markdown simples (seguro: escapa HTML antes) ----------
  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function inline(s) {
    return esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(https?:\/\/[^\s<)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  }

  function render(md) {
    const lines = md.split("\n");
    let html = "";
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith("```")) {
        const buf = [];
        i++;
        while (i < lines.length && !lines[i].startsWith("```")) buf.push(lines[i++]);
        i++;
        html += "<pre><code>" + esc(buf.join("\n")) + "</code></pre>";
      } else if (/^- /.test(line)) {
        html += "<ul>";
        while (i < lines.length && /^- /.test(lines[i])) html += "<li>" + inline(lines[i++].slice(2)) + "</li>";
        html += "</ul>";
      } else if (/^\d+\. /.test(line)) {
        html += "<ol>";
        while (i < lines.length && /^\d+\. /.test(lines[i]))
          html += "<li>" + inline(lines[i++].replace(/^\d+\. /, "")) + "</li>";
        html += "</ol>";
      } else if (line.startsWith("> ")) {
        html += "<blockquote>" + inline(line.slice(2)) + "</blockquote>";
        i++;
      } else if (line.trim() === "") {
        i++;
      } else {
        const buf = [];
        while (i < lines.length && lines[i].trim() !== "" && !/^(- |\d+\. |> |```)/.test(lines[i])) buf.push(lines[i++]);
        html += "<p>" + buf.map(inline).join("<br>") + "</p>";
      }
    }
    return html;
  }

  // ---------- UI ----------
  function scrollDown() {
    messages.scrollTop = messages.scrollHeight;
  }

  function addMsg(role, html, extra) {
    const wrap = document.createElement("div");
    wrap.className = "msg " + role;
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerHTML = html;
    wrap.appendChild(bubble);
    if (extra) wrap.appendChild(extra);
    messages.appendChild(wrap);
    scrollDown();
    return wrap;
  }

  function chips(questions) {
    const box = document.createElement("div");
    box.className = "chips";
    questions.forEach((q) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = q;
      b.addEventListener("click", () => ask(q));
      box.appendChild(b);
    });
    return box;
  }

  function welcome() {
    addMsg(
      "bot",
      "<p>Oi! 👋 Eu tiro dúvidas sobre o <strong>Claude</strong>: skills, agentes, <code>CLAUDE.md</code>, MCP, hooks, comandos e mais.</p><p>Escolha uma pergunta abaixo, um tópico no menu, ou escreva a sua.</p>",
      chips(window.SUGESTOES)
    );
  }

  function answer(query) {
    const results = search(query);
    const best = results[0];
    if (!best || best.score < 3) {
      const sugg = (results.length ? results : KB.map((e) => ({ e })))
        .slice(0, 4)
        .map((r) => r.e.titulo);
      return addMsg(
        "bot",
        "<p>Não encontrei uma resposta boa para isso na minha base. 😕 Tente reformular com palavras como <em>skill</em>, <em>agente</em>, <em>MCP</em>, <em>hooks</em> ou <em>CLAUDE.md</em>.</p><p>Talvez você queira saber:</p>",
        chips(sugg)
      );
    }
    const related = results
      .slice(1)
      .filter((r) => r.score >= 3)
      .slice(0, 3)
      .map((r) => r.e.titulo);
    const html =
      '<div class="cat-tag">' + esc(best.e.cat) + "</div>" + render(best.e.resposta);
    addMsg("bot", html, related.length ? chips(related) : null);
  }

  function ask(text) {
    text = text.trim();
    if (!text) return;
    closeMenu();
    addMsg("user", "<p>" + esc(text) + "</p>");
    const typing = addMsg("bot", '<span class="dots"><span></span><span></span><span></span></span>');
    typing.classList.add("typing");
    setTimeout(() => {
      typing.remove();
      answer(text);
    }, 350);
  }

  // Menu lateral por categoria
  function buildTopics() {
    const byCat = {};
    KB.forEach((e) => (byCat[e.cat] = byCat[e.cat] || []).push(e));
    const nav = $("topics");
    Object.keys(byCat).forEach((cat) => {
      const h = document.createElement("h3");
      h.textContent = cat;
      const group = document.createElement("div");
      group.appendChild(h);
      byCat[cat].forEach((e) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = e.titulo;
        b.addEventListener("click", () => ask(e.titulo));
        group.appendChild(b);
      });
      nav.appendChild(group);
    });
  }

  function openMenu() {
    sidebar.classList.add("open");
    backdrop.hidden = false;
  }
  function closeMenu() {
    sidebar.classList.remove("open");
    backdrop.hidden = true;
  }

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const v = input.value;
    input.value = "";
    ask(v);
  });
  $("clearBtn").addEventListener("click", () => {
    messages.innerHTML = "";
    welcome();
  });
  $("menuBtn").addEventListener("click", openMenu);
  backdrop.addEventListener("click", closeMenu);

  buildTopics();
  welcome();
  input.focus();
})();
