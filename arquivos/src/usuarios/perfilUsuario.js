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

  document.getElementById('formAtualizarSenha').addEventListener('submit', function (event) {
    event.preventDefault();
    atualizarSenhaUsuario();
  });
});

function carregarListaUsuarios() {
  const NomeDoUsuario = sessionStorage.getItem('guardarNome')

  console.log(NomeDoUsuario)

  const NomeSemAspas = NomeDoUsuario.replace(/^"(.*)"$/, '$1');

  console.log(NomeSemAspas);

  fetch(`http://localhost:3000/usuarios/${NomeSemAspas}`)
    .then((response) => response.json())
    .then(function (usuario) {
      let userList = document.getElementById("userList");
      if (!userList) {
        console.error("Elemento userList não encontrado.");
        return;
      }
      userList.innerHTML = "";

        const listaItem = document.createElement("div");
        listaItem.classList.add("usuario")
        listaItem.id = `times${listaItem.id}`

        listaItem.innerHTML = `
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nome</th>
              <th scope="col">Email</th>
              <th scope="col">N°Celular</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
           <tr>
              <th scope="row">${usuario.id}</th>
              <td>${usuario.nomeUsuario}</td>
              <td>${usuario.email}</td>
              <td>${usuario.telefone}</td>
              <td>
                <button class="dialogButton" onClick="abrirDialogNome()" data-id="${usuario.id}">Atualizar nome</button>
                <button class="dialogButton" onClick="abrirDialogEmail()" data-id="${usuario.id}">Atualizar email</button>
                <button class="dialogButton" onClick="abrirDialogTelefone()" data-id="${usuario.id}">Número de celular</button>
                <button class="deleteButton" onClick="excluirUsuario(${usuario.id})">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
         `;
        userList.appendChild(listaItem);
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

  let guardarNome = novoNomeUsuario
  sessionStorage.setItem('guardarNome', JSON.stringify(guardarNome))

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

function fecharDialogEmail() {
  var dialog = document.getElementById('formAtualizarEmail');
  dialog.style.display = 'none';
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



// Atualizar senha
function abrirDialogSenha() {
  var dialog = document.getElementById('formAtualizarSenha');
  dialog.style.display = 'block';

  var userId = event.target.dataset.id;
  document.getElementById('userId').value = userId;
}

function fecharDialogSenha() {
  var dialog = document.getElementById('formAtualizarSenha');
  dialog.style.display = 'none';
}

function atualizarSenhaUsuario() {
  const novaSenhaUsuario = document.getElementById("novaSenhaUsuario").value;
  const idUsuario = document.getElementById("userId").value;

  fetch(`http://localhost:3000/usuarios/${idUsuario}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      senha: novaSenhaUsuario
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log("Usuário atualizado com sucesso:", data);
      carregarListaUsuarios()
    })
    .catch(error => console.error("Erro ao atualizar o usuário:", error));
}