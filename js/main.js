const C = window.Confia;
const jogo = document.getElementById("jogo");
// Escolhas da partida, usadas depois no dossiê.
const partida = { usuario: "", forcaSenha: 0, leuTermos: false, aceitouTermos: false };

const forcaDaSenha = (senha, usuario = "") => {
  if (!senha) return 0;
  const comum = /^(123456|12345678|senha|password|qwerty|abc123|111111)/i.test(senha);
  const temUsuario = usuario.length >= 3 && senha.toLowerCase().includes(usuario.toLowerCase());
  if (comum || temUsuario) return 10;
  const tipos = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(senha)).length;
  let f = Math.min(100, senha.length * 4 + tipos * 10);
  if (/(abc|123|qwe|asd|senha|password)/i.test(senha)) f -= 25; // sequência óbvia
  if (/(19|20)\d\d/.test(senha)) f = Math.min(f, 30); // parece ano de nascimento
  if (senha.length < 8) f = Math.min(f, 35);
  return Math.max(5, f);
};
console.assert(forcaDaSenha("123456") === 10, "senha comum devia ser fraca");
console.assert(forcaDaSenha("ana2012", "ana") === 10, "senha com usuário devia ser fraca");
console.assert(forcaDaSenha("ana2012") < 40, "nome com ano devia ser fraca");
console.assert(forcaDaSenha("maria2010") < 40, "nome com ano devia ser fraca");
console.assert(forcaDaSenha("abcdefgh12") < 40, "sequência devia ser fraca");
console.assert(forcaDaSenha("gatoazul99") >= 40 && forcaDaSenha("gatoazul99") < 70, "devia ser média");
console.assert(forcaDaSenha("Biscoito#Azul-Voa9") === 100, "senha longa devia ser forte");

const nivel = (f) => (f < 40 ? "fraca" : f < 70 ? "média" : "forte");

// O Biscoitinho nunca manda errar de forma descarada: ele seduz pela comodidade.
const FALA_SENHA = {
  vazia: ["confiante", "Escolhe uma senha fácil de lembrar, tá? Senha esquecida é um saco."],
  fraca: ["confiante", "Usa seu nome com o ano que você nasceu! Assim você nunca esquece."],
  média: ["animado", "Tá ótima! Senha muito grande ninguém lembra, hein."],
  forte: ["confuso", "Nossa… vai lembrar disso amanhã? Depois não reclama, hein."],
};

// Pré-carrega as expressões pra troca ser instantânea, sem o Biscoitinho piscar.
C.EMOCOES.forEach((e) => (new Image().src = `assets/biscoitinho/web/${e}.png`));

// Troca só a imagem e a fala, no lugar: recriar o elemento faz a imagem sumir por um instante.
const trocarBiscoitinho = (emocao, fala) => {
  const img = jogo.querySelector(".biscoitinho__img");
  const balao = jogo.querySelector(".fala");
  if (!img || !balao) return;
  img.src = `assets/biscoitinho/web/${emocao}.png`;
  img.alt = `Biscoitinho, ${emocao}`;
  balao.innerHTML = `<b>Biscoitinho:</b> ${C.esc(fala)}`;
};

const telaInicio = () => {
  jogo.innerHTML = C.Capa({
    emocao: "animado",
    conteudo: `<p class="capa__frase">Nem tudo na internet é o que parece.</p>
      <div class="capa__acoes">${C.Botao("Jogar", { primario: true, centro: true, acao: "jogar" })}${C.Botao("Créditos", { centro: true, acao: "creditos" })}</div>`,
    rodape: C.Creditos(
      [
        "Guilherme Higino de Araújo Silva",
        "Igor Vinicius Silva de Oliveira",
        "Lázaro Gabriel Ewerton da Silva Santos",
        "Mariana Raquel de Morais",
        "Victor Emanuel Oliveira Silva",
      ],
      { nome: "CC BY-NC-SA 4.0", url: "https://creativecommons.org/licenses/by-nc-sa/4.0/" },
    ),
  });
};

const telaCadastro = () => {
  jogo.innerHTML = C.Tela({
    cena: 1, total: 12,
    conteudo: C.Card({ icone: "🍪", titulo: "Criar conta no FaceCookie", conteudo:
      C.Dica("isto é um jogo. Invente seu usuário e sua senha, não use os de verdade.") +
      C.Campo({ id: "usuario", rotulo: "Usuário", placeholder: "ex.: gato_veloz" }) +
      C.Campo({ id: "senha", rotulo: "Senha", tipo: "password", placeholder: "••••••••" }) +
      `<div id="forca" aria-live="polite">${C.Medidor("Senha: fraca", 0, { variante: "fraca" })}</div>` }),
    lateral: C.Biscoitinho(...FALA_SENHA.vazia) +
      C.Escolhas("", C.Botao("Criar conta", { primario: true, centro: true, acao: "criar-conta" })),
  });
};

const atualizarSenha = (e) => {
  const usuario = document.getElementById("usuario").value.trim();
  const f = forcaDaSenha(document.getElementById("senha").value, usuario);
  const n = nivel(f);
  document.getElementById("forca").innerHTML = C.Medidor(`Senha: ${n}`, f, { variante: n === "média" ? "media" : n });
  const fala = FALA_SENHA[document.getElementById("senha").value ? n : "vazia"];
  if (jogo.querySelector(".fala")?.textContent.includes(fala[1])) return;
  trocarBiscoitinho(...fala);
};

// Inspiradas em termos e experimentos reais (fontes no docs/FASES.md, fase 1).
const CLAUSULAS = [
  "§ 3.1 · O usuário entrega metade do lanche do recreio ao FaceCookie toda sexta-feira.",
  "§ 4.7 · Você dá ao FaceCookie uma licença mundial e gratuita para usar, copiar, modificar e distribuir tudo o que você posta.",
  "§ 6.2 · Você concorda em fazer 1.000 horas de serviço comunitário, incluindo limpar banheiros químicos de festival.",
  "§ 7.4 · O FaceCookie pode ler seus contatos e mandar convites em seu nome.",
  "§ 9.1 · Podemos usar seu nome e sua foto de perfil em anúncios, sem te pagar nada.",
  "§ 11.3 · Você não pode usar o FaceCookie para fabricar armas nucleares, químicas ou biológicas.",
  "§ 15.3 · Podemos usar sua localização mesmo com o app fechado.",
  "§ 17.8 · Podemos coletar dados do seu rosto e da sua voz nas fotos e vídeos que você posta, e até o jeito como você digita.",
  "§ 19.2 · Seus dados podem ser compartilhados com outras empresas do grupo FaceCookie e com parceiros.",
  "§ 23.6 · Você cede ao FaceCookie o seu primeiro filho, pela eternidade.",
  "§ 31.6 · Você entrega ao FaceCookie a sua alma imortal.",
  "§ 38.4 · Mesmo que você apague a conta, guardamos seus dados por tempo indeterminado.",
  "§ 47.0 · Podemos mudar estes termos sem avisar. Continuar usando significa concordar.",
];

const telaTermos = ({ lendo = false } = {}) => {
  jogo.innerHTML = C.Tela({
    cena: 2, total: 12,
    conteudo: C.Card({ icone: "📜", titulo: "Termos de uso", selo: "47 páginas", conteudo:
      C.Texto("Para usar o FaceCookie, você precisa aceitar os Termos de Uso e a Política de Privacidade.") +
      (lendo ? `<div class="termos" tabindex="0">${C.Lista(CLAUSULAS)}<p>… e mais 46 páginas.</p></div>` : "") }),
    lateral: C.Biscoitinho(lendo ? "nervoso" : "rindo", lendo ? "Ei! Ninguém lê isso, fecha aí!" : "Ninguém lê isso, clica em aceitar!") +
      C.Escolhas("", (lendo ? "" : C.Botao("Ler tudo", { centro: true, acao: "ler-termos" })) + `<button type="button" class="botao botao--primario botao--centro botao--gigante" data-acao="aceitar-termos">ACEITAR</button>`),
  });
};

const acoes = {
  jogar: telaCadastro,
  "criar-conta": () => {
    const usuario = document.getElementById("usuario");
    if (!usuario.value.trim()) return usuario.focus();
    partida.usuario = usuario.value.trim();
    partida.forcaSenha = forcaDaSenha(document.getElementById("senha").value, partida.usuario);
    telaTermos();
  },
  "ler-termos": () => { partida.leuTermos = true; telaTermos({ lendo: true }); },
  "aceitar-termos": () => {
    partida.aceitouTermos = true;
    console.log("partida", partida); // próxima fase ainda não existe
  },
};

// No PC, o Biscoitinho reage quando o mouse passa por cima de certos botões.
const REACOES_HOVER = {
  "aceitar-termos": ["animado", "Isso! Clica! Clica logo!"],
  "ler-termos": ["sono", "Ih, são 47 páginas… vai demorar uma eternidade."],
};
let antesDoHover = null;
jogo.addEventListener("mouseover", (e) => {
  const botao = e.target.closest("[data-acao]");
  const reacao = REACOES_HOVER[botao?.dataset.acao];
  if (!reacao || antesDoHover || !matchMedia("(hover: hover)").matches) return;
  const img = jogo.querySelector(".biscoitinho__img");
  antesDoHover = [img?.src.split("/").pop().replace(".png", ""), jogo.querySelector(".fala")?.textContent.replace(/^Biscoitinho:\s*/, "")];
  trocarBiscoitinho(...reacao);
});
jogo.addEventListener("mouseout", (e) => {
  const botao = e.target.closest("[data-acao]");
  if (!antesDoHover || !REACOES_HOVER[botao?.dataset.acao] || botao.contains(e.relatedTarget)) return;
  trocarBiscoitinho(...antesDoHover);
  antesDoHover = null;
});

jogo.addEventListener("click", (e) => {
  const acao = e.target.closest("[data-acao]")?.dataset.acao;
  if (!acao) return;
  antesDoHover = null;
  acoes[acao]?.();
});

jogo.addEventListener("input", (e) => (e.target.id === "senha" || e.target.id === "usuario") && atualizarSenha(e));

telaInicio();
