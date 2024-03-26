document.addEventListener("DOMContentLoaded", function () {
  carregarListaUsuarios();

  document
    .getElementById("formAtualizarNome")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      atualizarNomeUsuario();
    });

  document
    .getElementById("formAtualizarEmail")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      atualizarEmailUsuario();
    });

  document
    .getElementById("formAtualizarTelefone")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      atualizarCelularUsuario();
    });

  document
    .getElementById("formAtualizarSenha")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      atualizarSenhaUsuario();
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

      data.forEach(function (usuario) {
        const listaItem = document.createElement("div");
        listaItem.classList.add("usuario");

        listaItem.innerHTML = `
          <div>ID: ${usuario.id}</div>
          <div>Nome: ${usuario.nomeUsuario}</div>
          <div>Email: ${usuario.email}</div>
          <div>Número de Celular: ${usuario.telefone}</div>
          <div>Senha: ********</div>
          <div class="botoes">
            <button class="dialogButton" onClick="abrirDialogNome()" data-id="${usuario.id}">Atualizar nome</button>
            <button class="dialogButton" onClick="abrirDialogEmail()" data-id="${usuario.id}">Atualizar email</button>
            <button class="dialogButton" onClick="abrirDialogTelefone()" data-id="${usuario.id}">Número de celular</button>
            <button class="dialogButton" onClick="abrirDialogSenha()" data-id="${usuario.id}">Atualizar senha</button>
            <button class="deleteButton" onClick="excluirUsuario(${usuario.id})">Excluir</button>
          </div>
        `;
        userList.appendChild(listaItem);
      });
    })
    .catch((error) =>
      console.error("Ocorreu um erro ao carregar o arquivo JSON:", error)
    );
}


function excluirUsuario(id) {
  fetch(`http://localhost:3000/usuarios/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Usuário excluído com sucesso:", data);
      carregarListaUsuarios();
    })
    .catch((error) => console.error("Erro ao excluir usuário:", error));
}

// Atualizar nome
function abrirDialogNome() {
  var dialog = document.getElementById("formAtualizarNome");
  dialog.style.display = "block";

  var userId = event.target.dataset.id;
  document.getElementById("userId").value = userId;
}

function fecharDialogNome() {
  var dialog = document.getElementById("formAtualizarNome");
  dialog.style.display = "none";
}

function verificarNome(nome) {
  const regex = /^[\p{L}\s]+$/u;
  return regex.test(nome);
}

function verificarEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

function verificarTelefone(telefone) {
  const regex = /^\d{11}$/;
  return regex.test(telefone);
}

function atualizarNomeUsuario() {
  const novoNomeUsuario = document.getElementById("novoNomeUsuario").value;
  const idUsuario = document.getElementById("userId").value;

  if (novoNomeUsuario === "") {
    alert("Preencha o campo.");
  } else if (
    novoNomeUsuario === "Admin" ||
    novoNomeUsuario === "admin" ||
    !verificarNome(novoNomeUsuario)
  ) {
    alert("Este nome é proíbido.");
  } else {
    fetch(`http://localhost:3000/usuarios/${idUsuario}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nomeUsuario: novoNomeUsuario,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Usuário atualizado com sucesso:", data);
        carregarListaUsuarios();
      })
      .catch((error) => console.error("Erro ao atualizar o usuário:", error));
  }
}

// Atualizar email
function abrirDialogEmail() {
  var dialog = document.getElementById("formAtualizarEmail");
  dialog.style.display = "block";

  var userId = event.target.dataset.id;
  document.getElementById("userId").value = userId;
}

function fecharDialogEmail() {
  var dialog = document.getElementById("formAtualizarEmail");
  dialog.style.display = "none";
}

function atualizarEmailUsuario() {
  const novoEmailUsuario = document.getElementById("novoEmailUsuario").value;
  const idUsuario = document.getElementById("userId").value;

  if (novoEmailUsuario === "") {
    alert("Por favor, preencha o campo.");
  } else if (!verificarEmail(novoEmailUsuario)) {
    alert("E-mail inválido!");
  } else {
    fetch(`http://localhost:3000/usuarios/${idUsuario}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: novoEmailUsuario,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Usuário atualizado com sucesso:", data);
        carregarListaUsuarios();
      })
      .catch((error) => console.error("Erro ao atualizar o usuário:", error));
  }
}

// Atualizar celular
function abrirDialogTelefone() {
  var dialog = document.getElementById("formAtualizarTelefone");
  dialog.style.display = "block";

  var userId = event.target.dataset.id;
  document.getElementById("userId").value = userId;
}

function fecharDialogTelefone() {
  var dialog = document.getElementById("formAtualizarTelefone");
  dialog.style.display = "none";
}

function atualizarCelularUsuario() {
  const novoTelefoneUsuario = document.getElementById(
    "novoTelefoneUsuario"
  ).value;
  const idUsuario = document.getElementById("userId").value;

  if (novoTelefoneUsuario === "") {
    alert("Por favor, preencha o campo.");
  } else if (!verificarTelefone(novoTelefoneUsuario)) {
    alert("Telefone inválido!");
  } else {
    fetch(`http://localhost:3000/usuarios/${idUsuario}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        telefone: novoTelefoneUsuario,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Usuário atualizado com sucesso:", data);
        carregarListaUsuarios();
      })
      .catch((error) => console.error("Erro ao atualizar o usuário:", error));
  }
}

// Atualizar senha
function abrirDialogSenha() {
  var dialog = document.getElementById("formAtualizarSenha");
  dialog.style.display = "block";

  var userId = event.target.dataset.id;
  document.getElementById("userId").value = userId;
}

function fecharDialogSenha() {
  var dialog = document.getElementById("formAtualizarSenha");
  dialog.style.display = "none";
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
      senha: novaSenhaUsuario,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Usuário atualizado com sucesso:", data);
      carregarListaUsuarios();
    })
    .catch((error) => console.error("Erro ao atualizar o usuário:", error));
}
