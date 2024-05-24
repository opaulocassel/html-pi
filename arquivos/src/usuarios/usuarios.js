var teste = false
window.addEventListener('DOMContentLoaded', () => {
  const nomeUsuario = sessionStorage.getItem('guardarNomes');
  if (nomeUsuario) {
    console.log(`Usuário ${nomeUsuario} já está logado.`);
    teste = true;
    console.log("tem coisa guardada")
  }
  if (teste === true) {
    console.log("tqa entrando")
    fetch(`http://localhost:3000/usuarios/nomeUsuario/${nomeUsuario}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let guardarNome = data.nomeUsuario;
        sessionStorage.setItem("guardarNome", JSON.stringify(guardarNome));

        console.log("bem vindo");

        let idUsuarioD = data.id;

        //   const sidebar = document.createElement("div");
        //   sidebar.id = "sidebar";
        //   sidebar.classList.add("sidebar");
        //   sidebar.innerHTML = `
        //   <div class="logo">
        //     <i class="bx bx-menu menu-icon"></i>
        //     <span class="logo-name">CodingLab</span>
        //   </div>
        //   <ul>
        //   <li><div class="intern-div-list"><i class="bi bi-person"><a onclick="dialogPerfil()" class="botaoPerfil" id="botaoPerfil"">Perfil</div></i></li>
        //   <li><div class="intern-div-list"><i class="bi bi-fuel-pump"><a href="postoteste.html">Postos</a></div></i></li>
        //     <li id="listaUsuarios"><div class="intern-div-list"><i class="bi bi-people"><a href="usuarios.html">Usuários</a></div></i></li>
        //     <li><div class="intern-div-list"><a href="#">Item 4</a></div></li>
        //     <li><div class="intern-div-list"><a href="#">Item 5</a></div></li>
        //   </ul>
        // `;
        //   document.body.appendChild(sidebar);

        toggleSidebar();
        closeDialog();

        carregarListaUsuarios();
      });
  }
});

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
  const styleSelector = document.getElementById("theme");

  styleSelector.addEventListener("click", () => {
    if (styleSelector.checked) {
      styleSelector.value = "night";
    } else {
      styleSelector.value = "default";
    }
  });

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
      postoData: null,
    });

    marker.addListener("click", () => {
      if (!marker.postoData) {
        fetch("http://localhost:3000/postos")
          .then((response) => response.json())
          .then(function (data) {
            const posto = data.find(
              (posto) =>
                posto.nomePosto === item.title && posto.cnpjPosto === item.cnpj
            );

            if (posto) {
              marker.postoData = posto;
              const infoContent = `
              <div class="containerCard">
        <div class="postCard">
            <div class="header_postCard">
                <img src="https://lh3.googleusercontent.com/p/AF1QipPDFKOVHu7EAl20edZ_mhsrGPBKdLnJt6PAn938=s680-w680-h510"
                    alt="">
            </div>

            <div class="body_postCard">
                <div class="postCard_content">

                    <article class="property">
                        <section class="property__main-info">
                            <h3 class="property__title">${posto.nomePosto}</h3>
                            <span class="property__price">${posto.comumPosto}</span>
                            <span class="property__location">
                                <i class="icon icon-location bi bi-geo-alt-fill">
                                </i>
                                ${posto.enderecoPosto}, ${posto.ruaPosto}
                            </span>
                        </section>
                    </article>

                    <div class="containerCard_infos">
                        <div class="flex items-center pt-2">
                            <div class="bg-cover bg-center w-10 h-10 rounded-full mr-3"
                                style="background-image: url(https://seeklogo.com/images/P/Petrobras-logo-03DABEE0AC-seeklogo.com.png)">
                            </div>
                            <div>
                                <p class="preco font-bold text-gray-900">Aditivado: ${posto.aditivadaPosto}</p>
                                <p class="preco font-bold text-gray-900">Diesel: ${posto.dieselPosto}</p>
                                <p class="preco font-bold text-gray-900">Álcool: ${posto.alcoolPosto}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
          .catch((error) => {
            console.error("Erro ao carregar os dados do JSON:", error);
          });
      }
    });

    google.maps.event.addListener(infowindow, "closeclick", function () {
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
    cnpj: "98.765.432/0001-00",
  },
  {
    position: { lat: -29.755732, lng: -51.151758 },
    title: `Petrobras`,
    icon: "../assets/petrobras.png",
    cnpj: "98.765.432/0002-00",
  },
  {
    position: { lat: -29.753685, lng: -51.158149 },
    title: `Ipiranga`,
    icon: "../assets/ipiranga.svg",
    cnpj: "98.765.432/0003-00",
  },
  {
    position: { lat: -29.766428, lng: -51.147854 },
    title: `Shell`,
    icon: "../assets/shell.png",
    cnpj: "98.765.432/0004-00",
  },
  {
    position: { lat: -29.759836, lng: -51.16273 },
    title: `Shell`,
    icon: "../assets/shell.png",
    cnpj: "98.765.432/0010-00",
  },
  {
    position: { lat: -29.760916, lng: -51.148297 },
    title: `Shell`,
    icon: "../assets/shell.png",
    cnpj: "98.765.432/0006-00",
  },
  {
    position: { lat: -29.752073, lng: -51.154189 },
    title: `Shell`,
    icon: "../assets/shell.png",
    cnpj: "98.765.432/0007-00",
  },
  {
    position: { lat: -29.757141, lng: -51.159584 },
    title: `Petrobras`,
    icon: "../assets/petrobras.png",
    cnpj: "98.765.432/0005-00",
  },
  {
    position: { lat: -29.763635, lng: -51.150783 },
    title: `Petrobras`,
    icon: "../assets/petrobras.png",
    cnpj: "98.765.432/0008-00",
  },
  {
    position: { lat: -29.756921, lng: -51.162999 },
    title: `Petrobras`,
    icon: "../assets/petrobras.png",
    cnpj: "98.765.432/0011-00",
  },
  {
    position: { lat: -29.768202, lng: -51.153444 },
    title: `Ipiranga`,
    icon: "../assets/ipiranga.svg",
    cnpj: "98.765.432/0006-00",
  },
  {
    position: { lat: -29.755404, lng: -51.160889 },
    title: `Ipiranga`,
    icon: "../assets/ipiranga.svg",
    cnpj: "98.765.432/0009-00",
  },
  {
    position: { lat: -29.758839, lng: -51.15581 },
    title: `Ipiranga`,
    icon: "../assets/ipiranga.svg",
    cnpj: "98.765.432/0012-00",
  },
  {
    position: { lat: -29.761726, lng: -51.157442 },
    title: `Ipiranga`,
    icon: "../assets/ipiranga.svg",
    cnpj: "98.765.432/0015-00",
  },
  {
    position: { lat: -29.758324, lng: -51.158045 },
    title: `Ipiranga`,
    icon: "../assets/ipiranga.svg",
    cnpj: "98.765.432/0018-00",
  },
  {
    position: { lat: -29.754737, lng: -51.15524 },
    title: `Petrobras`,
    icon: "../assets/petrobras.png",
    cnpj: "98.765.432/0014-00",
  },
  {
    position: { lat: -29.757909, lng: -51.153172 },
    title: `Petrobras`,
    icon: "../assets/petrobras.png",
    cnpj: "98.765.432/0017-00",
  },
  {
    position: { lat: -29.761582, lng: -51.152891 },
    title: `Petrobras`,
    icon: "../assets/petrobras.png",
    cnpj: "98.765.432/0020-00",
  },
  {
    position: { lat: -29.762942, lng: -51.150462 },
    title: `Shell`,
    icon: "../assets/shell.png",
    cnpj: "98.765.432/0008-00",
  },
  {
    position: { lat: -29.764342, lng: -51.148842 },
    title: `Ipiranga`,
    icon: "../assets/ipiranga.svg",
    cnpj: "98.765.432/0019-00",
  },
  {
    position: { lat: -29.767342, lng: -51.148942 },
    title: `Petrobras`,
    icon: "../assets/petrobras.png",
    cnpj: "98.765.432/0021-00",
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

// function toggleSideExit() {
//   var sidebar = document.querySelector(".sidebar")

//   document.body.removeChild(sidebar);
// }

function dialogPerfil() {
  // toggleSideExit();

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
  const navBar = document.querySelector("nav"),
    menuBtns = document.querySelectorAll(".menu-icon"),
    overlay = document.querySelector(".overlaySidebar");
  menuBtns.forEach((menuBtn) => {
    menuBtn.addEventListener("click", () => {
      navBar.classList.toggle("open");
    });
  });
  overlay.addEventListener("click", () => {
    navBar.classList.remove("open");
  });
}

function toggleSideLar() {
  document.getElementById("form").style.display = "none";
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("formPerfil").style.display = "none";

  let overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.parentNode.removeChild(overlay);
  }

  sessionStorage.removeItem("guardarNomes");
  sessionStorage.removeItem("guardarNome");

  var listaItem = document.querySelector(".usuario");
  let userList = document.getElementById("formPerfil");

  userList.removeChild(listaItem);

  var sidebar = document.querySelector("nav");

  document.body.removeChild(sidebar);
}

let idUsuarioD;

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userName = document.getElementById("loginNome").value;
  const passWord = document.getElementById("loginSenha").value;
  let isLoggedIn = sessionStorage.getItem('guardarNome') !== null;

  const encoder = new TextEncoder();
  const data = encoder.encode(passWord);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashSenha = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  fetch(`http://localhost:3000/usuarios/nomeUsuario/${userName}`, {
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

        sessionStorage.setItem("guardarNomes", userName);

        let guardarSenha = data.senha;

        sessionStorage.setItem("guardarSenha", JSON.stringify(guardarSenha));

        sessionStorage.setItem("guardarSenhas", hashSenha);

        console.log("bem vindo");

        idUsuarioD = data.id;
        sessionStorage.setItem("idUsuarioDs", idUsuarioD);

        //   const sidebar = document.createElement("nav");
        //   sidebar.id = "sidebar";
        //   sidebar.classList.add("sidebar");
        //   sidebar.innerHTML = `
        //   <div>
        //     <ul>
        //       <li><div class="intern-div-list"><i class="bi bi-person"><a onclick="dialogPerfil();" class="botaoPerfil" id="botaoPerfil"">Perfil</div></i></li>
        //       <li><div class="intern-div-list"><i class="bi bi-fuel-pump-fill"><a href="postoteste.html">Postos</a></div></i></li>
        //       <li id="listaUsuarios"><div class="intern-div-list"><i class="bi bi-people"><a href="usuarios.html">Usuários</a></div></i></li>
        //       <li><div class="intern-div-list"><a href="#">Item 4</a></div></li>
        //       <li><div class="intern-div-list"><a href="#">Item 5</a></div></li>
        //     </ul>
        //   </div>
        // `;
        // document.body.appendChild(sidebar);

        toggleSidebar();
        closeDialog();

        carregarListaUsuarios();
      } else {
        console.error("Usuario não encontrado");
      }
    });
});

function carregarListaUsuarios() {
  const idUsuarioD = sessionStorage.getItem("idUsuarioDs");
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
                                    <p class="text-secondary mb-1">Sâo Leopoldo</p>
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
                                    *************
                                </div>
                                <div class="col-sm-3 text-secondary">
                                  <button class="dialogButton" onClick="abrirDialogSenha()" data-id="${usuario.id}">Atualizar</button>
                                </div>
                            </div>
                          </div>
                      </div>
                      <button class="deleteButton" onClick="excluirUsuario(${usuario.id})">Excluir</button>
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
  fetch(`http://localhost:3000/usuarios/id/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Usuário excluído com sucesso:", data);
      carregarListaUsuarios();
      toggleSideLar();
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

// function closePerfilDialog() {
//   var listaItem = document.querySelector(".usuario");
//   let userList = document.getElementById("formPerfil");

//   userList.removeChild(listaItem);

//   const nomeUsuario = sessionStorage.getItem('guardarNomes');
//     if (nomeUsuario) {
//       console.log(`Usuário ${nomeUsuario} já está logado.`);
//       teste = true;
//       console.log("tem coisa guardada")
//     }
//     if (teste === true) {
//       console.log("tqa entrando")
//       fetch(`http://localhost:3000/usuarios/${nomeUsuario}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           let guardarNome = data.nomeUsuario;
//           sessionStorage.setItem("guardarNome", JSON.stringify(guardarNome));

//           console.log("bem vindo");

//           idUsuarioD = data.id;

//           const sidebar = document.createElement("div");
//           sidebar.id = "sidebar";
//           sidebar.classList.add("sidebar");
//           sidebar.innerHTML = `
//           <ul>
//           <li><div class="intern-div-list"><i class="bi bi-person"><a onclick="dialogPerfil()" class="botaoPerfil" id="botaoPerfil"">Perfil</div></i></li>
//           <li><div class="intern-div-list"><i class="bi bi-fuel-pump"><a href="postoteste.html">Postos</a></div></i></li>
//             <li id="listaUsuarios"><div class="intern-div-list"><i class="bi bi-people"><a href="usuarios.html">Usuários</a></div></i></li>
//             <li><div class="intern-div-list"><a href="#">Item 4</a></div></li>
//             <li><div class="intern-div-list"><a href="#">Item 5</a></div></li>
//           </ul>
//         `;
//           document.body.appendChild(sidebar);

//           toggleSidebar();
//           closeDialog();

//           carregarListaUsuarios();
//         });
//     }
// }



            //   <div class="card">
            //   <div class="cardBody">
            //     <h5 class="cardTitulo">${posto.nomePosto}</h5>
            //     <h6 class="cardSubtitulo mb-2 text-muted">Endereço</h6>
            //     <p class="cardTexto">Cidade: ${posto.enderecoPosto}</p>
            //     <p class="cardTexto">Cidade: ${posto.ruaPosto}</p>
            //   </div>
            // </div>
            // <div class="card">
            //   <div class="cardBody">
            //     <h6 class="cardSubtitulo mb-2 text-muted">Preços</h6>
            //     <p class="cardTexto">Comum: ${posto.comumPosto}</p>
            //     <p class="cardTexto">Aditivado: ${posto.aditivadaPosto}</p>
            //     <p class="cardTexto">Diesel: ${posto.dieselPosto}</p>
            //     <p class="cardTexto">Álcool: ${posto.alcoolPosto}</p>
            //     <p class="cardTexto">Última atualização: ${posto.data}</p>
            //   </div>
            // </div>
