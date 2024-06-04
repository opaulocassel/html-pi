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
    !novoPosto.ruaPosto ||
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

server.put("/postos/:id", (req, res) => {
  const postoId = parseInt(req.params.id)
  const atualizarPosto = req.body;
  const idPostos = dadosPosto.postos.findIndex((p) => p.id === postoId);

  if (idPostos === -1) {
    return res.status(404).json({ mensagem: "Posto não encontrado :/" });
  } else {

    dadosPosto.postos[idPostos].nomePosto = atualizarPosto.nomePosto || dadosPosto.postos[idPostos].nomePosto;
    dadosPosto.postos[idPostos].enderecoPosto = atualizarPosto.enderecoPosto || dadosPosto.postos[idPostos].enderecoPosto;
    dadosPosto.postos[idPostos].ruaPosto = atualizarPosto.ruaPosto || dadosPosto.postos[idPostos].ruaPosto;
    dadosPosto.postos[idPostos].cnpjPosto = atualizarPosto.cnpjPosto || dadosPosto.postos[idPostos].cnpjPosto;
    dadosPosto.postos[idPostos].comumPosto = atualizarPosto.comumPosto || dadosPosto.postos[idPostos].comumPosto;
    dadosPosto.postos[idPostos].aditivadaPosto = atualizarPosto.aditivadaPosto || dadosPosto.postos[idPostos].aditivadaPosto;
    dadosPosto.postos[idPostos].dieselPosto = atualizarPosto.dieselPosto || dadosPosto.postos[idPostos].dieselPosto;
    dadosPosto.postos[idPostos].alcoolPosto = atualizarPosto.alcoolPosto || dadosPosto.postos[idPostos].alcoolPosto;

    salvarDados(dadosPosto);

    return res.json({ mensagem: "Posto atualizado com sucesso!" });
  }
});


server.get("/postos", (req, res) => {
  return res.json(dadosPosto.postos);
});

server.get("/postos/:id", (req, res) => {
  const postoId = parseInt(req.params.id);
  const postoEncontrado = dadosPosto.postos.find(posto => posto.id === postoId);

  if (postoEncontrado) {
    return res.json(postoEncontrado);
  } else {
    return res.status(404).json({ error: 'Posto não encontrado' });
  }
});

server.get("/postos/nomePosto/:nomePosto", (req, res) => {
  const nomePosto = req.params.nomePosto;
  const postoEncontrado = dadosPosto.postos.find(posto => posto.nomePosto === nomePosto);
  if (postoEncontrado) {
    return res.json(postoEncontrado);
  } else {
    return res.status(404).json({ error: 'Posto não encontrado' });
  }
});

server.get("/postos/enderecoPosto/:enderecoPosto", (req, res) => {
  const enderecoPosto = req.params.enderecoPosto;
  const enderecoEncontrado = dadosPosto.postos.find(posto => posto.enderecoPosto === enderecoPosto);
  if (enderecoEncontrado) {
    return res.json(enderecoEncontrado);
  } else {
    return res.status(404).json({ error: 'Endereço não encontrado' });
  }
});

server.get("/postos/ruaPosto/:ruaPosto", (req, res) => {
  const ruaPosto = req.params.ruaPosto;
  const ruaEncontrada = dadosPosto.postos.find(posto => posto.ruaPosto === ruaPosto);
  if (ruaEncontrada) {
    return res.json(ruaEncontrada);
  } else {
    return res.status(404).json({ error: 'Rua não encontrada' });
  }
});

server.get("/postos/cnpjPosto/:cnpjPosto", (req, res) => {
  const cnpjPosto = req.params.cnpjPosto;
  console.log("CNPJ recebido:", cnpjPosto);
  const cnpjEncontrado = dadosPosto.postos.find(posto => posto.cnpjPosto === cnpjPosto);
  if (cnpjEncontrado) {
    return res.json(cnpjEncontrado);
  } else {
    return res.status(404).json({ error: 'CNPJ não encontrado' });
  }
});

server.get("/postos/comumPosto/:comumPosto", (req, res) => {
  const comumPosto = req.params.comumPosto;
  const comumEncontrada = dadosPosto.postos.find(posto => posto.comumPosto === comumPosto);
  if (comumEncontrada) {
    return res.json(comumEncontrada);
  } else {
    return res.status(404).json({ error: 'Comum não encontrado' });
  }
});

server.get("/postos/aditivadaPosto/:aditivadaPosto", (req, res) => {
  const aditivadaPosto = req.params.aditivadaPosto;
  const aditivadaEncontrada = dadosPosto.postos.find(posto => posto.aditivadaPosto === aditivadaPosto);
  if (aditivadaEncontrada) {
    return res.json(aditivadaEncontrada);
  } else {
    return res.status(404).json({ error: 'Aditivada não encontrado' });
  }
});

server.get("/postos/dieselPosto/:dieselPosto", (req, res) => {
  const dieselPosto = req.params.dieselPosto;
  const dieselEncontrada = dadosPosto.postos.find(posto => posto.dieselPosto === dieselPosto);
  if (dieselEncontrada) {
    return res.json(dieselEncontrada);
  } else {
    return res.status(404).json({ error: 'Diesel não encontrado' });
  }
});

server.get("/postos/alcoolPosto/:alcoolPosto", (req, res) => {
  const alcoolPosto = req.params.alcoolPosto;
  const alcoolEncontrado = dadosPosto.postos.find(posto => posto.alcoolPosto === alcoolPosto);
  if (alcoolEncontrado) {
    return res.json(alcoolEncontrado);
  } else {
    return res.status(404).json({ error: 'Álcool não encontrado' });
  }
});

server.delete("/postos/:id", (req, res) => {
  const postoId = parseInt(req.params.id)

  dadosPosto.postos = dadosPosto.postos.filter(p => p.id !== postoId)

  salvarDados(dadosPosto)

  return res.status(200).json({ mensagem: "Posto excluído com sucesso" })
});

const path = require("path");

function salvarDados(dados) {
  const caminhoArquivo = path.join(__dirname, "../data/postos.json");
  fs.writeFileSync(caminhoArquivo, JSON.stringify(dados, null, 2));
}

module.exports = { server, salvarDados };
