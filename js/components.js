(function () {
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  console.assert(esc('<a href="x">') === "&lt;a href=&quot;x&quot;&gt;", "esc quebrou");

  const PASTA_BISCOITINHO = "assets/biscoitinho/web/";
  const EMOCOES = ["animado", "bravo", "confiante", "confuso", "nervoso", "rindo", "sono", "surpreso", "timido", "triste"];

  const Tela = ({ cena, total, conteudo, lateral = "" }) => `
    <div class="tela">
      ${cena ? Topo(cena, total) : ""}
      <div class="tela__corpo">
        <main class="tela__conteudo">${conteudo}</main>
        ${lateral ? `<aside class="tela__lateral">${lateral}</aside>` : ""}
      </div>
    </div>`;

  const Topo = (cena, total) => `
    <header class="topo">
      <div class="topo__linha">Confia?<span class="topo__cena">Cena ${+cena} de ${+total}</span></div>
      <div class="progresso" role="progressbar" aria-label="Progresso" aria-valuemin="1" aria-valuemax="${+total}" aria-valuenow="${+cena}">
        <span class="progresso__barra" style="width:${(cena / total) * 100}%"></span>
      </div>
    </header>`;

  const Card = ({ icone = "", titulo, selo = "", variante = "", conteudo }) => `
    <article class="card">
      <div class="card__topo${variante ? ` card__topo--${variante}` : ""}">${esc(icone)} ${esc(titulo)}${selo ? `<span class="card__selo">${esc(selo)}</span>` : ""}</div>
      <div class="card__corpo">${conteudo}</div>
    </article>`;

  const Titulo = (texto) => `<h2 class="card__titulo">${esc(texto)}</h2>`;
  const Texto = (texto) => `<p style="margin:0">${esc(texto)}</p>`;
  const Mensagem = (texto, { minha = false } = {}) => `<div class="mensagem${minha ? " mensagem--minha" : ""}">${esc(texto)}</div>`;

  const Endereco = (antes, suspeito = "", depois = "") =>
    `<span class="endereco">${esc(antes)}${suspeito ? `<mark class="suspeito">${esc(suspeito)}</mark>` : ""}${esc(depois)}</span>`;

  const Biscoitinho = (emocao, fala) => {
    if (!EMOCOES.includes(emocao)) throw new Error(`Emoção desconhecida: ${emocao}`);
    return `
    <div class="biscoitinho">
      <img class="biscoitinho__img" src="${PASTA_BISCOITINHO}${emocao}.png" alt="Biscoitinho, ${emocao}">
      ${fala ? `<p class="fala"><b>Biscoitinho:</b> ${esc(fala)}</p>` : ""}
    </div>`;
  };

  const Botao = (texto, { acao = "", primario = false, centro = false } = {}) =>
    `<button type="button" class="botao${primario ? " botao--primario" : ""}${centro ? " botao--centro" : ""}"${acao ? ` data-acao="${esc(acao)}"` : ""}>${esc(texto)}</button>`;

  const Escolhas = (pergunta, botoes) => `
    <nav class="escolhas" aria-label="Sua escolha">
      ${pergunta ? `<p class="escolhas__pergunta">${esc(pergunta)}</p>` : ""}
      ${botoes}
    </nav>`;

  const Campo = ({ id, rotulo, tipo = "text", placeholder = "" }) => `
    <label class="campo" for="${esc(id)}">${esc(rotulo)}
      <input class="campo__input" id="${esc(id)}" name="${esc(id)}" type="${esc(tipo)}" placeholder="${esc(placeholder)}" autocomplete="off">
    </label>`;

  const Etiqueta = (texto, { acao = "" } = {}) =>
    `<button type="button" class="etiqueta"${acao ? ` data-acao="${esc(acao)}"` : ""}>${esc(texto)}</button>`;

  const Lista = (itens) => `<ol class="lista">${itens.map((i) => `<li>${esc(i)}</li>`).join("")}</ol>`;

  const Medidor = (rotulo, valor) => `
    <div class="medidor">${esc(rotulo)}
      <span class="medidor__trilho" role="meter" aria-label="${esc(rotulo)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${+valor}">
        <span class="medidor__valor" style="width:${Math.max(0, Math.min(100, valor))}%"></span>
      </span>
    </div>`;

  const Logo = ({ pequeno = false } = {}) => `<h1 class="logo${pequeno ? " logo--pequeno" : ""}">Confia<em>?</em></h1>`;

  const Capa = ({ emocao, conteudo, logoPequeno = false, rodape = "" }) => `
    <div class="tela">
      <main class="capa">
        ${Logo({ pequeno: logoPequeno })}
        <img class="capa__img" src="${PASTA_BISCOITINHO}${emocao}.png" alt="Biscoitinho, ${emocao}">
        ${conteudo}
      </main>
      ${rodape ? `<footer class="rodape">${rodape}</footer>` : ""}
    </div>`;

  const Creditos = (autores, licenca) => `
    <p class="rodape__autores">${autores.map(esc).join(" · ")}</p>
    <p class="rodape__licenca">Instituto Metrópole Digital · Universidade Federal do Rio Grande do Norte · <a href="${esc(licenca.url)}" target="_blank" rel="noopener">${esc(licenca.nome)}</a></p>`;

  const Carregando = (pct) => `
    <div class="carregando" role="progressbar" aria-label="Carregando" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${+pct}">
      <span class="carregando__barra" style="width:${+pct}%"></span>
    </div>
    <p class="capa__frase">Carregando… ${+pct}%</p>`;

  const Dica = (texto) => `<p class="dica"><b>Dica:</b> ${esc(texto)}</p>`;

  window.Confia = { esc, Tela, Topo, Card, Titulo, Texto, Mensagem, Endereco, Biscoitinho, Botao, Escolhas, Campo, Etiqueta, Lista, Medidor, Logo, Capa, Creditos, Carregando, Dica, EMOCOES };
})();
