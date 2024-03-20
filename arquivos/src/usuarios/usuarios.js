// Adiciona um event listener para o carregamento do DOM
document.addEventListener("DOMContentLoaded", function () {
  var iframe = document.createElement("iframe");
  iframe.classList.add("iframe");

  // Define as coordenadas de Saõ Leopoldo e o nível de zoom do mapa
  var coordenadas = "-29.754732,-51.151758";
  var zoomNivel = 14;

  iframe.src = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.783434388408!2d-51.1855521!3d-29.6533521!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9519f6d3e1e86b5d%3A0x6e88d38f6e1e1e0!2sS%C3%A3o%20Leopoldo%2C%20RS%2C%20Brazil!5e0!3m2!1sen!2suk!4v1672580595752!5m2!1sen!2suk&ll=${coordenadas}&z=${zoomNivel}`;

  // Seleciona o elemento main da página e adiciona o iframe a ele
  var body = document.querySelector("body");
  body.appendChild(iframe);
});

function openDialog() {
  let customDialog = document.getElementById("loginForm");
  let form = document.getElementById("form");
  let loginRegister = document.getElementById("registerForm");
  form.style.display = "block";
  customDialog.style.display = "block";
  loginRegister.style.display = "none";
}

// Quando o evento "blur" é acionado (ou seja, quando o campo de entrada perde o foco),
// a função de retorno de chamada do ouvinte de eventos é executada.
// Essa função de retorno de chamada verifica se o valor do campo de entrada é vazio.
// Se o valor do campo de entrada for vazio, o texto placeholder é adicionado de volta ao campo de
// entrada.
//=
function placeHolderNomeLogin() {
  let nome = document.getElementById("loginNome");

  nome.placeholder = "";

  nome.addEventListener("blur", function () {
    if (nome.placeholder === "") {
      nome.placeholder = "Informe seu nome";
    }
  });
}

function placeHolderSenhaLogin() {
  let senha = document.getElementById("loginSenha");

  senha.placeholder = "";

  senha.addEventListener("blur", function () {
    if (senha.placeholder === "") {
      senha.placeholder = "Digite sua senha";
    }
  });
}

function placeHolderNome() {
  let nome = document.getElementById("nomeUsuario");

  nome.placeholder = "";

  nome.addEventListener("blur", function () {
    if (nome.placeholder === "") {
      nome.placeholder = "Informe seu nome";
    }
  });
}

function placeHolderTelefone() {
  let telefone = document.getElementById("telefone");

  telefone.placeholder = "";

  telefone.addEventListener("blur", function () {
    if (telefone.placeholder === "") {
      telefone.placeholder = "Telefone";
    }
  });
}

function placeHolderEmail() {
  let email = document.getElementById("email");

  email.placeholder = "";

  email.addEventListener("blur", function () {
    if (email.placeholder === "") {
      email.placeholder = "Email";
    }
  });
}

function placeHolderSenha() {
  let senha = document.getElementById("senha");

  senha.placeholder = "";

  senha.addEventListener("blur", function () {
    if (senha.placeholder === "") {
      senha.placeholder = "Senha";
    }
  });
}

function placeHolderConfirmarSenha() {
  let confirmarSenha = document.getElementById("confirmarSenha");

  confirmarSenha.placeholder = "";

  confirmarSenha.addEventListener("blur", function () {
    if (confirmarSenha.placeholder === "") {
      confirmarSenha.placeholder = "Confirmar Senha";
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
}

function adicionarUsuario() {
  const nomeUsuario = document.getElementById("nomeUsuario").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;
  const senha = document.getElementById("senha").value;

  if(nomeUsuario === "" || email === "" || telefone === "" || senha === ""){
    alert ("Dados incompletos, por favor, preencha os dados." );
  }

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


/////////////////login things

function toggleSidebar() {
  var sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
}


const loginForm = document.getElementById("loginForm");

loginForm.addEventListener('submit', (e)=>{
  e.preventDefault();

  const userName = document.getElementById("loginNome").value;
  const passWord = document.getElementById("loginSenha").value;

  fetch(`http://localhost:3000/usuarios/${userName}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
  .then((response)=> response.json())
  .then((data)=>{
    if(data.nomeUsuario === userName && data.senha === passWord){
      console.log("bem vindo")
      
      
      const sidebar = document.createElement("div");
      sidebar.id = "sidebar";
      sidebar.classList.add("sidebar");
      sidebar.innerHTML = `
        <a href="#" class="close-btn" onclick="toggleSidebar()">Fechar</a>
        <ul>
          <li><a href="#">Item 1</a></li>
          <li><a href="#">Item 2</a></li>
          <li id="listaUsuarios"><a href="usuarios.html">Usuários</a></li>
        </ul>
      `;
      document.body.appendChild(sidebar);

      
      toggleSidebar();
      closeDialog();
    }else{
      console.error("Usuario não encontrado")
    }
  })
})