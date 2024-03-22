document.addEventListener("DOMContentLoaded", function () {
  carregarListaUsuarios()

  document.getElementById('formAtualizarNome').addEventListener('submit', function (event) {
    event.preventDefault();
    atualizarNomeUsuario();
  });

  document.getElementById('formAtualizarEmail').addEventListener('submit', function (event) {
    event.preventDefault();
    atualizarEmailUsuario();
  });

  document.getElementById('formAtualizarTelefone').addEventListener('submit', function (event) {
    event.preventDefault();
    atualizarCelularUsuario();
  });
});

function carregarListaUsuarios() {
  fetch("http://localhost:3000/usuarios")
    .then((response) => response.json())
    .then(function (data) {
      let userList = document.getElementById("userList");
      if (!userList) {
        console.error("Elemento userList não encontrado.");
        return;
      }
      userList.innerHTML = "";

      data.forEach(function (usuarios) {
        const listaItem = document.createElement("div");

        listaItem.classList.add("usuario")
        listaItem.id = `times${listaItem.id}`

        listaItem.innerHTML = `
        <div class="pokemon">
            <div class="informacao">
              <div class="nome">
                <h4>Nome: </h4><p>${usuarios.nomeUsuario}</p>
                <button class="dialogButton" onClick="abrirDialogNome()" data-id="${usuarios.id}">Atualizar nome</button>
              </div>
              
              <div class="email">
                <h4>Email: </h4><p>${usuarios.email}</p>
                <button class="dialogButton" onClick="abrirDialogEmail()" data-id="${usuarios.id}">Atualizar email</button>
              </div>

              <div class="celular">
                <h4>N° celular: </h4><p>${usuarios.telefone}</p>
                <button class="dialogButton" onClick="abrirDialogTelefone()" data-id="${usuarios.id}">Número de celular</button>
              </div>

              <div class="senha">
                <h4>Senha: </h4><p>${usuarios.senha}</p>
                <button class="dialogButton" onClick="abrirDialogSenha() data-id="${usuarios.id}">Atualizar senha</button>
              </div>

              <div class="buttonDiv">
                <button class="deleteButton" onClick="excluirUsuario(${usuarios.id})">Excluir</button>
              </div>
            </div>
          </div>
         `;
        userList.appendChild(listaItem);
      });
    })
    .catch((error) =>
      console.error("Ocorreu um erro ao carregar o arquivo JSON:", error)
    );
};

function excluirUsuario(id) {
  fetch(`http://localhost:3000/usuarios/${id}`, {
    method: "DELETE",
  })
    .then(response => response.json())
    .then(data => {
      console.log("Usuário excluído com sucesso:", data);
      carregarListaUsuarios();
    })
    .catch(error => console.error("Erro ao excluir usuário:", error));
}

// Atualizar nome
function abrirDialogNome() {
  var dialog = document.getElementById('formAtualizarNome');
  dialog.style.display = 'block';

  var userId = event.target.dataset.id;
  document.getElementById('userId').value = userId;
}

function fecharDialogNome() {
  var dialog = document.getElementById('formAtualizarNome');
  dialog.style.display = 'none';
}

function atualizarNomeUsuario() {
  const novoNomeUsuario = document.getElementById("novoNomeUsuario").value;
  const idUsuario = document.getElementById("userId").value;

  fetch(`http://localhost:3000/usuarios/${idUsuario}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nomeUsuario: novoNomeUsuario
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log("Usuário atualizado com sucesso:", data);
      carregarListaUsuarios()
    })
    .catch(error => console.error("Erro ao atualizar o usuário:", error));
}


// Atualizar email
function abrirDialogEmail() {
  var dialog = document.getElementById('formAtualizarEmail');
  dialog.style.display = 'block';

  var userId = event.target.dataset.id;
  document.getElementById('userId').value = userId;
}

function atualizarEmailUsuario() {
  const novoEmailUsuario = document.getElementById("novoEmailUsuario").value;
  const idUsuario = document.getElementById("userId").value;

  fetch(`http://localhost:3000/usuarios/${idUsuario}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: novoEmailUsuario
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log("Usuário atualizado com sucesso:", data);
      carregarListaUsuarios()
    })
    .catch(error => console.error("Erro ao atualizar o usuário:", error));
}

// Atualizar celular
function abrirDialogTelefone() {
  var dialog = document.getElementById('formAtualizarTelefone');
  dialog.style.display = 'block';

  var userId = event.target.dataset.id;
  document.getElementById('userId').value = userId;
}

function fecharDialogTelefone() {
  var dialog = document.getElementById('formAtualizarTelefone');
  dialog.style.display = 'none';
}

function atualizarCelularUsuario() {
  const novoTelefoneUsuario = document.getElementById("novoTelefoneUsuario").value;
  const idUsuario = document.getElementById("userId").value;

  fetch(`http://localhost:3000/usuarios/${idUsuario}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      telefone: novoTelefoneUsuario
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log("Usuário atualizado com sucesso:", data);
      carregarListaUsuarios()
    })
    .catch(error => console.error("Erro ao atualizar o usuário:", error));
}




function abrirDialogSenha() {
  var dialog = document.getElementById('formAtualizarSenha');
  dialog.style.display = 'block';
}

function fecharDialogSenha() {
  var dialog = document.getElementById('formAtualizarSenha');
  dialog.style.display = 'none';
}

