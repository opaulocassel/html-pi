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

  let myArray = [].concat(locations);

  // Adicionar.
  const infowindow = new google.maps.InfoWindow();
  let pulaPula;

  for (let item of myArray) {
    let marker = new google.maps.Marker({
      position: item.position,
      label: item.label,
      title: item.title,
      icon: {
        url: item.icon,
        scaledSize: new google.maps.Size(40, 40),
      },
      map: map,
      animation: google.maps.Animation.DROP,
      postoData: null
    });

    marker.addListener("click", () => {
      if (!marker.postoData) {
        fetch("http://localhost:3000/postos")
          .then((response) => response.json())
          .then(function (data) {

            const posto = data.find(posto => posto.nomePosto === item.title && posto.id === item.id);
            
            if (posto) {
              marker.postoData = posto;
              const infoContent = `
                <div class="window">
                  <h2>${posto.nomePosto}</h2>
                  <p>Endereço: ${posto.enderecoPosto}</p>
                  <p>CNPJ: ${posto.cnpjPosto}</p>
                  <p>Comum: ${posto.comumPosto}</p>
                  <p>Aditivado: ${posto.aditivadaPosto}</p>
                  <p>Diesel: ${posto.dieselPosto}</p>
                  <p>Álcool: ${posto.alcoolPosto}</p>
                  <p>Última atualização: ${posto.data}</p>
                </div>
              `;
              infowindow.setContent(infoContent);
              infowindow.open(map, marker);
  
              if (pulaPula) {
                pulaPula.setAnimation(null);
              }
              marker.setAnimation(google.maps.Animation.BOUNCE);
              pulaPula = marker;
            }
          })
          .catch(error => {
            console.error('Erro ao carregar os dados do JSON:', error);
          });
      } 
    });
  
    google.maps.event.addListener(infowindow, 'closeclick', function () {
      marker.setAnimation(null);
    });
  }

  //Remover
  //marker.setMap(null);
}

let locations = [
  {
    position: { lat: -29.754732, lng: -51.151758 },
    title: `Shell`,
    icon: "../assets/shell.png",
    id: 1
  },
  {
    position: { lat: -29.755732, lng: -51.151758 },
    title: `Petrobras`,
    icon: "../assets/petrobras.png",
    id: 1

  },
  {
    position: { lat: -29.753685, lng: -51.158149 },
    title: `Ipiranga`,
    icon: "../assets/ipiranga.svg",
    id: 1

  },
  {
    position: { lat: -29.766428, lng: -51.147854 },
    title: `Shell`,
    icon: "../assets/shell.png",
    id: 2

  },
  {
    position: { lat: -29.759836, lng: -51.16273 },
    title: `Shell`,
    icon: "../assets/shell.png",
    id: 3

  },
  {
    position: { lat: -29.760916, lng: -51.148297 },
    title: `Shell`,
    icon: "../assets/shell.png",
    id: 4

  },
  {
    position: { lat: -29.752073, lng: -51.154189 },
    title: `Shell`,
    icon: "../assets/shell.png",
    id: 5

  },
  {
    position: { lat: -29.757141, lng: -51.159584 },
    title: `Petrobras`,
    icon: "../assets/petrobras.png",
    id: 2

  },
  {
    position: { lat: -29.763635, lng: -51.150783 },
    title: `Petrobras`,
    icon: "../assets/petrobras.png",
    id: 3

  },
  {
    position: { lat: -29.756921, lng: -51.162999 },
    title: `Petrobras`,
    icon: "../assets/petrobras.png",
    id: 4

  },
  {
    position: { lat: -29.768202, lng: -51.153444 },
    title: `Ipiranga`,
    icon: "../assets/ipiranga.svg",
    id: 2

  },
  {
    position: { lat: -29.755404, lng: -51.160889 },
    title: `Ipiranga`,
    icon: "../assets/ipiranga.svg",
    id: 3

  },
  {
    position: { lat: -29.758839, lng: -51.15581 },
    title: `Ipiranga`,
    icon: "../assets/ipiranga.svg",
    id: 4

  },
  {
    position: { lat: -29.761726, lng: -51.157442 },
    title: `Ipiranga`,
    icon: "../assets/ipiranga.svg",
    id: 5

  },
  {
    position: { lat: -29.758324, lng: -51.158045 },
    title: `Ipiranga`,
    icon: "../assets/ipiranga.svg",
    id: 6

  },
  {
    position: { lat: -29.754737, lng: -51.15524 },
    title: `Petrobras`,
    icon: "../assets/petrobras.png",
    id: 5

  },
  {
    position: { lat: -29.757909, lng: -51.153172 },
    title: `Petrobras`,
    icon: "../assets/petrobras.png",
    id: 6

  },
  {
    position: { lat: -29.761582, lng: -51.152891 },
    title: `Petrobras`,
    icon: "../assets/petrobras.png",
    id: 7

  },
  {
    position: { lat: -29.762942, lng: -51.150462 },
    title: `Shell`,
    icon: "../assets/shell.png",
    id: 6

  },
  {
    position: { lat: -29.764342, lng: -51.148842 },
    title: `Ipiranga`,
    icon: "../assets/ipiranga.svg",
    id: 7

  },
];

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

  customDialog.style.zIndex = "2000";
  form.style.zIndex = "2000";
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
          <li><div class="intern-div-list"><a onclick="dialogPerfil()" class="botaoPerfil" id="botaoPerfil"">Perfil</div></li>
          <li><div class="intern-div-list"><a href="postoteste.html">Postos</a></div></li>
          <li id="listaUsuarios"><div class="intern-div-list"><a href="usuarios.html">Usuários</a></div></li>
          <li><div class="intern-div-list"><a href="#">Item 4</a></div></li>
          <li><div class="intern-div-list"><a href="#">Item 5</a></div></li>
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
      <div class="container">
        <div class="main-body">
            <div class="row gutters-sm">
                <div class="col-md-4 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex flex-column align-items-center text-center">
                            <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Admin"
                                    class="rounded-circle" width="150">                    
                                <div class="mt-3">
                                    <h4>${usuario.nomeUsuario}</h4>
                                    <p class="text-secondary mb-1">fffffffff</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="card mb-3">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-3">
                                    <h6 class="mb-0">Nome completo</h6>
                                </div>
                                <div class="col-sm-9 text-secondary">
                                    ${usuario.nomeUsuario}
                                </div>
                                <div class="col-sm-3 text-secondary">
                                  <button class="dialogButton" onClick="abrirDialogNome()" data-id="${usuario.id}">Atualizar</button>
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-sm-3">
                                    <h6 class="mb-0">Email</h6>
                                </div>
                                <div class="col-sm-9 text-secondary">
                                    ${usuario.email}
                                </div>
                                <div class="col-sm-3 text-secondary">
                                  <button class="dialogButton" onClick="abrirDialogEmail()" data-id="${usuario.id}">Atualizar</button>
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-sm-3">
                                    <h6 class="mb-0">Celular</h6>
                                </div>
                                <div class="col-sm-9 text-secondary">
                                    ${usuario.telefone}
                                </div>
                                <div class="col-sm-3 text-secondary">
                                  <button class="dialogButton" onClick="abrirDialogTelefone()" data-id="${usuario.id}">Atualizar</button>
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-sm-3">
                                    <h6 class="mb-0">Senha</h6>
                                </div>
                                <div class="col-sm-9 text-secondary">
                                    ${usuario.senha}
                                </div>
                                <div class="col-sm-3 text-secondary">
                                  <button class="dialogButton" onClick="abrirDialogSenha()" data-id="${usuario.id}">Atualizar</button>
                                </div>
                            </div>
                            <hr>
                          </div>
                      </div>
                  </div>
              </div>
         </div>
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
