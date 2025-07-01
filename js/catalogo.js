// Verificamos si hay un usuario logueado
const usuario = localStorage.getItem("usuarioLogueado");
if (!usuario) {
  window.location.href = "login.html"; // Redirigir si entra sin login
} else {
  document.getElementById("saludo").textContent = `Bienvenido/a, ${usuario}`;
}

// Productos
const productos = [
  { nombre: "Mate de Madera", precio: 4500, imagen: "img/madera.jpg" },
  { nombre: "Mate Imperial", precio: 9500, imagen: "img/imperial.jpg" },
  { nombre: "Mate Camionero", precio: 7000, imagen: "img/camionero.jpg" },
  { nombre: "Mate de Vidrio", precio: 6000, imagen: "img/vidrio.jpg" }
];

const productosContainer = document.getElementById("productosContainer");
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function mostrarProductos(productosFiltrados) {
  productosContainer.innerHTML = "";

  productosFiltrados.forEach(prod => {
    const card = document.createElement("div");
    card.classList.add("producto");

    const esFavorito = favoritos.some(f => f.nombre === prod.nombre);

    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>$${prod.precio}</p>
      <button class="btn-agregar">Agregar al carrito</button>
      <button class="btn-fav">${esFavorito ? "❤️" : "🤍"}</button>
    `;

    productosContainer.appendChild(card);
  });

  asociarEventosAProductos();
}

function asociarEventosAProductos() {
  document.querySelectorAll(".producto").forEach(card => {
    const nombreProducto = card.querySelector("h3").textContent;
    const prodObj = productos.find(p => p.nombre === nombreProducto);

    const btnAgregar = card.querySelector(".btn-agregar");
    const btnFav = card.querySelector(".btn-fav");

    btnAgregar.addEventListener("click", () => {
      carrito.push(prodObj);
      guardarCarrito();
      actualizarCarrito();
    });

    btnFav.addEventListener("click", () => {
      const existe = favoritos.some(f => f.nombre === prodObj.nombre);
      if (existe) {
        favoritos = favoritos.filter(f => f.nombre !== prodObj.nombre);
      } else {
        favoritos.push(prodObj);
      }
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
      mostrarProductos(productos);
    });
  });
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarCarrito() {
  const lista = document.getElementById("listaCarrito");
  const total = document.getElementById("totalCarrito");
  lista.innerHTML = "";

  let totalPrecio = 0;

  carrito.forEach(prod => {
    const item = document.createElement("li");
    item.textContent = `${prod.nombre} - $${prod.precio}`;
    lista.appendChild(item);
    totalPrecio += prod.precio;
  });

  total.textContent = `Total: $${totalPrecio}`;
}

// Inicial
mostrarProductos(productos);
actualizarCarrito();

// Mostrar / ocultar carrito
document.getElementById("botonCarrito").addEventListener("click", () => {
  document.getElementById("carrito").classList.toggle("oculto");
});

// Vaciar carrito
document.getElementById("vaciarCarrito").addEventListener("click", () => {
  carrito = [];
  guardarCarrito();
  actualizarCarrito();
});

// Filtro de precio
document.getElementById("filtroPrecio").addEventListener("change", e => {
  const valor = parseInt(e.target.value);
  const filtrados = productos.filter(p => p.precio <= valor);
  mostrarProductos(filtrados);
});

// Ver favoritos
document.getElementById("verFavoritos").addEventListener("click", () => {
  if (favoritos.length === 0) {
    alert("No tenés favoritos todavía 😢");
  } else {
    mostrarProductos(favoritos);
  }
});

// Ver todos
document.getElementById("verTodos").addEventListener("click", () => {
  mostrarProductos(productos);
});

// Finalizar compra
const btnFinalizar = document.getElementById("finalizarCompra");
const formEntrega = document.getElementById("formEntrega");

btnFinalizar.addEventListener("click", () => {
  formEntrega.classList.toggle("oculto");
  if (!window.mapaInicializado) {
    initMap();
    window.mapaInicializado = true;
  }
});

document.getElementById("confirmarCompra").addEventListener("click", () => {
  const nombre = document.getElementById("nombreCliente").value.trim();
  const direccion = document.getElementById("direccion").value.trim();

  if (!nombre || !direccion) {
    alert("Por favor completá nombre y dirección.");
    return;
  }

  const resumen = `
✅ ¡Gracias ${nombre} por tu compra!
🧉 Productos:
${carrito.map(p => `- ${p.nombre} ($${p.precio})`).join('\n')}
📦 Envío a: ${direccion}
💰 Total: $${carrito.reduce((acc, p) => acc + p.precio, 0)}
`;

  alert(resumen);
  carrito = [];
  guardarCarrito();
  actualizarCarrito();
  formEntrega.classList.add("oculto");
});

// Google Maps
let map, autocomplete;

function initMap() {
  const input = document.getElementById("direccion");

  autocomplete = new google.maps.places.Autocomplete(input, {
    types: ['geocode'],
    componentRestrictions: { country: 'ar' }
  });

  map = new google.maps.Map(document.getElementById("mapa"), {
    center: { lat: -34.6037, lng: -58.3816 },
    zoom: 13
  });

  const marker = new google.maps.Marker({
    map,
    draggable: true,
    position: { lat: -34.6037, lng: -58.3816 }
  });

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) return;

    map.setCenter(place.geometry.location);
    map.setZoom(15);
    marker.setPosition(place.geometry.location);
  });

  map.addListener("click", e => {
    marker.setPosition(e.latLng);
    document.getElementById("direccion").value =
      `Lat: ${e.latLng.lat().toFixed(5)}, Lng: ${e.latLng.lng().toFixed(5)}`;
  });
}
