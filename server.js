import express from "express"
const app = express()
const PORT = 3000
app.listen(PORT, "0.0.0.0", () => console.log (`Servidor em http://localhost:${PORT}`));

// 1.1
//----
console.log ("1.1 -- Aquecimento: Criando sua primeira Promise com Delay")

function saudacaoAssincrona(nome) {
    return new Promise((resolve) => {
        console.log ("Só dois segundos ....")
        setTimeout(() => {
            resolve (`Olá, ${nome}! Bem-vindo ao Mensageiro Local.`);
            }, 2000);
        });
}

saudacaoAssincrona('Leonardo').then((resposta) => console.log(resposta));

// 1.2
//----
console.log ("1.2 -- Validação e Rejeição com reject")

function obterMensagemPorId(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id <= 5) {
                return reject(new Error("ID inválido: deve ser maior que zero"));
            }
            else {
                return resolve({ id: id, texto: "Mensagem do laboratório" });
            }
        },1000)
    });
}

obterMensagemPorId(1).then(msg => console.log("Sucesso:", msg)).catch(err => console.error(err.message));

obterMensagemPorId(-3).then(msg => console.log("Sucesso:", msg)).catch(err => console.error("Erro capturado:", err.message));

//2.1
//----
console.log ("2.1 — Sucesso com .then no Express")

app.get ("/", (req, res) => {
    saudacaoAssincrona ("Leonardo").then((mensagem) => {
        res.send(mensagem)
    })
});

//2.2
//----
console.log ("2.2 — Tratando Falhas e Evitando Queda com .catch")

app.get ("/mensagem-invalida-then", (req, res) => {
    return obterMensagemPorId(-5)
        .then((msg) => {res.json(msg)})
        .catch((erro) => {res.status(500).json({ erro: erro.message });
    })
})

//3.1
//----
console.log ("3.1 — Migrando para async/await") 

app.get ("/saudacao-async", async (req, res) => {
    try {
        const mensagem = await saudacaoAssincrona("Aluno do Futuro");
        res.send (mensagem)
    } catch (erro) {
        res.status(500).json({erro: "Falha na saudação"})
    }
})

//3.2
//----
console.log (" 3.2 — Forçando e Capturando Erro com try/catch") 

app.get("/mensagem-erro-async", async (req, res) => {
    try {
        const msg = await obterMensagemPorId(-10);
        res.json(msg)
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

