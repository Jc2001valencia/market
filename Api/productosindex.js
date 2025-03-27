document.addEventListener("DOMContentLoaded", function () {
    // Obtener el ID del producto desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idProducto = urlParams.get("id");

    if (idProducto) {
        obtenerProducto(idProducto);
    }
});

function obtenerProducto(id) {
    const apiUrl = `http://localhost/microservicio_producto/routes/api.php?action=obtener&id_producto=${id}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Datos obtenidos desde API:", data); // 📌 Mostrar en consola

            if (data.id_producto) {
                actualizarDOMConDatos(data);
            } else {
                console.error("Producto no encontrado");
            }
        })
        .catch(error => console.error("Error al obtener el producto:", error));
}

function actualizarDOMConDatos(data) {
    // Actualizar elementos del contenedor con la información del producto
    document.querySelector("h1.h2").textContent = data.nombre;
    document.querySelector("p.h3.py-2").textContent = `$${data.precio.toLocaleString()}`;
    document.querySelector("p.py-2").innerHTML = `
        <i class="fa fa-star text-warning"></i>
        <i class="fa fa-star text-warning"></i>
        <i class="fa fa-star text-warning"></i>
        <i class="fa fa-star text-warning"></i>
        <i class="fa fa-star text-secondary"></i>
        <span class="list-inline-item text-dark">Valoración 4.8 | 36 Comentarios</span>`;
    
    document.querySelector(".text-muted strong").textContent = "Marca Desconocida"; 
    document.querySelector("h6 + p").textContent = data.descripcion;
    document.querySelector("#product-detail").src = `../assets/img/${data.imagen}`;
    document.querySelector("#product-detail").alt = data.nombre;

    // Actualizar el enlace de WhatsApp
    actualizarEnlaceWhatsApp(data);
}

// Función para actualizar el enlace de WhatsApp
function actualizarEnlaceWhatsApp(producto) {
    const enlaceWhatsApp = document.querySelector(".btn-lg");
    const numeroWhatsApp = "+tu-número-de-WhatsApp"; // Cambia esto por tu número

    const mensaje = `¡Hola! Estoy interesado en comprar un producto. Aquí está la información:
    
    - Producto: ${producto.nombre}
    - Precio: $${producto.precio.toLocaleString()}
    
    Por favor, respóndeme con los detalles para proceder con la compra.`;

    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensaje)}`;
    enlaceWhatsApp.parentElement.href = urlWhatsApp;
}
