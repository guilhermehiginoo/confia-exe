# Confia? · Ideia do jogo

## Em uma frase

O jogador entra no **FaceCookie**, uma rede social fictícia, e segue uma história linear guiado pelo **Biscoitinho**, um "assistente" simpático que sempre sugere o caminho mais fácil, que também é o mais arriscado. No fim, descobre que o Biscoitinho é um cookie de rastreamento e que estava anotando tudo.

## Público e objetivo

- **Público:** 8º ano (13 anos).
- **BNCC:** Computação, habilidade EF08CO10.
- **O que ensina:** criar senhas fortes e usar verificação em duas etapas, proteger dados pessoais no perfil, ler termos e permissões, reconhecer links e mensagens de golpe, confirmar pedidos estranhos por outro canal.

## O que mudou

| Antes | Agora |
|---|---|
| Computador fictício, o **Confia OS**, com área de trabalho e janelas | Rede social fictícia, o **FaceCookie** |
| Apps separados (Pixelgram, ZipZap) | Tudo acontece dentro do FaceCookie: feed, perfil, mensagens diretas, notificações e apps parceiros |
| Pixel art | Estilo Brutal laranja e roxo (bordas grossas, sombra chapada), pensado pra celular e computador |
| Navegação livre pela área de trabalho | Fluxo linear: uma tela por vez, com barra de progresso |

O roteiro original está no Drive ("Confia? Roteiro do jogo"). As fases continuam as mesmas; só o cenário muda. A adaptação está em [FASES.md](FASES.md).

## Falando com quem tem 13 anos

Tudo no jogo (falas, botões, posts, lições) é escrito pra esse público:

- **Situações da vida deles.** Skin e gemas de jogo, foto com o uniforme, colega da turma, grupo da sala, quiz de "que biscoito você seria". Nada de banco, imposto ou e-mail de trabalho.
- **Linguagem de rede social, sem forçar.** Frases curtas, "kkkkk", "mano", emoji onde caberia numa conversa real. Gíria demais envelhece rápido e soa como adulto tentando ser jovem.
- **Lição em uma frase.** Sem termo técnico sem explicação ("phishing" só aparece junto de "golpe do link falso").
- **Sem sermão e sem medo.** O jogo mostra a consequência e explica; não culpa o jogador. Errar faz parte e o final sempre ensina.
- **Humor como isca.** O Biscoitinho é engraçado, e as cláusulas absurdas (metade do lanche, filho chamado QuizMania Júnior) prendem a atenção pra chegar nas sérias.
- **Leitura rápida.** Pouco texto por tela; quem quiser saber mais toca em "por quê?".
- **Seguro pra sala de aula.** Nada de conteúdo adulto, violência ou golpes que ensinem a aplicar golpe. O foco é reconhecer e se proteger.

## Como o jogo funciona

- **Uma tela por vez.** O jogador nunca escolhe "pra onde ir". Cada cena chega como algo da rede social: uma notificação, um post, uma mensagem direta.
- **Três caminhos por fase.** Seguir o Biscoitinho, investigar antes de decidir ou agir com segurança.
- **Corações e migalhas.**
  - Fase bem resolvida dá **1 coração** pra batalha final.
  - Cada escolha arriscada vira uma **migalha**: um dado que o Biscoitinho guarda e revela no final.
- **Consequências atrasadas.** Algumas escolhas só pesam depois (a senha fraca da fase 1 volta na fase 5).
- **Dados sempre fictícios.** O jogador nunca digita dado real. Campos de perfil vêm preenchidos com dados de mentira, e o jogador decide o que mostra ou esconde. Senha e usuário são inventados, com o aviso "Isto é um jogo".

## O Biscoitinho

- Simpático, engraçado, sempre com pressa.
- Dá **uma dica verdadeira** no começo (instalar atualizações) para ganhar a confiança do jogador antes dos conselhos ruins.
- Reage às escolhas: comemora quando o jogador cai, fica emburrado quando o jogador se protege.
- Tem 10 expressões prontas em `assets/biscoitinho/web/`: animado, bravo, confiante, confuso, nervoso, rindo, sono, surpreso, tímido e triste.

## Identidade visual

- **Estilo:** Brutal laranja e roxo. Referência em `componentes.html` e `estilos/linear.html`.
- **Celular:** uma coluna, com o Biscoitinho e as escolhas embaixo, onde o polegar alcança.
- **Computador:** conteúdo à esquerda e coluna lilás do Biscoitinho à direita.
- **FaceCookie não imita o Facebook.** Nada de azul nem do logo deles; a marca é laranja e roxo.
- **Acessibilidade:** texto de no mínimo 16px, botões de no mínimo 48px, escolhas com texto (nunca só cor), funciona com teclado e respeita "reduzir movimento".

## Licença e créditos

CC BY-NC-SA 4.0. Instituto Metrópole Digital · Universidade Federal do Rio Grande do Norte. Disciplina IMD0530, prof. Dennys Leite Maia. Autores no [README](../README.md).
