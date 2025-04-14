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
            console.log("Datos obtenidos desde API:", data);

            if (data.id_producto) {
                actualizarDOMConDatos(data);
            } else {
                console.error("Producto no encontrado");
            }
        })
        .catch(error => console.error("Error al obtener el producto:", error));
}

function actualizarDOMConDatos(producto) {
    document.querySelector("h1.h2").textContent = producto.nombre;
    document.querySelector("p.h3.py-2").textContent = `$${producto.precio.toLocaleString()}`;
    document.querySelector("p.py-2").innerHTML = `
        <i class="fa fa-star text-warning"></i>
        <i class="fa fa-star text-warning"></i>
        <i class="fa fa-star text-warning"></i>
        <i class="fa fa-star text-warning"></i>
        <i class="fa fa-star text-secondary"></i>
        <span class="list-inline-item text-dark">Valoración 4.8 | 36 Comentarios</span>`;
    
    document.querySelector(".text-muted strong").textContent = "Marca Desconocida"; 
    document.querySelector("h6 + p").textContent = producto.descripcion;
    document.querySelector("#product-detail").src = `../../assets/img/${producto.imagen}`;
    document.querySelector("#product-detail").alt = producto.nombre;

    actualizarEnlaceWhatsApp(producto);
    actualizarCategorias(producto);
    actualizarVendedor(producto);
}

function actualizarEnlaceWhatsApp(producto) {
    const enlaceWhatsApp = document.querySelector(".btn-lg");
    const numeroWhatsApp = "tu-número-de-WhatsApp";

    const mensaje = `¡Hola! Estoy interesado en comprar un producto.%0A%0A- Producto: ${producto.nombre}%0A- Precio: $${producto.precio.toLocaleString()}%0A%0APor favor, respóndeme con los detalles para proceder con la compra.`;
    
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensaje}`;
    enlaceWhatsApp.parentElement.href = urlWhatsApp;
}

function actualizarCategorias(producto) {
    const categoriasContainer = document.getElementById("etiquetas");
    if (categoriasContainer) {
        categoriasContainer.innerHTML = `
            <div id="categ"><a href="">/ ${producto.categoria1 || ''}</a></div>
            <div id="categ"><a href="">/ ${producto.categoria2 || ''}</a></div>
            <div id="categ"><a href="">/ ${producto.categoria3 || ''}</a></div>
        `;
    } else {
        console.error("No se encontró el contenedor de etiquetas");
    }
}

function actualizarVendedor(producto) {
    const vendedorContainer = document.getElementById("vendedor");
    if (vendedorContainer) {
        vendedorContainer.innerHTML = `
            <div class="seller-info">
                <h2 class="h2">Información del Vendedor</h2>
                <div class="vendedordiv">
                    <div class="datos">
                        <div class="card_d">
                            <p><strong>Nombre:</strong> ${producto.vendedor_nombre || 'No disponible'}</p>
                            <p>
                                <strong>WhatsApp:</strong>
                                <a href="https://wa.me/${(producto.vendedor_telefono || '').replace(/\s+/g, '')}" target="_blank" style="color: #25D366;">
                                    ${producto.vendedor_telefono || 'No disponible'} <i class="fa fa-whatsapp"></i>
                                </a>
                            </p>
                            <img src="http://localhost/microservicio_producto/images/${producto.vendedor_imagen || 'default.jpg'}" alt="Imagen del vendedor" style="width: 150px; height: auto;">
                            
                            <div class="seller-rating">
                                <h3>Calificación:</h3>
                                <span class="fa fa-star checked"></span>
                                <span class="fa fa-star checked"></span>
                                <span class="fa fa-star checked"></span>
                                <span class="fa fa-star"></span>
                                <span class="fa fa-star"></span>
                                <p>
                                    <a href="./productos_tienda.html" style="color: #ff3366;">Ver todos los productos</a>
                                </p>
                            </div>

                            <a id="whatsapp-link" target="_blank">
                                <button type="button" class="btn btn-success btn-lg">Comprar por WhatsApp</button>
                            </a>
                        </div>
                    </div>
                    <div class="map">
                        <h3><p><strong>Dirección:</strong> ${producto.vendedor_ubicacion || 'No disponible'}</p></h3>
                        <iframe 
                            src="https://www.google.com/maps?q=${encodeURIComponent(producto.vendedor_ubicacion || '')}&output=embed"
                            width="600" height="350" style="border:0;" allowfullscreen loading="lazy">
                        </iframe>
                    </div>
                </div>
            </div>
        `;
        
        const mensaje = `¡Hola! Estoy interesado en comprar un producto.%0A%0A- Producto: ${producto.nombre}%0A- Precio: $${producto.precio.toLocaleString()}%0A%0APor favor, respóndeme con los detalles para proceder con la compra.`;
        
        document.getElementById("whatsapp-link").href = `https://api.whatsapp.com/send?phone=${(producto.vendedor_telefono || '').replace(/\s+/g, '')}&text=${mensaje}`;
    } else {
        console.error("No se encontró el contenedor del vendedor");
    }
}
