const express = require('express')
const server = express()
const dados = require('../data/usuarios.json')
const fs = require('fs')
const cors = require('cors')

// controller
const usuariosRouter = require('./controllerUsuarios')

// função para utilizar o servidor
server.use(express.json())
server.use(cors())

server.use('/Arquivos', usuariosRouter.server)

// mensagem no terminal para indicar o funcionamento
server.listen(3000, () =>{
    console.log(`Se funcionou, não mexe! :D`);
})