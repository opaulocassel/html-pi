const express = require("express");
const server = express();
const dadosUsuario = require("../data/usuarios.json");
const fs = require("fs");

server.use(express.json());

server.post("/Usuarios", (req, res) => {
    const novoUsuario = req.body;

    if (
        !novoUsuario.id ||
        !novoUsuario.data ||
        !novoUsuario.nome ||
        !novoUsuario.email ||
        !novoUsuario.telefone ||
        !novoUsuario.senha
    ) {
        return res
            .status(400)
            .json({ mensagem: "Dados incompletos, tente novamente" });
    } else {
        dadosUsuario.Usuarios.push(novoUsuario);
        salvarDados(dadosUsuario);
        return res
            .status(201)
            .json({ mensagem: "Novo maninho cadastrado com sucesso!" });
    }
});

// server.get("/usuarios", (req, res) => {
//     return res.json(dadosUsuario.usuarios);
// });

// server.put("/usuarios/:id", (req, res) => {
//     const usuariosId = parseInt(req.params.id);

//     const atualizarUsuarios = req.body;

//     const idUsuarios = dadosUsuario.usuarios.findIndex((u) => u.id === usuariosId);

//     if (usuariosId === -1) {
//         return res.status(404).json({ mensagem: "Time não encontrado :/" });
//     } else {
//         dadosUsuario.usuarios[idUsuarios].nomeUsuario =
//             atualizarUsuarios.nomeUsuario || dadosUsuario.usuarios[idUsuarios].nomeUsuario;

//         dadosUsuario.usuarios[idUsuarios].emailUsuario =
//             atualizarUsuarios.emailUsuario || dadosUsuario.usuarios[idUsuarios].emailUsuario;

//         dadosUsuario.usuarios[idUsuarios].celularUsuario =
//             atualizarUsuarios.celularUsuario || dadosUsuario.usuarios[idUsuarios].celularUsuario;

//         dadosUsuario.usuarios[idUsuarios].senhaUsuario =
//             atualizarUsuarios.senhaUsuario || dadosUsuario.usuarios[idUsuarios].senhaUsuario;

//         salvarDados(dadosUsuario);

//         return res.json({ mensagem: "Time atualizado com sucesso!" });
//     }
// });

// server.delete("/usuarios/:id", (req, res) => {
//     const usuariosId = parseInt(req.params.id)

//     dadosUsuario.usuarios = dadosUsuario.usuarios.filter(u => u.id !== usuariosId)

//     salvarDados(dadosUsuario)

//     return res.status(200).json({ mensagem: "Time excluído com sucesso" })
// })

function salvarDados() {
    fs.writeFileSync(__dirname + './data/usuarios.json', JSON.stringify(dadosUsuario, null, 2))
}

module.exports = {server, salvarDados};