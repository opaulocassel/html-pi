document.addEventListener("DOMContentLoaded", function () {
  carregarListaUsuarios()
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
              </div>
              
              <div class="email">
                <h4>Email: </h4><p>${usuarios.email}</p>
              </div>

              <div class="buttonDiv">
                <button class="updateButton" id="updateButton" onClick="excluir()">Atualizar</button>
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