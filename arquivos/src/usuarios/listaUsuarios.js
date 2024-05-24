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

async function atualizarNomeUsuario() {
  const antigoNomeUsuario = document.getElementById("antigoNomeUsuario").value;
  const novoNomeUsuario = document.getElementById("novoNomeUsuario").value;
  const confirmeSenhaNome = document.getElementById("confirmeSenhaNome").value;
  const idUsuario = document.getElementById("userId").value;

  const encoder = new TextEncoder();
  const data = encoder.encode(confirmeSenhaNome);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashSenha = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  fetch(`http://localhost:3000/usuarios/nomeUsuario/${antigoNomeUsuario}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (
        antigoNomeUsuario === "" ||
        novoNomeUsuario === "" ||
        confirmeSenhaNome === ""
      ) {
        alert("Preencha todos os campos");
      } else if (novoNomeUsuario === "admin" || novoNomeUsuario === "Admin") {
        alert("Nome de usuário não pode ser admin");
      } else if (
        !verificarNome(antigoNomeUsuario) ||
        !verificarNome(novoNomeUsuario)
      ) {
        alert("Nome de usuário inválido");
      } else if (data.nomeUsuario !== antigoNomeUsuario) {
        console.log(data.nomeUsuario);

        alert("Nome de usuário não encontrado");
      } else if (data.senha !== hashSenha) {
        alert("Senha não confere");
      } else {
        let guardarNome = novoNomeUsuario;
        sessionStorage.setItem("guardarNome", JSON.stringify(guardarNome));

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
          .catch((error) =>
            console.error("Erro ao atualizar o usuário:", error)
          );
      }
    });
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

async function atualizarEmailUsuario() {
  const antigoEmailUsuario = document.getElementById("emailUsuario").value;
  const novoEmailUsuario = document.getElementById("novoEmailUsuario").value;
  const confirmeSenhaEmail =
    document.getElementById("confirmeSenhaEmail").value;
  const idUsuario = document.getElementById("userId").value;

  const encoder = new TextEncoder();
  const data = encoder.encode(confirmeSenhaEmail);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashSenha = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  fetch(`http://localhost:3000/usuarios/email/${antigoEmailUsuario}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (
        antigoEmailUsuario === "" ||
        novoEmailUsuario === "" ||
        confirmeSenhaEmail === ""
      ) {
        console.log(antigoEmailUsuario);
        console.log(novoEmailUsuario);
        console.log(confirmeSenhaEmail);
        console.log(idUsuario);

        alert("Preencha todos os campos corretamente");
      } else if (
        !verificarEmail(novoEmailUsuario) ||
        !verificarEmail(antigoEmailUsuario)
      ) {
        alert("Email inválido");
      } else if (data.email !== antigoEmailUsuario) {
        alert("Email não existe");
      } else if (data.senha !== hashSenha) {
        alert("Senha incorreta");
      } else {
        let guardarEmail = novoEmailUsuario;
        sessionStorage.setItem("guardarEmail", JSON.stringify(guardarEmail));

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
          .catch((error) =>
            console.error("Erro ao atualizar o usuário:", error)
          );
      }
    });
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

async function atualizarCelularUsuario() {
  const antigoTelefoneUsuario =document.getElementById("telefoneUsuario").value;
  const novoTelefoneUsuario = document.getElementById("novoTelefoneUsuario").value;
  const confirmeSenhaTelefone = document.getElementById("confirmeSenhaTelefone").value;
  const idUsuario = document.getElementById("userId").value;

  const encoder = new TextEncoder();
  const data = encoder.encode(confirmeSenhaTelefone);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashSenha = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  fetch(`http://localhost:3000/usuarios/telefone/${antigoTelefoneUsuario}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (
        antigoTelefoneUsuario === "" ||
        novoTelefoneUsuario === "" ||
        confirmeSenhaTelefone === ""
      ) {
        alert("Preencha todos os campos corretamente");
      } else if (
        !verificarTelefone(antigoTelefoneUsuario) ||
        !verificarTelefone(novoTelefoneUsuario)
      ) {
        alert("Telefone inválido");
      } else if (data.telefone !== antigoTelefoneUsuario) {
        alert("Telefone atual não corresponde ao telefone do usuário");
      } else if (data.senha !== hashSenha) {
        alert("Senha incorreta");
      } else {
        let guardarTelefone = novoTelefoneUsuario;
        sessionStorage.setItem(
          "guardarTelefone",
          JSON.stringify(guardarTelefone)
        );

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
          .catch((error) =>
            console.error("Erro ao atualizar o usuário:", error)
          );
      }
    });
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

async function atualizarSenhaUsuario() {
  const antigaSenhaUsuario = document.getElementById("senhaUsuario").value;
  const novaSenhaUsuario = document.getElementById("novaSenhaUsuario").value;
  const confirmeSenha = document.getElementById("confirmeSenha").value;
  const idUsuario = document.getElementById("userId").value;

  const encoder = new TextEncoder();
  const data = encoder.encode(antigaSenhaUsuario);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashSenha = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  fetch(`http://localhost:3000/usuarios/senha/${hashSenha}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(async (data) => {
      if(antigaSenhaUsuario === "" || novaSenhaUsuario === "" || confirmeSenha === ""){
        alert("Preencha todos os campos");
      } else if (data.senha !== hashSenha){
        alert("Senha antiga incorreta!");
      } else if (novaSenhaUsuario !== confirmeSenha){
        alert("As senhas não conferem!");
      } else {

        let guardarsenha = confirmeSenha;
        sessionStorage.setItem("guardarsenha",JSON.stringify(guardarsenha));

          fetch(`http://localhost:3000/usuarios/${idUsuario}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              senha: confirmeSenha,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Usuário atualizado com sucesso:", data);
              carregarListaUsuarios();
            })
            .catch((error) => console.error("Erro ao atualizar o usuário:", error));
      }
    
    })

}