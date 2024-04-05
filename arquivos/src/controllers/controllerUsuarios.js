const express = require("express");
const server = express();
const dadosUsuario = require("../data/usuarios.json");
const fs = require("fs");
const crypto = require('crypto');

server.use(express.json());

server.post("/usuarios", (req, res) => {
  const novoUsuario = req.body;

  // Encontrar o maior ID existente
  const ultimoIdExistente = dadosUsuario.usuarios.reduce((maxId, usuario) => {
    return usuario.id > maxId ? usuario.id : maxId;
  }, 0);

  const novoId = ultimoIdExistente + 1;
  const data = new Date();
  const formatarData = data.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

  novoUsuario.id = novoId;
  novoUsuario.data = formatarData;

  const hashSenha = crypto.createHash('sha256').update(novoUsuario.senha).digest('hex');
  novoUsuario.senha = hashSenha;

  if (
    !novoUsuario.nomeUsuario ||
    !novoUsuario.email ||
    !novoUsuario.telefone 
  ) {
    return res
      .status(400)
      .json({ mensagem: "Dados incompletos, tente novamente" });
  } else {
    dadosUsuario.usuarios.push(novoUsuario);
    salvarDados(dadosUsuario);
    return res
      .status(201)
      .json({ mensagem: "Novo usuário cadastrado com sucesso!" });
  }
});


server.get("/usuarios", (req, res) => {
    return res.json(dadosUsuario.usuarios);
})

server.get("/usuarios/:nomeUsuario", (req, res)=>{
  const nomeUsuario = req.params.nomeUsuario;
  const usuarioEncontrado = dadosUsuario.usuarios.find(usuario => usuario.nomeUsuario === nomeUsuario);
  if (usuarioEncontrado) {
      return res.json(usuarioEncontrado);
  } else {
      return res.status(404).json({ error: 'Usuário não encontrado' });
  }
});

server.get("/usuarios/id/:id", (req, res) => {
  const usuariosId = parseInt(req.params.id);
  const usuarioEncontrado = dadosUsuario.usuarios.find(usuario => usuario.id === usuariosId);
  if (usuarioEncontrado) {
      return res.json(usuarioEncontrado);
  } else {
      return res.status(404).json({ error: 'Usuário não encontrado' });
  }
});

server.put("/usuarios/:id", (req, res) => {
  const usuariosId = parseInt(req.params.id);
  const atualizarUsuarios = req.body;
  const idUsuarios = dadosUsuario.usuarios.findIndex((u) => u.id === usuariosId);

  if (idUsuarios === -1) {
      return res.status(404).json({ mensagem: "Usuário não encontrado :/" });
  } else {
      if (atualizarUsuarios.senha) {
          const hashSenha = crypto.createHash('sha256').update(atualizarUsuarios.senha).digest('hex');
          atualizarUsuarios.senha = hashSenha;
      }

      dadosUsuario.usuarios[idUsuarios].nomeUsuario = atualizarUsuarios.nomeUsuario || dadosUsuario.usuarios[idUsuarios].nomeUsuario;
      dadosUsuario.usuarios[idUsuarios].email = atualizarUsuarios.email || dadosUsuario.usuarios[idUsuarios].email;
      dadosUsuario.usuarios[idUsuarios].telefone = atualizarUsuarios.telefone || dadosUsuario.usuarios[idUsuarios].telefone;
      dadosUsuario.usuarios[idUsuarios].senha = atualizarUsuarios.senha || dadosUsuario.usuarios[idUsuarios].senha;

      salvarDados(dadosUsuario);

      return res.json({ mensagem: "Usuário atualizado com sucesso!" });
  }
});



server.delete("/usuarios/:id", (req, res) => {
    const usuariosId = parseInt(req.params.id)

    dadosUsuario.usuarios = dadosUsuario.usuarios.filter(u => u.id !== usuariosId)

    salvarDados(dadosUsuario)

    return res.status(200).json({ mensagem: "Usuário excluído com sucesso" })
});


const path = require("path");

function salvarDados(dados) {
  const caminhoArquivo = path.join(__dirname, "../data/usuarios.json");
  fs.writeFileSync(caminhoArquivo, JSON.stringify(dados, null, 2));
}

module.exports = { server, salvarDados };
