var teste = false
window.addEventListener('DOMContentLoaded', () => {
  const nomeUsuario = sessionStorage.getItem('guardarNomes');
  if (nomeUsuario) {
    console.log(`Usuário ${nomeUsuario} já está logado.`);
    teste = true;
    console.log("tem coisa guardada")
  }
  if (teste === true) {
    const tristeza = document.getElementById("botaoHome")
    tristeza.style.display = "none"
    const layout = document.getElementById("layout")
    layout.style.display = "block"
    const botaoLauncher = document.getElementById("botao_hidden")
    botaoLauncher.style.display = 'block'
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

        const adminApenas = document.getElementById("adminApenas")
        const adminApenas2 = document.getElementById("adminApenas2")
        const usuarioApenas1 = document.getElementById("usuarioApenas1")
        const usuarioApenas2 = document.getElementById("usuarioApenas2")

        if (guardarNome !== "Admin") {
          console.log(guardarNome)
          adminApenas.style.display = "none";
          adminApenas2.style.display = "none";
        } else if (guardarNome === "Admin"){
          usuarioApenas1.style.display = "none";
          usuarioApenas2.style.display = "none";
        }
        closeDialog();

        carregarListaUsuarios();
      });
  }


});

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  console.log("Inicio da função.");

  // variaveis da rota do mapa
  var origemMarker = null;
  var destinoMarker = null;
  // 

  map = new Map(document.getElementById("map"), {
    center: { lat: -29.754732, lng: -51.151758 },
    zoom: 16,
    mapTypeId: "roadmap",
    mapTypeControl: false,
  });

  console.log("Depois do map.");

  const styleControl = document.getElementById("controleSelecao");
  if (styleControl) {
    map.controls.push(styleControl);
    const styleSelector = document.getElementById("theme");
    if (styleSelector) {
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
    }
  }

  // calculo de rota
  var directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
  });

  map.addListener("click", function (event) {
    if (origemMarker == null) {
      origemMarker = new google.maps.Marker({
        position: event.latLng,
        map: map,
      });
      document.getElementById("origem").value =
        event.latLng.lat() + ", " + event.latLng.lng();
    } else if (destinoMarker == null) {
      destinoMarker = new google.maps.Marker({
        position: event.latLng,
        map: map,
      });
      document.getElementById("destino").value =
        event.latLng.lat() + ", " + event.latLng.lng();
      var directionsService = new google.maps.DirectionsService();
      var request = {
        origin: document.getElementById("origem").value,
        destination: document.getElementById("destino").value,
        travelMode: "DRIVING",
      };

      directionsService.route(request, function (result, status) {
        if (status == "OK") {
          directionsRenderer.setDirections(result);
        }
      });
    } else {
      origemMarker.setMap(null);
      destinoMarker.setMap(null);
      origemMarker = new google.maps.Marker({
        position: event.latLng,
        map: map,
      });
      destinoMarker = null;
      document.getElementById("origem").value =
        event.latLng.lat() + ", " + event.latLng.lng();
      document.getElementById("destino").value = "";
      directionsRenderer.set("directions", null);
    }
  });

  console.log("Eu funciono, mas não apareço.");

  let myArray = [].concat(locations);

  // Adicionar.
  infowindows = [new google.maps.InfoWindow(), new google.maps.InfoWindow()];
  let pulaPula;

  // 
  let postosData;
  try {
    const response = await fetch("http://localhost:3000/postos");
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    postosData = await response.json();
  } catch (error) {
    console.error("Erro ao carregar os dados do JSON:", error);
    return;
  }

  for (let item of locations) {
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

    markers.push(marker);

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
              marker.postoData.id = posto.id; // certifique-se de que o ID está sendo atribuído
              const infoContent = generateInfoContent(posto);
              infowindows[0].setContent(infoContent);
              infowindows[0].open(map, marker);

              if (pulaPula) {
                pulaPula.setAnimation(null);
              }
              marker.setAnimation(google.maps.Animation.BOUNCE);
              pulaPula = marker;

              console.log("Posto encontrado e dados atribuídos:", posto);
            }
          })
          .catch((error) => {
            console.error("Erro ao carregar os dados do JSON:", error);
          });
      } else {
        const infoContent = generateInfoContent(marker.postoData);
        infowindows[0].setContent(infoContent);
        infowindows[0].open(map, marker);

        if (pulaPula) {
          pulaPula.setAnimation(null);
        }
        marker.setAnimation(google.maps.Animation.BOUNCE);
        pulaPula = marker;

        console.log("Dados do posto já disponíveis:", marker.postoData);
      }
    });
    google.maps.event.addListener(infowindows[0], "closeclick", function () {
      marker.setAnimation(null);
    });
  }
  // adicionar eventos de fechamento para os infowindows
  infowindows.forEach(infowindow => {
    google.maps.event.addListener(infowindow, 'closeclick', fecharComparacao);
  });

  console.log("Marcadores:", markers);
}

// calculo
function calcular() {
  var origem = document.getElementById('origem').value;
  var destino = document.getElementById('destino').value;
  var consumo = document.getElementById('consumo').value;
  var preco = document.getElementById('preco').value;
  const layout = document.getElementById("layout");

  if (origem === '' || destino === '' || consumo === '' || preco === '') {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  var origemCoords = origem.split(',').map(Number);
  var destinoCoords = destino.split(',').map(Number);

  if (origemCoords.length !== 2 || destinoCoords.length !== 2) {
    alert('Por favor, insira coordenadas válidas.');
    return;
  }

  var lat1 = origemCoords[0] * Math.PI / 180;
  var lon1 = origemCoords[1] * Math.PI / 180;
  var lat2 = destinoCoords[0] * Math.PI / 180;
  var lon2 = destinoCoords[1] * Math.PI / 180;

  var dLat = lat2 - lat1;
  var dLon = lon2 - lon1;

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  var c = 2 * Math.asin(Math.sqrt(a));
  var R = 6371;
  var distancia = R * c;

  var consumoCombustivel = distancia / parseFloat(consumo);
  var valorCombustivel = consumoCombustivel * parseFloat(preco);

  console.log("KM: " + distancia);
  console.log("Combustível consumido durante o percurso: " + consumoCombustivel);
  console.log("Valor do combustível consumido: " + valorCombustivel);

  document.getElementById('distanciaKM').innerText = 'Distância: ' + distancia.toFixed(2) + ' km';
  document.getElementById('consumoCombustivel').innerText = 'Consumo: ' + consumoCombustivel.toFixed(2) + 'litros';
  document.getElementById('valorCombustivel').innerText = 'Valor: R$ ' + valorCombustivel.toFixed(2);

  var resultadoDiv = document.getElementById('resultado');
  resultadoDiv.style.display = 'block';
  resultadoDiv.style.position = 'absolute';
  document.querySelector('.layout').style.maxHeight = '3000px';
}

function abrirLauncher() {
  const launcherMenu = document.getElementById('launcherMenu');
  if (launcherMenu.style.display === 'none' || launcherMenu.style.display === '') {
    launcherMenu.style.display = 'block';
  } else {
    launcherMenu.style.display = 'none';
  }

  document.querySelector('.nav_launcher').style.maxHeight = '1000px';
}

function fecharComparacao() {
  postosSelecionados = [];
  cardsSelecionados = [];
  document.querySelectorAll('.selected').forEach(card => card.classList.remove('selected'));
  infowindows.forEach(infowindow => infowindow.close());
}

function generateInfoContent(posto) {
  const cardId = `card-${posto.id}`;
  return `
    <div class="containerCard" id="${cardId}">
      <div class="postCard">
        <div class="header_postCard">
          <img src="https://lh3.googleusercontent.com/p/AF1QipPDFKOVHu7EAl20edZ_mhsrGPBKdLnJt6PAn938=s680-w680-h510" alt="">
        </div>
        <div class="body_postCard">
          <div class="postCard_content">
            <article class="property">
              <section class="property__main-info">
                <h3 class="property__title">${posto.nomePosto}</h3>
                <div class="property_options">
                  <span class="property__price">R$${posto.comumPosto}</span>
                  <button class="buttonComparar" onclick="adicionarParaComparar(${posto.id})">Comparar preço</button>
                </div>
                <span class="property__location">
                  <i class="icon icon-location bi bi-geo-alt-fill"></i>
                  ${posto.enderecoPosto}, ${posto.ruaPosto}
                </span>
              </section>
            </article>
            <div class="containerCard_infos">
              <div class="flex items-center pt-2">
                <div class="bg-cover bg-center w-10 h-10 rounded-full mr-3" style="background-image: url(https://seeklogo.com/images/P/Petrobras-logo-03DABEE0AC-seeklogo.com.png)"></div>
                <div class="advants">
                  <div><span class="font-bold text-gray-900">Aditivada</span><div><i class="bi bi-fuel-pump-fill"></i><span class="aditivada_price">${posto.aditivadaPosto}</span></div></div>
                  <div><span class="font-bold text-gray-900">Diesel</span><div><i class="bi bi-fuel-pump-diesel-fill"></i><span class="diesel_price">${posto.dieselPosto}</span></div></div>
                  <div><span class="font-bold text-gray-900">Álcool</span><div><i class="bi bi-fuel-pump-fill"></i><span class="alcool_price">${posto.alcoolPosto}</span></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

let postosSelecionados = [];
let markers = [];
let infowindows = [];
let cards = {};
let cardsSelecionados = [];

function adicionarParaComparar(id) {
  console.log('Adicionando posto para comparação:', id);
  fetch(`http://localhost:3000/postos/${id}`)
    .then(response => response.json())
    .then(posto => {
      console.log('Posto encontrado:', posto);
      const index = postosSelecionados.findIndex(p => p.id === posto.id);
      if (index === -1) {
        postosSelecionados.push(posto);
        console.log('Posto adicionado para comparação:', posto);
        if (cardsSelecionados.length < 2) {
          const cardId = `card-${posto.id}`;
          const card = document.getElementById(cardId);
          if (card) {
            cardsSelecionados.push(card);
          }
        }
      }
      atualizarComparacao();
    })
    .catch(error => console.error('Erro ao buscar detalhes do posto:', error));
}

function atualizarComparacao() {
  console.log('Atualizando comparação');
  if (postosSelecionados.length === 2) {
    const [posto1, posto2] = postosSelecionados;
    console.log('Comparando postos:', posto1, posto2);

    const compararPreco = (preco1, preco2) => {
      if (preco1 > preco2) return 'price-higher bi bi-arrow-up-short';
      if (preco1 < preco2) return 'price-lower bi bi-arrow-down-short';
      return 'price-equal';
    };

    function updateCard(card, posto, comparacaoPosto) {
      console.log('Atualizando card para posto:', posto);
      if (card) {
        console.log('Card encontrado:', card);
        const priceElement = card.querySelector('.property__price');
        if (priceElement) {
          priceElement.textContent = `R$${posto.comumPosto}`;
          priceElement.classList = `property__price ${compararPreco(posto.comumPosto, comparacaoPosto.comumPosto)}`;
        } else {
          console.error('Elemento .property__price não encontrado no card:', card);
        }

        const aditivadaPriceElement = card.querySelector('.aditivada_price');
        if (aditivadaPriceElement) {
          aditivadaPriceElement.textContent = `R$${posto.aditivadaPosto}`;
          aditivadaPriceElement.classList = `aditivada_price ${compararPreco(posto.aditivadaPosto, comparacaoPosto.aditivadaPosto)}`;
        } else {
          console.error('Elemento .aditivada_price não encontrado no card:', card);
        }

        const dieselPriceElement = card.querySelector('.diesel_price');
        if (dieselPriceElement) {
          dieselPriceElement.textContent = `R$${posto.dieselPosto}`;
          dieselPriceElement.classList = `diesel_price ${compararPreco(posto.dieselPosto, comparacaoPosto.dieselPosto)}`;
        } else {
          console.error('Elemento .diesel_price não encontrado no card:', card);
        }

        const alcoolPriceElement = card.querySelector('.alcool_price');
        if (alcoolPriceElement) {
          alcoolPriceElement.textContent = `R$${posto.alcoolPosto}`;
          alcoolPriceElement.classList = `alcool_price ${compararPreco(posto.alcoolPosto, comparacaoPosto.alcoolPosto)}`;
        } else {
          console.error('Elemento .alcool_price não encontrado no card:', card);
        }
      } else {
        console.error('Card não encontrado:', card);
      }
    }

    cardsSelecionados.forEach(card => {
      updateCard(card, posto1, posto2);
      updateCard(card, posto2, posto1);
    });
  }
}

let locations = [
  {
    position: { lat: -29.76571766080124, lng: -51.1536088575591 },
    title: `Shell`,
    icon: "../assets/shell.png",
    cnpj: "98.765.432/0001-00",
  },
  {
    position: { lat: -29.77165322548305, lng: -51.15246713209309 },
    title: `Petrobras`,
    icon: "../assets/petrobras.png",
    cnpj: "98.765.432/0002-00",
  },
  {
    position: { lat: -29.768822109525967, lng: -51.1486047510307 },
    title: `Ipiranga`,
    icon: "../assets/ipiranga.svg",
    cnpj: "98.765.432/0003-00",
  },
  {
    position: { lat: -29.770163477086143, lng: -51.13481461727824 },
    title: `Shell`,
    icon: "../assets/shell.png",
    cnpj: "98.765.432/0004-00",
  },
  {
    position: { lat: -29.771516625470833, lng: -51.1487813444181 },
    title: `Shell`,
    icon: "../assets/shell.png",
    cnpj: "98.765.432/0007-00",
  },
  {
    position: { lat: -29.773937914474764, lng: -51.14560560919936 },
    title: `Petrobras`,
    icon: "../assets/petrobras.png",
    cnpj: "98.765.432/0011-00",
  },
  {
    position: { lat: -29.768039813358275, lng: -51.14345490992033 },
    title: `Ipiranga`,
    icon: "../assets/ipiranga.svg",
    cnpj: "98.765.432/0006-00",
  },
  {
    position: { lat: -29.760924363061367, lng: -51.12440049777646 },
    title: `Ipiranga`,
    icon: "../assets/ipiranga.svg",
    cnpj: "98.765.432/0009-00",
  },
  {
    position: { lat: -29.77806252063475, lng: -51.15547047700039 },
    title: `Ipiranga`,
    icon: "../assets/ipiranga.svg",
    cnpj: "98.765.432/0018-00",
  },
  {
    position: { lat: -29.780955363913904, lng: -51.14261783930873 },
    title: `Petrobras`,
    icon: "../assets/petrobras.png",
    cnpj: "98.765.432/0014-00",
  },
  {
    position: { lat: -29.782334617364427, lng: -51.12167393295767 },
    title: `Petrobras`,
    icon: "../assets/petrobras.png",
    cnpj: "98.765.432/0017-00",
  },
  {
    position: { lat: -29.778662245071185, lng: -51.1473298685254 },
    title: `Petrobras`,
    icon: "../assets/petrobras.png",
    cnpj: "98.765.432/0020-00",
  },
];

const styles = {
  default: [
    { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [{ color: "#c9b2a6" }],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "geometry.stroke",
      stylers: [{ color: "#dcd2be" }],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [{ color: "#ae9e90" }],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [{ color: "#dfd2ae" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#dfd2ae" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#93817c" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [{ color: "#a5b076" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#447530" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#f5f1e6" }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#fdfcf8" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#f8c967" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#e9bc62" }],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry",
      stylers: [{ color: "#e98d58" }],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry.stroke",
      stylers: [{ color: "#db8555" }],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [{ color: "#806b63" }],
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [{ color: "#dfd2ae" }],
    },
    {
      featureType: "transit.line",
      elementType: "labels.text.fill",
      stylers: [{ color: "#8f7d77" }],
    },
    {
      featureType: "transit.line",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#ebe3cd" }],
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [{ color: "#dfd2ae" }],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [{ color: "#b9d3c2" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#92998d" }],
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

function modoCor() { }
function modoCor() { }

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
  let form = document.getElementById("formPerfil");

  form.style.display = "block";
  form.style.zIndex = "2000";

  let overlay = document.getElementById("overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "overlay";
    document.body.appendChild(overlay);
  }

}

function dialogAjuda(){
  let form = document.getElementById("formAjuda");
  form.style.display = "block";
  form.style.zIndex = "2000";

  let overlay = document.getElementById("overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "overlay";
    document.body.appendChild(overlay);
  }
}

function dialogSobre(){
  let form = document.getElementById("formSobre");
  form.style.display = "block";
  form.style.zIndex = "2000";

  let overlay = document.getElementById("overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "overlay";
    document.body.appendChild(overlay);
  }
}

function perguntas(id){
  const pergunta1 = document.getElementById("pergunta1");
  const pergunta2 = document.getElementById("pergunta2");
  const pergunta3 = document.getElementById("pergunta3");
  const pergunta4 = document.getElementById("pergunta4");


  if(pergunta1 === id){
  resposta1.style.display = "block";
  resposta1.style.zIndex = "2000";
  } else if (pergunta2 === id){
    resposta2.style.display = "block";
    resposta2.style.zIndex = "2000"
    } else if (pergunta3 === id){
      resposta3.style.display = "block";
      resposta3.style.zIndex = "2000";
    } else if (pergunta4 === id){
      resposta4.style.display = "block";
      resposta4.style.zIndex = "2000";
    }
  
  let overlay = document.getElementById("overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "overlay";
    document.body.appendChild(overlay);
  }
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

function toggleSideLar() {
  const tristeza = document.getElementById("botaoHome")
  tristeza.style.display = "block"

  document.getElementById("form").style.display = "none";
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("formPerfil").style.display = "none";

  sessionStorage.removeItem("guardarNomes");
  sessionStorage.removeItem("guardarNome");

  var listaItem = document.querySelector(".usuario");
  let userList = document.getElementById("formPerfil");

  userList.removeChild(listaItem);

  const deslogar = document.getElementById("logoutBar")

  const navBar = document.querySelector("nav")

  deslogar.addEventListener("click", () => {
    navBar.classList.remove("open");
  });

  location.reload();
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

        
        const adminApenas = document.getElementById("adminApenas")
        const adminApenas2 = document.getElementById("adminApenas2")
        const usuarioApenas1 = document.getElementById("usuarioApenas1")
        const usuarioApenas2 = document.getElementById("usuarioApenas2")

        if (guardarNome !== "Admin") {
          console.log(guardarNome)
          adminApenas.style.display = "none";
          adminApenas2.style.display = "none";
        } else if (guardarNome === "Admin"){
          usuarioApenas1.style.display = "none";
          usuarioApenas2.style.display = "none";
        }

        closeDialog();
        carregarListaUsuarios();

        const botaoLauncher = document.getElementById("botao_hidden")
        botaoLauncher.style.display = 'block'
        const tristeza = document.getElementById("botaoHome")
        tristeza.style.display = "none"
        const layout = document.getElementById("layout")
        layout.style.display = "block"
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
                            <img src="https://d1w2poirtb3as9.cloudfront.net/default.jpeg?Expires=1718870015&Signature=j2Yv4m7jTQ8ZPp38buEiGuzlI5iJ223qzgkNlmayUmWKhcKQ1dt0vIjSmTuHGIQvN4dxxaRA7AyV2N7gw7FvTxSAarKpNjPWY~Bik7EfDlJq5gbuPOTz1UT8DIi0Vf2wnNTTBueu2BFmfFdVrd4H5Cv2aOiYHuMgaFh0eiz4qkEHsOGAr4h~pZ-Px~vx50ZWMay5q1wZ4whbFiKwaL1TCrsMLKdMNUZJzQJc07kEnWTttDYmvGgZSgDq22~KSg5I~kfD3cDbstBUIZzUrs4M5TyOkZYiPFGo~DCimgTzhlhEJ0saHoxb9WFFt~ScBXBC3H0SMWJxXDa6LbOdIhA~0A__&Key-Pair-Id=K36LFL06Z5BT10" alt="Admin"
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
                      
                  </div>
              </div>
              <button class="deleteButton" onClick="excluirUsuario(${usuario.id})">Excluir Conta</button>
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
  const antigoTelefoneUsuario = document.getElementById("telefoneUsuario").value;
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
      if (antigaSenhaUsuario === "" || novaSenhaUsuario === "" || confirmeSenha === "") {
        alert("Preencha todos os campos");
      } else if (data.senha !== hashSenha) {
        alert("Senha antiga incorreta!");
      } else if (novaSenhaUsuario !== confirmeSenha) {
        alert("As senhas não conferem!");
      } else {

        let guardarsenha = confirmeSenha;
        sessionStorage.setItem("guardarsenha", JSON.stringify(guardarsenha));

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

function closePerfilDialog() {
  let form = document.getElementById("formPerfil");
  form.style.display = "none";


  let overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.parentNode.removeChild(overlay);
  }
}

function closeSobreDialog() {
  let form = document.getElementById("formSobre");
  form.style.display = "none";


  let overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.parentNode.removeChild(overlay);
  }
}

function closeAjudaDialog(){
  let form = document.getElementById("formAjuda");
  const resposta1 = document.getElementById("resposta1");
  const resposta2 = document.getElementById("resposta2");
  const resposta3 = document.getElementById("resposta3");
  const resposta4 = document.getElementById("resposta4");
  resposta1.style.display = "none";
  resposta2.style.display = "none";
  resposta3.style.display = "none";
  resposta4.style.display = "none";
  form.style.display = "none";


  let overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.parentNode.removeChild(overlay);
  }
}

function closePergunta1(){
  let resposta1 = document.getElementById("resposta1");
  resposta1.style.display = "none";
}

function closePergunta2(){
  let resposta2 = document.getElementById("resposta2");
  resposta2.style.display = "none";
}

function closePergunta3(){
  let resposta3 = document.getElementById("resposta3");
  resposta3.style.display = "none";
}

function closePergunta4(){
  let resposta4 = document.getElementById("resposta4");
  resposta4.style.display = "none";
}

function enviarMensagem() {
  const nome = document.getElementById("ajudaNome").value;
  const email = document.getElementById("ajudaEmail").value;
  const texto = document.getElementById("mensagem").value;

  if (nome !== "" && email !== "" && texto !== "") {
    alert("Mensagem enviada.");
    
  } else {
    alert("Por favor, preencha todos os campos.");
  }
  nome = "";
    email = "";
    texto = "";
}

// barra de pesquisa
async function procurarPostos() {
  let input = document.getElementById('searchbar').value.toLowerCase();
  let resultados = document.querySelector('.postList');
  resultados.innerHTML = "";

  try {
    const response = await fetch('http://localhost:3000/postos', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const dados = await response.json();
    let emptyArray = [];
    for (let i = 0; i < dados.length; i++) {
      let objeto = dados[i];
      if (objeto.nomePosto.toLowerCase().includes(input) || objeto.enderecoPosto.toLowerCase().includes(input) || objeto.ruaPosto.toLowerCase().includes(input) ) {
        const postoData = {
          id: objeto.id,
          nomePosto: objeto.nomePosto,
          enderecoPosto: objeto.enderecoPosto,
          ruaPosto: objeto.ruaPosto,
        };
        emptyArray.push(postoData);
      }
    }
    if (input) {
      showSuggestions(emptyArray);
    } else {
      searchWrapper.classList.remove("active");
    }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

const searchWrapper = document.querySelector(".barra-pesquisa");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".postList");
const icon = searchWrapper.querySelector(".icon");

inputBox.onkeyup = (e) => {
  procurarPostos();
};

function select(elemento) {
  let postoId = elemento.getAttribute('data-id');
  let postoNome = elemento.getAttribute('data-nome-posto');

  console.log("Selecionado:", { postoId, postoNome }); // Ae João, log para verificar.

  if (!postoId) {
    console.error("Posto não encontrado: ID não definido");
    return;
  }

  let marker = markers.find(marker => marker.postoData && marker.postoData.id == postoId);

  if (marker) {
    // Se o marcador já tem dados, ele mostra o card.
    displayPostoCard(marker);
  } else {
    // Se o marcador não tem dados, carrega os dados e depois exibe o card.
    fetchPostoData(postoId);
  }
}

function displayPostoCard(marker) {
  const posto = marker.postoData;
  const infoContent = generateInfoContent(posto);
  infowindows[0].setContent(infoContent);
  infowindows[0].open(map, marker);
  map.setCenter(marker.getPosition());
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => marker.setAnimation(null), 1400);
  }

  inputBox.value = posto.nomePosto;

  searchWrapper.classList.remove("active");
}

async function fetchPostoData(postoId) {
  try {
    const response = await fetch('http://localhost:3000/postos', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const dados = await response.json();
    const posto = dados.find(posto => posto.id == postoId);

    if (posto) {
      let marker = markers.find(marker => marker.postoData && marker.postoData.id == postoId);
      if (!marker) {
        marker = markers.find(marker => marker.title === posto.nomePosto);
      }

      if (marker) {
        marker.postoData = posto;
        displayPostoCard(marker);
      } else {
        console.error("Marcador do posto não encontrado:", postoId);
      }
    } else {
      console.error("Dados do posto não encontrados:", postoId);
    }
  } catch (error) {
    console.error('Erro ao carregar os dados do JSON:', error);
  }
}


function showPostCard(posto) {
  const cardContent = generateInfoContent(posto);
  const containerCard = document.querySelector(".containerCard");

  if (containerCard) {
    containerCard.innerHTML = cardContent;
  } else {
    const newCardContainer = document.createElement("div");
    newCardContainer.classList.add("containerCard");
    newCardContainer.innerHTML = cardContent;
    document.querySelector(".wrapper").appendChild(newCardContainer);
  }
}

function showSuggestions(list) {
  suggBox.innerHTML = "";

  const exibirBandeira = (nomePosto) => {
    if (nomePosto == 'Shell') return '<img src="../assets/shell.png">';
    if (nomePosto == 'Ipiranga') return '<img src="../assets/ipiranga.svg">';
    if (nomePosto == 'Petrobras') return '<img src="../assets/petrobras.png">'
  };

  if (list.length === 0) {
    const userValue = inputBox.value;
    const li = document.createElement("li");
    li.textContent = userValue;
    suggBox.appendChild(li);
  } else {
    list.forEach(data => {
      const li = document.createElement("li");
      li.innerHTML = `
      ${exibirBandeira(data.nomePosto)}
      <div class="conteudoResultado">
        <div class="conteudoNome">
          ${data.nomePosto} 
        </div>
        <div class="conteudoHorario">
          <p>Aberto: 08:00 até 22:00</p>
        </div>
        <div class="conteudoEndereco">
          <i class="icon icon-location bi bi-geo-alt-fill"></i>
          ${data.enderecoPosto}, ${data.ruaPosto}
        </div>
      </div>
      `;
      li.setAttribute('data-id', data.id);
      li.setAttribute('data-nome-posto', data.nomePosto);
      li.onclick = () => select(li);
      suggBox.appendChild(li);

    });
  }
}