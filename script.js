let timer = null;
let operacaoAtual = null;
let respostaCorreta = null;
let inicioCronometro = null;
let errosNaQuestao = 0;
let contaTexto = "";



/* =======================
   CONQUISTAS & STREAK
======================= */
let streakAtual = 0;

let conquistas = {
    primeiroAcerto: false,
    cincoAcertos: false,
    streak5: false,
    streak10: false,
    rapido: false,
    mestreDivisao: false
};

/* =======================
   TROCAR DE TELA
======================= */

function selecionarOperacao(op) {
    operacaoAtual = op;

    document.getElementById("tela-inicial").classList.remove("visivel");
    document.getElementById("tela-inicial").classList.add("oculto");

    document.getElementById("tela-operacao").classList.remove("oculto");
    document.getElementById("tela-operacao").classList.add("visivel");

    const titulos = {
        add: "Adição",
        sub: "Subtração",
        mul: "Multiplicação",
        div: "Divisão"
    };

    document.getElementById("titulo-operacao").innerText = titulos[op];
    /* =========================
       AVISO DE DIVISÃO
    ========================= */
    const aviso = document.getElementById("aviso-divisao");

    if (op === "div") {
        aviso.style.display = "block";
    } else {
        aviso.style.display = "none";
    }

    pararCronometro();
    document.getElementById("cronometro").innerText = "00:00:00.000";
    document.getElementById("conta").innerText = "Calcule:";
}


/* =======================
   GERAR DESAFIO
======================= */
document.getElementById("btn-gerar").onclick = gerarDesafio;

function gerarDesafio() {
    pararCronometro();

    let limite = Number(document.getElementById("dificuldade").value);
    let n1 = Math.floor(Math.random() * limite) + 1;
    let n2 = Math.floor(Math.random() * limite) + 1;

    if (!operacaoAtual) {
        alert("Selecione uma operação primeiro");
        return;
    }

    if (operacaoAtual === "add") {
        respostaCorreta = n1 + n2;
        contaTexto = `${n1} + ${n2}`;
    } else if (operacaoAtual === "sub") {
        const maior = Math.max(n1, n2);
        const menor = Math.min(n1, n2);
        respostaCorreta = maior - menor;
        contaTexto = `${maior} - ${menor}`;
    } else if (operacaoAtual === "mul") {
        respostaCorreta = n1 * n2;
        contaTexto = `${n1} × ${n2}`;
    } else if (operacaoAtual === "div") {
        // Para divisão exata e amigável
        respostaCorreta = n1;
        let dividendo = n1 * n2;
        contaTexto = `${dividendo} ÷ ${n2}`;
    }

    errosNaQuestao = 0;
    
    // Reset visual
    document.getElementById("conta").innerText = contaTexto;
    document.getElementById("btnResultado").classList.add("oculto");
    
    document.getElementById("resposta").value = "";
    iniciarCronometro();
}

/* =======================
   BOTÃO MOSTRAR RESULTADO (CORRIGIDO)
======================= */
// Esta deve ser a ÚNICA função para o btnResultado no seu código
document.getElementById("btnResultado").onclick = function () {
    const elConta = document.getElementById("conta");

    if (!elConta) {
        console.error("ERRO: Elemento 'conta' não encontrado no HTML.");
        return;
    }

    if (respostaCorreta !== null) {
        // Formata o resultado (ex: 2 casas decimais para divisões)
        let resFormatado = Number.isInteger(respostaCorreta) ? 
                           respostaCorreta : 
                           respostaCorreta.toFixed(2);

        // Atualiza o texto na div principal da conta
        elConta.innerText = `${contaTexto} = ${resFormatado}`;
        
        // Esconde o botão e para o tempo
        this.classList.add("oculto");
        pararCronometro();
    }
};

/* =======================
   ENVIAR RESPOSTA
======================= */

function enviarResposta() {
    const input = document.getElementById("resposta");

    let valor = input.value.replace(",", ".").trim();
    const card = document.querySelector(".card");

    if (valor === "") return;

    const respostaUsuario = Number(valor);
    if (isNaN(respostaUsuario)) return;

    card.classList.remove("correto", "errado");

    let acertou = false;

    if (operacaoAtual === "div") {
        const margem = 0.01;
        acertou = Math.abs(respostaUsuario - respostaCorreta) <= margem;
    } else {
        acertou = respostaUsuario === respostaCorreta;
    }

    if (acertou) {
    if (navigator.vibrate) navigator.vibrate(80);

    pararCronometro();
    card.classList.add("correto");

    // ACERTOS
    const acertosEl = document.getElementById("acertos");
    const totalAcertos = Number(acertosEl.innerText) + 1;
    acertosEl.innerText = totalAcertos;

    // STREAK
    streakAtual++;

    // TEMPO DA RESPOSTA
    const tempoGasto = Date.now() - inicioCronometro;

    /* =======================
       CONQUISTAS
    ======================= */

    if (totalAcertos === 1) {
        desbloquearConquista(
            "primeiroAcerto",
            "Primeiro Passo",
            "Você acertou sua primeira questão"
        );
    }

    if (totalAcertos === 5) {
        desbloquearConquista(
            "cincoAcertos",
            "Aquecendo",
            "5 respostas corretas"
        );
    }

    if (streakAtual >= 5) {
    desbloquearConquista(
        "streak5",
        "Em Chamas",
        "5 acertos seguidos 🔥"
    );
}

    if (streakAtual >= 10) {
    desbloquearConquista(
        "streak10",
        "Imparável",
        "10 acertos seguidos 😈"
    );
}


    if (tempoGasto < 3000) {
        desbloquearConquista(
            "rapido",
            "Relâmpago",
            "Resposta em menos de 3 segundos ⚡"
        );
    }

    if (operacaoAtual === "div" && totalAcertos >= 10) {
        desbloquearConquista(
            "mestreDivisao",
            "Mestre da Divisão",
            "10 divisões corretas"
        );
    }

    } else {
    streakAtual = 0;
    errosNaQuestao++; // 🔥 ISSO QUE FALTAVA

    if (navigator.vibrate) navigator.vibrate([60, 40, 60]);

    card.classList.add("errado");

    document.getElementById("erros").innerText =
        Number(document.getElementById("erros").innerText) + 1;

    // MOSTRAR BOTÃO APÓS 3 ERROS NA MESMA QUESTÃO
    if (errosNaQuestao >= 3) {
        document.getElementById("btnResultado").classList.remove("oculto");
    }
}


    input.value = "";
    input.blur();

    setTimeout(() => {
        card.classList.remove("correto", "errado");
    }, 600);
}

/* =======================
   CRONÔMETRO
======================= */

function iniciarCronometro() {
    inicioCronometro = Date.now();

    timer = setInterval(() => {
        let tempo = Date.now() - inicioCronometro;
        let ms = tempo % 1000;
        let s = Math.floor((tempo / 1000) % 60);
        let m = Math.floor((tempo / 1000 / 60) % 60);

        document.getElementById("cronometro").innerText =
            `${m.toString().padStart(2, "0")}:` +
            `${s.toString().padStart(2, "0")}:` +
            `${ms.toString().padStart(3, "0")}`;
    }, 10);
}

function pararCronometro() {
    clearInterval(timer);
}

/* =======================
   OUTROS BOTÕES E FUNÇÕES
======================= */

document.getElementById("resetar").onclick = function () {
    document.getElementById("acertos").innerText = 0;
    document.getElementById("erros").innerText = 0;
    streakAtual = 0;
};

function voltarInicio() {
    document.getElementById("tela-operacao").classList.add("oculto");
    document.getElementById("tela-operacao").classList.remove("visivel");

    document.getElementById("tela-inicial").classList.remove("oculto");
    document.getElementById("tela-inicial").classList.add("visivel");

    pararCronometro();
}

function desbloquearConquista(id, titulo, descricao) {
    if (conquistas[id]) return;
    conquistas[id] = true;
    mostrarToast(` ${titulo} — ${descricao}`);
}

let filaToasts = [];
let toastAtivo = false;

function mostrarToast(texto) {
    filaToasts.push(texto);
    if (!toastAtivo) processarToast();
}

function processarToast() {
    if (filaToasts.length === 0) {
        toastAtivo = false;
        return;
    }
    toastAtivo = true;
    const toast = document.getElementById("toast");
    if(toast) {
        toast.innerText = filaToasts.shift();
        toast.classList.add("mostrar");
        setTimeout(() => {
            toast.classList.remove("mostrar");
            setTimeout(processarToast, 400);
        }, 2500);
    }
}