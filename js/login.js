/* ============================================================
   1. ESTADO DO JOGO (único objeto central)
   A senha NUNCA entra aqui: fica só em variável local da tela
   de login e é descartada ao entrar. Nada vai para
   localStorage nem para cookie.
   ============================================================ */
const estadoDoJogo = {
  fase: 'login',          // 'login' | 'boasVindas' | 'areaDeTrabalho' (próximas fases)
  usuario: 'Visitante',
  tentativas: 0,          // tentativas de entrar antes de criar uma senha válida
  forcaSenha: null,       // 'fraca' | 'media' | 'forte'
  tamanhoSenha: 0
};

/* ============================================================
   2. CONFIGURAÇÃO DAS REGRAS
   ============================================================ */
const MIN_CARACTERES = 12;
const FRASE_EXEMPLO = 'Meu gato Zeca pula 3 vezes no sofá!';
const PALAVRAS_COMUNS = [
  'visitante', 'senha', 'password', 'qwerty', 'admin', 'abc123',
  'letmein', 'iloveyou', 'brasil', 'cookie', 'biscoito', 'confia',
  'welcome', 'bemvindo', 'azerty', 'mudar', 'secret', 'segredo'
];
const FILEIRAS_TECLADO = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

/* ============================================================
   3. UTILITÁRIOS DE TEXTO
   ============================================================ */
// minúsculas, sem acentos
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
// troca "leet" (0→o, 1→i, 3→e, 4→a, 5→s, @→a, $→s) para pegar "s3nh@"
function destransformar(texto) {
  const mapa = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's', '!': 'i' };
  return normalizar(texto).replace(/[01345 7@$!]/g, c => mapa[c] || c);
}
function apenasAlfanumericos(texto) {
  return normalizar(texto).replace(/[^a-z0-9]/g, '');
}

/* ============================================================
   4. VERIFICAÇÕES DE SEQUÊNCIA / PALAVRAS COMUNS
   Retorna uma descrição curta do problema ou null.
   ============================================================ */
function acharPadraoFraco(senha) {
  const norm = normalizar(senha);
  const sem = apenasAlfanumericos(senha);
  const leet = destransformar(senha).replace(/[^a-z0-9]/g, '');

  for (const palavra of PALAVRAS_COMUNS) {
    if (norm.includes(palavra) || sem.includes(palavra) || leet.includes(palavra)) {
      return palavra === 'visitante'
        ? 'o nome “Visitante”'
        : 'a palavra comum “' + palavra + '”';
    }
  }
  // sequências crescentes ou decrescentes de 4+ (1234, 4321, abcd, dcba)
  for (let i = 0; i + 3 < sem.length; i++) {
    const c = [0, 1, 2, 3].map(k => sem.charCodeAt(i + k));
    const sobe = c.every((v, k) => k === 0 || v === c[k - 1] + 1);
    const desce = c.every((v, k) => k === 0 || v === c[k - 1] - 1);
    if (sobe || desce) return 'uma sequência como “' + sem.slice(i, i + 4) + '”';
  }
  // sequências do teclado (qwer, asdf...)
  for (const fileira of FILEIRAS_TECLADO) {
    for (let i = 0; i + 3 < fileira.length; i++) {
      const trecho = fileira.slice(i, i + 4);
      if (sem.includes(trecho) || sem.includes([...trecho].reverse().join(''))) {
        return 'uma sequência do teclado como “' + trecho + '”';
      }
    }
  }
  // repetição (aaaa, 1111)
  if (/(.)\1{3,}/.test(sem)) return 'um caractere repetido várias vezes';
  return null;
}

function ehFraseDeExemplo(senha) {
  return apenasAlfanumericos(senha).includes(apenasAlfanumericos(FRASE_EXEMPLO));
}

/* ============================================================
   5. AVALIAÇÃO DA SENHA
   ============================================================ */
function avaliarSenha(senha) {
  const padrao = acharPadraoFraco(senha);
  const exemplo = ehFraseDeExemplo(senha);

  // const requisitos = [
  //   {
  //     id: 'tamanho',
  //     texto: 'Pelo menos ' + MIN_CARACTERES + ' caracteres',
  //     ok: senha.length >= MIN_CARACTERES,
  //     ajuda: 'Faltam ' + Math.max(0, MIN_CARACTERES - senha.length) + ' caracteres. Que tal uma frase maior?'
  //   },
  //   {
  //     id: 'caixa',
  //     texto: 'Letra maiúscula e minúscula',
  //     ok: /[a-zà-ÿ]/.test(senha) && /[A-ZÀ-Ý]/.test(senha),
  //     ajuda: 'Misture letras maiúsculas e minúsculas.'
  //   },
  //   {
  //     id: 'numero',
  //     texto: 'Pelo menos um número',
  //     ok: /\d/.test(senha),
  //     ajuda: 'Inclua pelo menos um número, como 7 ou 2025.'
  //   },
  //   {
  //     id: 'simbolo',
  //     texto: 'Pelo menos um símbolo',
  //     ok: /[^A-Za-zÀ-ÿ0-9\s]/.test(senha),
  //     ajuda: 'Inclua um símbolo, como ! ? @ # ou %.'
  //   },
  //   {
  //     id: 'padrao',
  //     texto: 'Sem “Visitante”, sequências (123456) ou palavras comuns (senha, qwerty)',
  //     ok: senha.length > 0 && !padrao && !exemplo,
  //     ajuda: exemplo
  //       ? 'Essa é a frase de exemplo, e todo mundo já a viu. Crie a sua própria!'
  //       : 'Sua senha tem ' + padrao + '. Troque esse trecho por algo só seu.'
  //   }
  // ];

  const atendidos = requisitos.filter(r => r.ok).length;
  let nivel = 'fraca';
  if (atendidos === requisitos.length) nivel = 'forte';
  else if (atendidos >= 4) nivel = 'media';

  return { requisitos, atendidos, nivel, valida: atendidos === requisitos.length };
}

/* ============================================================
   6. RELÓGIO E DATA
   ============================================================ */
function iniciarRelogio() {
  const elHora = document.getElementById('relogio-hora');
  const elData = document.getElementById('relogio-data');
  function atualizar() {
    const agora = new Date();
    elHora.textContent = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    elData.textContent = agora.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  atualizar();
  setInterval(atualizar, 1000);
}

/* ============================================================
   7. TELA DE LOGIN (senha vive apenas dentro desta função)
   ============================================================ */
function iniciarTelaDeLogin() {
  let senhaAtual = '';        // única cópia da senha, só em memória
  let confirmacaoAtual = '';

  const campoSenha = document.getElementById('senha');
  const campoConfirmar = document.getElementById('confirmar');
  const linhaConfirmar = document.getElementById('linha-confirmar');
  const msgConfirmar = document.getElementById('msg-confirmar');
  const medidor = document.getElementById('medidor');
  const medidorTexto = document.getElementById('medidor-texto');
  const barra = document.getElementById('barra-preench');
  const listaReq = document.getElementById('requisitos');
  const proximoPasso = document.getElementById('proximo-passo');
  const botao = document.getElementById('botao-entrar');
  const envoltorio = document.getElementById('envoltorio-entrar');
  const form = document.getElementById('form-senha');
  const dicaTexto = document.getElementById('dica-texto');

  const ROTULOS = { fraca: 'Fraca', media: 'Média', forte: 'Forte' };
  const LARGURAS = { fraca: 33, media: 66, forte: 100 };

  // monta a checklist uma vez
  const itens = {};
  avaliarSenha('').requisitos.forEach(req => {
    const li = document.createElement('li');
    li.innerHTML = '<span class="marca" aria-hidden="true">✓</span><span class="txt"></span><span class="sr-only estado"></span>';
    li.querySelector('.txt').textContent = req.texto;
    listaReq.appendChild(li);
    itens[req.id] = li;
  });

  function atualizar() {
    senhaAtual = campoSenha.value;
    confirmacaoAtual = campoConfirmar.value;
    const av = avaliarSenha(senhaAtual);

    // checklist
    av.requisitos.forEach(req => {
      const li = itens[req.id];
      li.classList.toggle('ok', req.ok);
      li.querySelector('.estado').textContent = req.ok ? ' (cumprido)' : ' (pendente)';
    });

    // medidor
    if (!senhaAtual) {
      medidor.dataset.nivel = 'fraca';
      barra.style.width = '0%';
      medidorTexto.textContent = 'Digite uma senha';
    } else {
      medidor.dataset.nivel = av.nivel;
      barra.style.width = LARGURAS[av.nivel] + '%';
      medidorTexto.textContent = ROTULOS[av.nivel];
    }

    // próximo passo (amigável, sem culpar)
    const pendente = av.requisitos.find(r => !r.ok);
    if (!senhaAtual) {
      proximoPasso.textContent = '';
    } else if (pendente) {
      proximoPasso.textContent = 'Quase lá! ' + pendente.ajuda;
    } else {
      proximoPasso.textContent = 'Muito bem! Sua senha cumpre todos os requisitos.';
    }

    // confirmação
    const iguais = senhaAtual === confirmacaoAtual;
    const discorda = confirmacaoAtual.length > 0 && !iguais;
    linhaConfirmar.classList.toggle('erro', discorda);
    campoConfirmar.setAttribute('aria-invalid', discorda ? 'true' : 'false');
    msgConfirmar.textContent = discorda
      ? 'As senhas ainda não são iguais. Confira com calma e tente de novo.'
      : (confirmacaoAtual && iguais ? 'As senhas são iguais.' : '');

    // botão
    const pode = av.valida && iguais && confirmacaoAtual.length > 0;
    botao.disabled = !pode;
    return { av, pode };
  }

  // texto de ajuda quando tentam entrar sem poder
  function registrarTentativaInvalida() {
    estadoDoJogo.tentativas += 1;
    const { av } = atualizar();
    const pendente = av.requisitos.find(r => !r.ok);
    let mensagem;
    if (!senhaAtual) {
      mensagem = 'Vamos começar! Digite sua nova senha no primeiro campo.';
      campoSenha.focus();
    } else if (pendente) {
      mensagem = 'Ainda não deu. ' + pendente.ajuda;
      campoSenha.focus();
    } else {
      mensagem = confirmacaoAtual
        ? 'As duas senhas precisam ser iguais. Confira o segundo campo.'
        : 'Falta só repetir a senha no campo “Confirmar senha”.';
      campoConfirmar.focus();
    }
    proximoPasso.textContent = mensagem;
    dicaTexto.textContent = 'Calma, é normal errar! ' + mensagem;
  }

  // eventos
  campoSenha.addEventListener('input', atualizar);
  campoConfirmar.addEventListener('input', atualizar);

  // mostrar / ocultar
  document.querySelectorAll('.olho').forEach(btn => {
    btn.addEventListener('click', () => {
      const alvo = document.getElementById(btn.dataset.alvo);
      const mostrar = alvo.type === 'password';
      alvo.type = mostrar ? 'text' : 'password';
      btn.setAttribute('aria-pressed', String(mostrar));
      const nome = btn.dataset.alvo === 'senha' ? 'nova senha' : 'confirmação da senha';
      btn.setAttribute('aria-label', (mostrar ? 'Ocultar ' : 'Mostrar ') + nome);
    });
  });

  // clique no botão desabilitado (cai no envoltório)
  envoltorio.addEventListener('click', () => {
    if (botao.disabled) registrarTentativaInvalida();
  });

  // Enter com formulário inválido (envio implícito é bloqueado pelo botão desabilitado)
  form.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && botao.disabled) {
      e.preventDefault();
      registrarTentativaInvalida();
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const { av, pode } = atualizar();
    if (!pode) { registrarTentativaInvalida(); return; }

    // guarda só o que importa e descarta a senha
    estadoDoJogo.forcaSenha = av.nivel;
    estadoDoJogo.tamanhoSenha = senhaAtual.length;
    senhaAtual = '';
    confirmacaoAtual = '';
    campoSenha.value = '';
    campoConfirmar.value = '';

    entrarNoComputador();
  });

  atualizar();
  campoSenha.focus();
}

/* ============================================================
   8. TRANSIÇÃO DE BOAS-VINDAS
   ============================================================ */
function entrarNoComputador() {
  estadoDoJogo.fase = 'boasVindas';
  const tela = document.getElementById('boas-vindas');
  tela.classList.add('ativa');
  tela.setAttribute('aria-hidden', 'false');
  document.getElementById('tela-login').setAttribute('inert', '');

  setTimeout(() => {
    estadoDoJogo.fase = 'areaDeTrabalho';
    iniciarAreaDeTrabalho({
      forcaSenha: estadoDoJogo.forcaSenha,
      tamanhoSenha: estadoDoJogo.tamanhoSenha,
      tentativas: estadoDoJogo.tentativas   // extra: tentativas antes da senha válida
    });
  }, 2200);
}

/* ============================================================
   9. PRÓXIMA FASE (STUB)
   A tela da área de trabalho será implementada depois.
   Recebe: { forcaSenha, tamanhoSenha, tentativas }.
   ============================================================ */
function iniciarAreaDeTrabalho(estado) {
  // TODO: montar a área de trabalho (ícones de e-mail, navegador e chat, barra de tarefas,
  // biscoito guia). Por ora, apenas registra o estado recebido.
  console.log('iniciarAreaDeTrabalho()', estado);
}
window.iniciarAreaDeTrabalho = iniciarAreaDeTrabalho;

/* ============================================================
   10. INICIALIZAÇÃO
   ============================================================ */
iniciarRelogio();
iniciarTelaDeLogin();
