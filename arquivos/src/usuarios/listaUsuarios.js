document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3000/usuarios")
    .then((response) => response.json())
    .then((data) => {
      const userList = document.getElementById("userList");
      data.forEach((usuarios) => {
        const listaItem = document.createElement("li");
        listaItem.textContent = `Nome: ${usuarios.nomeUsuario}, Email: ${usuarios.email}`;
        userList.appendChild(listaItem);
      });
    })
    .catch((error) =>
      console.error("Ocorreu um erro ao carregar o arquivo JSON:", error)
    );
});



