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
}

function fecharDialogAdicionar() {
  var dialog = document.getElementById("adiciona");
  dialog.style.display = "none";
}


function adicionarPosto() {
    const nomePosto = document.getElementById("nomePosto").value;
    const enderecoPosto = document.getElementById("endereçoPosto").value;
    const ruaPosto = document.getElementById("ruaPosto").value;
    const cnpjPosto = document.getElementById("cnpjPosto").value;
    const comumPosto = document.getElementById("comumPosto").value;
    const aditivadaPosto = document.getElementById("aditivadaPosto").value;
    const dieselPosto = document.getElementById("dieselPosto").value;
    const alcoolPosto = document.getElementById("alcoolPosto").value;
  
    if(nomePosto === "" || enderecoPosto === "" || ruaPosto === "" || cnpjPosto === "" || comumPosto === "" || aditivadaPosto === "" || dieselPosto === "" || alcoolPosto === ""){
      alert ("Dados incompletos, por favor, preencha os dados." );
    }
  
    fetch("http://localhost:3000/postos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nomePosto: nomePosto,
        enderecoPosto: enderecoPosto,
        ruaPosto: ruaPosto,
        cnpjPosto: cnpjPosto,
        comumPosto: comumPosto,
        aditivadaPosto: aditivadaPosto,
        dieselPosto: dieselPosto,
        alcoolPosto: alcoolPosto
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Posto criado com sucesso:", data);
      })
      .catch((error) => console.error("Erro:", error));
      
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
  const novoNomePosto = document.getElementById("novoNomePosto").value;
  const idPosto = document.getElementById("userId").value;

  if (novoNomePosto === "") {
    alert("Preencha o campo.");
  } else {
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
  const novoEnderecoPosto = document.getElementById("novoEnderecoPosto").value;
  const idPosto = document.getElementById("userId").value;

  if (novoEnderecoPosto === "") {
    alert("Preencha o campo.");
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
  const novaRuaPosto = document.getElementById("novaRuaPosto").value;
  const idPosto = document.getElementById("userId").value;

  if (novaRuaPosto === "") {
    alert("Preencha o campo.");
  } else {
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
  const novoCNPJPosto = document.getElementById("novoCNPJPosto").value;
  const idPosto = document.getElementById("userId").value;

  if (novoCNPJPosto === "") {
    alert("Preencha o campo.");
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
  const novoComumPosto = document.getElementById("novoComumPosto").value;
  const idPosto = document.getElementById("userId").value;

  if (novoComumPosto === "") {
    alert("Preencha o campo.");
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
  const novoAditivadaPosto = document.getElementById("novoAditivadaPosto").value;
  const idPosto = document.getElementById("userId").value;

  if (novoAditivadaPosto === "") {
    alert("Preencha o campo.");
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
  const novoDieselPosto = document.getElementById("novoDieselPosto").value;
  const idPosto = document.getElementById("userId").value;

  if (novoDieselPosto === "") {
    alert("Preencha o campo.");
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
  const novoAlcoolPosto = document.getElementById("novoAlcoolPosto").value;
  const idPosto = document.getElementById("userId").value;

  if (novoAlcoolPosto === "") {
    alert("Preencha o campo.");
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
}