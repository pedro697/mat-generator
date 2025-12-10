let timer = null;
let operacaoAtual = null;
let respostaCorreta = null;
let inicioCronometro = null;

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

    if (operacaoAtual === "add") {
        respostaCorreta = n1 + n2;
        document.getElementById("conta").innerText = `${n1} + ${n2}`;
    }
    if (operacaoAtual === "sub") {
        respostaCorreta = n1 - n2;
        document.getElementById("conta").innerText = `${n1} - ${n2}`;
    }
    if (operacaoAtual === "mul") {
        respostaCorreta = n1 * n2;
        document.getElementById("conta").innerText = `${n1} × ${n2}`;
    }
    if (operacaoAtual === "div") {
        respostaCorreta = (n1 / n2).toFixed(2);
        document.getElementById("conta").innerText = `${n1} ÷ ${n2}`;
    }

    document.getElementById("resposta").value = "";

    iniciarCronometro();
}

/* =======================
   ENVIAR RESPOSTA
======================= */

document.getElementById("resposta").addEventListener("keyup", function (e) {
    if (e.key === "Enter") enviarResposta();
});

function enviarResposta() {
    let valor = document.getElementById("resposta").value.trim();
    const card = document.querySelector(".card");
    if (valor === "") return;

    card.classList.remove("correto", "errado");

    if (valor == respostaCorreta) {
        navigator.vibrate(80);
        pararCronometro();

        card.classList.add("correto");
        document.getElementById("acertos").innerText =
            Number(document.getElementById("acertos").innerText) + 1;

    } else {
        navigator.vibrate([60, 40, 60]);
        card.classList.add("errado");

        document.getElementById("erros").innerText =
            Number(document.getElementById("erros").innerText) + 1;
    }

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
   OUTROS BOTÕES
======================= */

document.getElementById("resetar").onclick = function () {
    document.getElementById("acertos").innerText = 0;
    document.getElementById("erros").innerText = 0;
};

function voltarInicio() {
    document.getElementById("tela-operacao").classList.add("oculto");
    document.getElementById("tela-operacao").classList.remove("visivel");

    document.getElementById("tela-inicial").classList.remove("oculto");
    document.getElementById("tela-inicial").classList.add("visivel");

    pararCronometro();
}
