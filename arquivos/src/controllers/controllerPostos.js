const express = require("express");
const server = express();
const dadosPosto = require("../data/postos.json");
const fs = require("fs");

server.use(express.json());

server.post("/postos", (req, res) => {
    const novoPosto = req.body;
  
    // Encontrar o maior ID existente
    const ultimoIdExistente = dadosPosto.postos.reduce((maxId, posto) => {
      return posto.id > maxId ? posto.id : maxId;
    }, 0);
  
    const novoId = ultimoIdExistente + 1;
    const data = new Date();
    const formatarData = data.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  
    novoPosto.id = novoId;
    novoPosto.data = formatarData;
  
    if (
      !novoPosto.nomePosto ||
      !novoPosto.enderecoPosto ||
      !novoPosto.cnpjPosto ||
      !novoPosto.comumPosto ||
      !novoPosto.aditivadaPosto ||
      !novoPosto.dieselPosto ||
      !novoPosto.alcoolPosto
    ) {
      return res
        .status(400)
        .json({ mensagem: "Dados incompletos, tente novamente" });
    } else {
      dadosPosto.postos.push(novoPosto);
      salvarDados(dadosPosto);
      return res
        .status(201)
        .json({ mensagem: "Novo Posto cadastrado com sucesso!" });
    }
  });
  
  
  server.get("/postos", (req, res) => {
      return res.json(dadosPosto.postos);
  });
  
const path = require("path");

function salvarDados(dados) {
  const caminhoArquivo = path.join(__dirname, "../data/postos.json");
  fs.writeFileSync(caminhoArquivo, JSON.stringify(dados, null, 2));
}

module.exports = { server, salvarDados };
