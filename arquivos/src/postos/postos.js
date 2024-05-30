document.addEventListener("DOMContentLoaded", function () {
  carregarListaPostos();

  document
    .getElementById("formAtualizarNome")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      atualizarNomePosto();
    });

    document
    .getElementById("formAtualizarEndereco")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      atualizarEnderecoPosto();
    });

    document
    .getElementById("formAtualizarRuaPosto")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      atualizarRuaPosto();
    });

    document
    .getElementById("formAtualizarCNPJ")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      atualizarCNPJPosto();
    });

    document
    .getElementById("formAtualizarComum")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      atualizarComumPosto();
    });

    document
    .getElementById("formAtualizarAditivada")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      atualizarAditivadaPosto();
    });

    document
    .getElementById("formAtualizarDiesel")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      atualizarDieselPosto();
    });
    
    document
    .getElementById("formAtualizarAlcool")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      atualizarAlcoolPosto();
    });
});

// CARREGA

function carregarListaPostos() {
  fetch("http://localhost:3000/postos")
    .then((response) => response.json())
    .then(function (data) {
      let userList = document.getElementById("userList");
      if (!userList) {
        console.error("Elemento userList não encontrado.");
        return;
      }
      userList.innerHTML = "";

      data.forEach(function (posto) {
        const listaItem = document.createElement("div");
        listaItem.classList.add("posto");

        listaItem.innerHTML = `
          <div>ID: ${posto.id}</div>
          <div>Nome: ${posto.nomePosto}</div>
          <div>Endereco: ${posto.enderecoPosto}</div>
          <div>Rua: ${posto.ruaPosto}</div>
          <div>CNPJ: ${posto.cnpjPosto}</div>
          <div>Gasolina Comum: ${posto.comumPosto}</div>
          <div>Gasolina Aditivada: ${posto.aditivadaPosto}</div>
          <div>Diesel: ${posto.dieselPosto}</div>
          <div>Alcool: ${posto.alcoolPosto}</div>
          <div class="botoes">
            <button class="dialogButton" onClick="abrirDialogNome()" data-id="${posto.id}">Atualizar Nome</button>
            <button class="dialogButton" onClick="abrirDialogEndereco()" data-id="${posto.id}">Atualizar Endereço</button>
            <button class="dialogButton" onClick="abrirDialogRuaPosto()" data-id="${posto.id}">Atualizar Rua</button>
            <button class="dialogButton" onClick="abrirDialogCNPJ()" data-id="${posto.id}">Atualizar CNPJ</button>
            <button class="dialogButton" onClick="abrirDialogComum()" data-id="${posto.id}">Atualizar Gasolina Comum</button>
            <button class="dialogButton" onClick="abrirDialogAditivada()" data-id="${posto.id}">Atualizar Gasolina Aditivada</button>
            <button class="dialogButton" onClick="abrirDialogDiesel()" data-id="${posto.id}">Atualizar Diesel</button>
            <button class="dialogButton" onClick="abrirDialogAlcool()" data-id="${posto.id}">Atualizar Álcool</button>
            <button class="deleteButton" onClick="excluirPosto(${posto.id})">Excluir</button>
          </div>
        `;
        userList.appendChild(listaItem);
      });
    })
    .catch((error) =>
      console.error("Ocorreu um erro ao carregar o arquivo JSON:", error)
    );
}

// COLOCAR INTRODUZIR ENFIAR 

function abrirDialogAdicionar() {
  var dialog = document.getElementById("adiciona");
  dialog.style.display = "block";
  dialog.style.top = "50%";
  dialog.style.left = "50%";
  dialog.style.transform = "translate(-50%, -50%)";
  dialog.style.display = "flex";
}

function fecharDialogAdicionar() {
  var dialog = document.getElementById("adiciona");
  dialog.style.display = "none";
}


function verificarCNPJ(CNPJ) {
  const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;
  return regex.test(CNPJ);
}

function verificarPrecoCombustivel(preco) {
  const regex = /^R\$ \d+(\,\d{2})?$/;
  return regex.test(preco);
}

function adicionarPosto() {
  // const foto = document.getElementById("foto").value;
  const nomePosto = document.getElementById("nomePosto").value;
  const enderecoPosto = document.getElementById("endereçoPosto").value;
  const ruaPosto = document.getElementById("ruaPosto").value;
  const cnpjPosto = document.getElementById("cnpjPosto").value;
  const comumPosto = document.getElementById("comumPosto").value;
  const aditivadaPosto = document.getElementById("aditivadaPosto").value;
  const dieselPosto = document.getElementById("dieselPosto").value;
  const alcoolPosto = document.getElementById("alcoolPosto").value;

  if (
    nomePosto === "" ||
    enderecoPosto === "" ||
    ruaPosto === "" ||
    cnpjPosto === "" ||
    comumPosto === "" ||
    aditivadaPosto === "" ||
    dieselPosto === "" ||
    alcoolPosto === ""
  ) {
    alert("Dados incompletos, por favor, preencha os dados.");
  }  else if (!verificarCNPJ(cnpjPosto)) {
    alert("O CNPJ deve estar no formato 00.000.000/0000-00");
  } else if (
    !verificarPrecoCombustivel(comumPosto) ||
    !verificarPrecoCombustivel(aditivadaPosto) ||
    !verificarPrecoCombustivel(dieselPosto) ||
    !verificarPrecoCombustivel(alcoolPosto)
  ) {
    alert("O preço deve estar no formato R$ 0,00");
  } else {
    fetch("http://localhost:3000/postos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // fotoPosto: foto,
        nomePosto: nomePosto,
        enderecoPosto: enderecoPosto,
        ruaPosto: ruaPosto,
        cnpjPosto: cnpjPosto,
        comumPosto: comumPosto,
        aditivadaPosto: aditivadaPosto,
        dieselPosto: dieselPosto,
        alcoolPosto: alcoolPosto,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Posto criado com sucesso:", data);
      })
      .catch((error) => console.error("Erro:", error));
  }
}


//DELETAR DELETAR DELETAR DELETAR DELETAR DELETAR DELETAAAAAAAAAAAAAAR

function excluirPosto(id) {
  fetch(`http://localhost:3000/postos/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Posto excluído com sucesso:", data);
      carregarListaPostos();
    })
    .catch((error) => console.error("Erro ao excluir posto:", error));
}


// ATUALIZAR NOME NESSE CARAIO

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

function atualizarNomePosto() {
  const antigoNomePosto = document.getElementById("antigoNomePosto").value;
  const novoNomePosto = document.getElementById("novoNomePosto").value;
  const idPosto = document.getElementById("userId").value;

  fetch(`http://localhost:3000/postos/nomePosto/${antigoNomePosto}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {

      if (antigoNomePosto === "" || novoNomePosto === "") {
        alert("Preencha os campos.");
      } else if (data.nomePosto !== antigoNomePosto){
        alert("Nome de posto não encontrado.")
      }else {
        fetch(`http://localhost:3000/postos/${idPosto}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nomePosto: novoNomePosto,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Posto atualizado com sucesso:", data);
          })
          .catch((error) => console.error("Erro ao atualizar o Posto:", error));
      }
    });
}

// ATUALIZAR ENDEREÇO 

function abrirDialogEndereco() {
  var dialog = document.getElementById("formAtualizarEndereco");
  dialog.style.display = "block";

  var userId = event.target.dataset.id;
  document.getElementById("userId").value = userId;
}

function fecharDialogEndereco() {
  var dialog = document.getElementById("formAtualizarEndereco");
  dialog.style.display = "none";
}

function atualizarEnderecoPosto() {
  const antigoEnderecoPosto = document.getElementById("antigoEnderecoPosto").value;
  const novoEnderecoPosto = document.getElementById("novoEnderecoPosto").value;
  const idPosto = document.getElementById("userId").value;


  fetch(`http://localhost:3000/postos/enderecoPosto/${antigoEnderecoPosto}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (antigoEnderecoPosto === "" || novoEnderecoPosto === "") {
        alert("Preencha os campos.");
      } else if (data.enderecoPosto !== antigoEnderecoPosto){
        alert("Endereço não encontrado.");
      } else {
        fetch(`http://localhost:3000/postos/${idPosto}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            enderecoPosto: novoEnderecoPosto,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Posto atualizado com sucesso:", data);
          })
          .catch((error) => console.error("Erro ao atualizar o Posto:", error));
      }
    })
}


function abrirDialogRuaPosto() {
  var dialog = document.getElementById("formAtualizarRuaPosto");
  dialog.style.display = "block";

  var userId = event.target.dataset.id;
  document.getElementById("userId").value = userId;
}

function fecharDialogRuaPosto() {
  var dialog = document.getElementById("formAtualizarRuaPosto");
  dialog.style.display = "none";
}

function atualizarRuaPosto() {
  const antigaRuaPosto = document.getElementById("antigaRuaPosto").value;
  const novaRuaPosto = document.getElementById("novaRuaPosto").value;
  const idPosto = document.getElementById("userId").value;

  fetch(`http://localhost:3000/postos/ruaPosto/${antigaRuaPosto}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (antigaRuaPosto === "" || novaRuaPosto === "") {
        alert("Preencha o campo.");
      } else if (data.ruaPosto !== antigaRuaPosto){
        alert("Rua atual não existe.")
      }else {
        fetch(`http://localhost:3000/postos/${idPosto}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ruaPosto: novaRuaPosto,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Posto atualizado com sucesso:", data);
          })
          .catch((error) => console.error("Erro ao atualizar o Posto:", error));
      }
    });
}
// ATUALIZAR CNPJ (calma cnpjoto)

function abrirDialogCNPJ() {
  var dialog = document.getElementById("formAtualizarCNPJ");
  dialog.style.display = "block";

  var userId = event.target.dataset.id;
  document.getElementById("userId").value = userId;
}

function fecharDialogCNPJ() {
  var dialog = document.getElementById("formAtualizarCNPJ");
  dialog.style.display = "none";
}

function atualizarCNPJPosto() {
  const antigoCNPJPosto = document.getElementById("antigoCNPJPosto").value.trim();
  const novoCNPJPosto = document.getElementById("novoCNPJPosto").value.trim();
  const idPosto = document.getElementById("userId").value.trim();

  fetch(`http://localhost:3000/postos/cnpjPosto/${encodeURIComponent(antigoCNPJPosto)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => response.json())
    .then((data) => {
      if (antigoCNPJPosto === "" || novoCNPJPosto === "") {
        alert("Preencha os campos.");
      } else if (data.cnpjPosto !== antigoCNPJPosto) {
        alert("CNPJ não encontrado.");
      } else if (!verificarCNPJ(novoCNPJPosto)) {
        alert("O CNPJ deve estar no formato 00.000.000/0000-00");
      } else {
        fetch(`http://localhost:3000/postos/${idPosto}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cnpjPosto: novoCNPJPosto,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Posto atualizado com sucesso:", data);
          })
          .catch((error) => console.error("Erro ao atualizar o Posto:", error));
      }
    })
    .catch((error) => {
      alert(error.message);
      console.error("Erro ao buscar o Posto:", error);
    });
}


// ATUALIZAR GASOLINA COMUM (alfa)

function abrirDialogComum() {
  var dialog = document.getElementById("formAtualizarComum");
  dialog.style.display = "block";

  var userId = event.target.dataset.id;
  document.getElementById("userId").value = userId;
}

function fecharDialogComum() {
  var dialog = document.getElementById("formAtualizarComum");
  dialog.style.display = "none";
}

function atualizarComumPosto() {
  const antigoComumPosto = document.getElementById("antigoComumPosto").value;
  const novoComumPosto = document.getElementById("novoComumPosto").value;
  const idPosto = document.getElementById("userId").value;

  fetch(`http://localhost:3000/postos/comumPosto/${antigoComumPosto}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => response.json())
    .then((data) => {
      if (antigoComumPosto === "" || novoComumPosto === "") {
        alert("Preencha os campos.");
      } else if (data.comumPosto !== antigoComumPosto){
          alert("Comum não encontrada.") 
      } else if(!verificarPrecoCombustivel(novoComumPosto)){
        alert("O preço deve estar no formato R$ 0,00")
      } else {
        fetch(`http://localhost:3000/postos/${idPosto}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comumPosto: novoComumPosto,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Posto atualizado com sucesso:", data);
          })
          .catch((error) => console.error("Erro ao atualizar o Posto:", error));
      }
    })
}

// ATUALIZAR GASOLINA ADITIVADA (beta)

function abrirDialogAditivada() {
  var dialog = document.getElementById("formAtualizarAditivada");
  dialog.style.display = "block";

  var userId = event.target.dataset.id;
  document.getElementById("userId").value = userId;
}

function fecharDialogAditivada() {
  var dialog = document.getElementById("formAtualizarAditivada");
  dialog.style.display = "none";
}

function atualizarAditivadaPosto() {
  const antigoAditivadaPosto = document.getElementById("antigoAditivadaPosto").value;
  const novoAditivadaPosto = document.getElementById("novoAditivadaPosto").value;
  const idPosto = document.getElementById("userId").value;

  fetch(`http://localhost:3000/postos/aditivadaPosto/${antigoAditivadaPosto}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => response.json())
    .then((data) => {
      if (antigoAditivadaPosto === "" ||novoAditivadaPosto === "") {
        alert("Preencha os campos.");
      } else if (data.aditivadaPosto !== antigoAditivadaPosto){
        alert("Aditivada não encontrada.")
      } else if (!verificarPrecoCombustivel(novoAditivadaPosto)){
        alert("O preço deve estar no formato R$ 0,00")
      } else {
        fetch(`http://localhost:3000/postos/${idPosto}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            aditivadaPosto: novoAditivadaPosto,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Posto atualizado com sucesso:", data);
          })
          .catch((error) => console.error("Erro ao atualizar o Posto:", error));
      }
    });
}

// DIESEL ninguém liga

function abrirDialogDiesel() {
  var dialog = document.getElementById("formAtualizarDiesel");
  dialog.style.display = "block";

  var userId = event.target.dataset.id;
  document.getElementById("userId").value = userId;
}

function fecharDialogDiesel() {
  var dialog = document.getElementById("formAtualizarDiesel");
  dialog.style.display = "none";
}

function atualizarDieselPosto() {
  const antigoDieselPosto = document.getElementById("antigoDieselPosto").value;
  const novoDieselPosto = document.getElementById("novoDieselPosto").value;
  const idPosto = document.getElementById("userId").value;

  fetch(`http://localhost:3000/postos/dieselPosto/${antigoDieselPosto}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => response.json())
    .then((data) => {
      if (antigoDieselPosto === "" || novoDieselPosto === "") {
        alert("Preencha os campos.");
      } else if (data.dieselPosto !== antigoDieselPosto){
        alert("Diesel não encontrado.")
      } else if (!verificarPrecoCombustivel(novoDieselPosto)){
        alert("O preço deve estar no formato R$ 0,00")
      } else {
        fetch(`http://localhost:3000/postos/${idPosto}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dieselPosto: novoDieselPosto,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Posto atualizado com sucesso:", data);
          })
          .catch((error) => console.error("Erro ao atualizar o Posto:", error));
      }
    });
}

// ATUALIZAR ALCOOL (kitzin dos guri)

function abrirDialogAlcool() {
  var dialog = document.getElementById("formAtualizarAlcool");
  dialog.style.display = "block";

  var userId = event.target.dataset.id;
  document.getElementById("userId").value = userId;
}

function fecharDialogAlcool() {
  var dialog = document.getElementById("formAtualizarAlcool");
  dialog.style.display = "none";
}

function atualizarAlcoolPosto() {
  const antigoAlcoolPosto = document.getElementById("antigoAlcoolPosto").value;
  const novoAlcoolPosto = document.getElementById("novoAlcoolPosto").value;
  const idPosto = document.getElementById("userId").value;

  fetch(`http://localhost:3000/postos/alcoolPosto/${antigoAlcoolPosto}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => response.json())
    .then((data) => {
      if (antigoAlcoolPosto === "" || novoAlcoolPosto === "") {
        alert("Preencha os campos.");
      } else if (data.alcoolPosto !== antigoAlcoolPosto){
        alert("Álcool não encontrado.")
      } else if (!verificarPrecoCombustivel(novoAlcoolPosto)){
        alert("O preço deve estar no formato R$ 0,00")
      } else {
        fetch(`http://localhost:3000/postos/${idPosto}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            alcoolPosto: novoAlcoolPosto,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Posto atualizado com sucesso:", data);
          })
          .catch((error) => console.error("Erro ao atualizar o Posto:", error));
      }
    });
}