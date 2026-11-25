const C = window.Confia;

document.getElementById("jogo").innerHTML = C.Capa({
  emocao: "animado",
  conteudo: `<p class="capa__frase">Nem tudo na internet é o que parece.</p>
    <div class="capa__acoes">${C.Botao("Jogar", { primario: true, centro: true, acao: "jogar" })}${C.Botao("Créditos", { centro: true, acao: "creditos" })}</div>`,
});
