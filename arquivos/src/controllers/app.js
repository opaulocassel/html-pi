const express = require('express')
const server = express()
const fs = require('fs')
const cors = require('cors')

// controllers
const usuariosRouter = require('./controllerUsuarios')

// função para utilizar o servidor
server.use(express.json())
server.use(cors())

server.use('/ARQUIVOS', usuariosRouter.server)

// mensagem no terminal para indicar o funcionamento
server.listen(3000, () =>{
    console.log(`Se funcionou, não mexe! É sério!!! :D`);
})