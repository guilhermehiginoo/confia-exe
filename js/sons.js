// Sons gerados no código (Web Audio): sem arquivos e sem direitos autorais.
(function () {
  let ctx = null;
  let mudo = false;
  try { mudo = localStorage.getItem("confia-mudo") === "1"; } catch {}

  // O navegador só libera áudio depois de um clique, então o contexto nasce no primeiro som.
  const tom = ({ tipo = "square", de, ate = de, dur = 0.08, vol = 0.06, atraso = 0 }) => {
    if (mudo) return;
    ctx ??= new (window.AudioContext || window.webkitAudioContext)();
    const t = ctx.currentTime + atraso;
    const osc = ctx.createOscillator();
    const ganho = ctx.createGain();
    osc.type = tipo;
    osc.frequency.setValueAtTime(de, t);
    osc.frequency.exponentialRampToValueAtTime(ate, t + dur);
    ganho.gain.setValueAtTime(vol, t);
    ganho.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(ganho).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  };

  const Som = {
    clique: () => tom({ de: 520, ate: 780, dur: 0.06 }),
    // Quanto mais forte a senha, mais agudo o "tic".
    tecla: (forca) => tom({ tipo: "sine", de: 220 + forca * 7, dur: 0.05, vol: 0.08 }),
    reacao: () => tom({ tipo: "triangle", de: 380, ate: 920, dur: 0.14, vol: 0.1 }),
    aceitar: () => {
      tom({ tipo: "triangle", de: 660, dur: 0.1, vol: 0.1 });
      tom({ tipo: "triangle", de: 990, dur: 0.18, vol: 0.1, atraso: 0.09 });
    },
    alerta: () => {
      tom({ tipo: "square", de: 740, dur: 0.09, vol: 0.05 });
      tom({ tipo: "square", de: 520, dur: 0.14, vol: 0.05, atraso: 0.1 });
    },
    conquista: () => [523, 659, 784, 1047].forEach((de, i) => tom({ tipo: "triangle", de, dur: 0.16, vol: 0.09, atraso: i * 0.08 })),
    get mudo() { return mudo; },
    alternar() {
      mudo = !mudo;
      try { localStorage.setItem("confia-mudo", mudo ? "1" : "0"); } catch {}
      return mudo;
    },
  };

  window.Confia.Som = Som;
})();
