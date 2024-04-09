async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  console.log("Inicio da função.");

  map = new Map(document.getElementById("map"), {
    center: { lat: -29.754732, lng: -51.151758 },
    zoom: 16,
    mapTypeId: "roadmap",
    mapTypeControl: false,
  });

  console.log("Depois do map.");

  const styleControl = document.getElementById("controleSelecao");
  map.controls.push(styleControl);

  const styleSelector = document.getElementById("selecao");

  map.setOptions({ styles: styles[styleSelector.value] });
  styleSelector.addEventListener("change", () => {
    map.setOptions({ styles: styles[styleSelector.value] });
  });

  console.log("Eu funciono, mas não apareço.");
}

const styles = {
  default: [
    {
      featureType: "poi.business",
      stylers: [{ visibility: "off" }],
    },
    {
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
  ],
  night: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#242f3e" }],
    },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "poi.business",
      stylers: [{ visibility: "off" }],
    },
    {
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
  ],
};

document.addEventListener("DOMContentLoaded", function () {
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

function modoCor() {}

function openDialog() {
  let customDialog = document.getElementById("loginForm");
  let form = document.getElementById("form");
  let loginRegister = document.getElementById("registerForm");
  form.style.display = "block";
  customDialog.style.display = "block";
  loginRegister.style.display = "none";

  let overlay = document.getElementById("overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "overlay";
    document.body.appendChild(overlay);
  }

  customDialog.style.zIndex = "1000";
  form.style.zIndex = "1000";
  loginRegister.style.zIndex = "1000";
}

function dialogPerfil() {
  let customDialog = document.getElementById("perfilForm");
  let form = document.getElementById("formPerfil");
  form.style.display = "block";
  customDialog.style.display = "block";

  let overlay = document.getElementById("overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "overlay";
    document.body.appendChild(overlay);
  }

  customDialog.style.zIndex = "1000";
  form.style.zIndex = "1000";
}

// Quando o evento "blur" é acionado (ou seja, quando o campo de entrada perde o foco),
// a função de retorno de chamada do ouvinte de eventos é executada.
// Essa função de retorno de chamada verifica se o valor do campo de entrada é vazio.
// Se o valor do campo de entrada for vazio, o texto placeholder é adicionado de volta ao campo de
// entrada.
//=

function adicionarPlaceholder(inputId, placeholderText) {
  let inputElement = document.getElementById(inputId);

  inputElement.placeholder = "";

  inputElement.addEventListener("blur", function () {
    if (inputElement.placeholder === "") {
      inputElement.placeholder = placeholderText;
    }
  });
}

function cadastrar() {
  let dialogRegister = document.getElementById("registerForm");
  dialogRegister.style.display = "block";
  let customDialog = document.getElementById("loginForm");
  customDialog.style.display = "none";
}

function closeDialog() {
  document.getElementById("form").style.display = "none";
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("formPerfil").style.display = "none";

  let overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.parentNode.removeChild(overlay);
  }
}

function verificarEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

function verificarTelefone(telefone) {
  const regex = /^\d{11}$/;
  return regex.test(telefone);
}

function verificarNome(nome) {
  const regex = /^[\p{L}\s]+$/u;
  return regex.test(nome);
}

function adicionarUsuario() {
  const nomeUsuario = document.getElementById("nomeUsuario").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  if (nomeUsuario === "" || email === "" || telefone === "" || senha === "") {
    alert("Dados incompletos, por favor, preencha os dados.");
  } else if (
    nomeUsuario === "admin" ||
    nomeUsuario === "Admin" ||
    !verificarNome(nomeUsuario)
  ) {
    alert("Nome de usuário proibido.");
  } else if (!verificarEmail(email)) {
    alert("E-mail inválido");
  } else if (!verificarTelefone(telefone)) {
    alert("Telefone inválido");
  } else if (senha !== confirmarSenha) {
    alert("As senhas devem ser iguais.");
  } else {
    fetch("http://localhost:3000/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nomeUsuario: nomeUsuario,
        email: email,
        telefone: telefone,
        senha: senha,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.error("Erro:", error));
  }
}

/////////////////login things

function toggleSidebar() {
  var sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
}

let idUsuarioD;

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userName = document.getElementById("loginNome").value;
  const passWord = document.getElementById("loginSenha").value;

  const encoder = new TextEncoder();
  const data = encoder.encode(passWord);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashSenha = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  fetch(`http://localhost:3000/usuarios/${userName}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.nomeUsuario === userName && data.senha === hashSenha) {
        let guardarNome = data.nomeUsuario;
        sessionStorage.setItem("guardarNome", JSON.stringify(guardarNome));

        console.log("bem vindo");

        idUsuarioD = data.id;

        const sidebar = document.createElement("div");
        sidebar.id = "sidebar";
        sidebar.classList.add("sidebar");
        sidebar.innerHTML = `
        <a href="#" class="close-btn" onclick="toggleSidebar()">Fechar</a>
        <ul>
          <li><a onclick="dialogPerfil()" class="botaoPerfil" id="botaoPerfil""</a>Perfil</li>
          <li><a href="postoteste.html">Postos</a></li>
          <li id="listaUsuarios"><a href="perfil.html">Usuários</a></li>
          <li><a href="#">Item 4</a></li>
          <li><a href="#">Item 5</a></li>
        </ul>
      `;
        document.body.appendChild(sidebar);

        toggleSidebar();
        closeDialog();

        carregarListaUsuarios();
      } else {
        console.error("Usuario não encontrado");
      }
    });
});

function carregarListaUsuarios() {
  console.log(idUsuarioD);

  fetch(`http://localhost:3000/usuarios/id/${idUsuarioD}`)
    .then((response) => response.json())
    .then(function (usuario) {
      let userList = document.getElementById("formPerfil");
      if (!userList) {
        console.error("Elemento userList não encontrado.");
        return;
      }

      const listaItem = document.createElement("div");
      listaItem.classList.add("usuario");
      listaItem.id = `times${listaItem.id}`;

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

function atualizarNomeUsuario() {
  const novoNomeUsuario = document.getElementById("novoNomeUsuario").value;
  const idUsuario = document.getElementById("userId").value;

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
    .catch((error) => console.error("Erro ao atualizar o usuário:", error));
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
