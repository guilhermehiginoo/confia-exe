const C = window.Confia;

document.getElementById("jogo").innerHTML = C.Capa({
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
