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

  // document.addEventListener("click", function (event) {
  //   var saoLeopoldoArea = document.querySelector(".iframe");
  //     if (!saoLeopoldoArea.contains(event.target)) {
  //       alert("Não pode passar dessa área!");
  //     }
  //   });
});

function openDialog() {
  let customDialog = document.getElementById("loginForm");
  let form = document.getElementById("form");
  form.style.display = "block";
  customDialog.style.display = "block";

  // document.addEventListener("click", function (event) {
  //   var dialog = document.querySelector(".dialog");
  //   if (!dialog.contains(event.target)) {
  //     alert("Não pode!");
  //   }
  // });
}

function cadastrar() {
  let dialogRegister = document.getElementById("registerForm");
  let form = document.getElementById("form");
  form.style.display = "block";
  dialogRegister.style.display = "block";

  // let customDialog = document.getElementById("customDialog");
  // customDialog.style.display = "none";
}

function closeDialog() {
  document.getElementById("form").style.display = "none";
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "none";
}

function openRegister() {

}
