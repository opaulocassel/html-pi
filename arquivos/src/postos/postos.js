function adicionarPosto() {
    const nomePosto = document.getElementById("nomePosto").value;
    const enderecoPosto = document.getElementById("endereçoPosto").value;
    const cnpjPosto = document.getElementById("cnpjPosto").value;
    const comumPosto = document.getElementById("comumPosto").value;
    const aditivadaPosto = document.getElementById("aditivadaPosto").value;
    const dieselPosto = document.getElementById("dieselPosto").value;
    const alcoolPosto = document.getElementById("alcoolPosto").value;
  
    if(nomePosto === "" || enderecoPosto === "" || cnpjPosto === "" || comumPosto === "" || aditivadaPosto === "" || dieselPosto === "" || alcoolPosto === ""){
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
        cnpjPosto: cnpjPosto,
        comumPosto: comumPosto,
        aditivadaPosto: aditivadaPosto,
        dieselPosto: dieselPosto,
        alcoolPosto: alcoolPosto
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("alert")
      })
      .catch((error) => console.error("Erro:", error));
      
  }