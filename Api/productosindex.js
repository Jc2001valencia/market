document.addEventListener("DOMContentLoaded", async () => {
    const apiUrl = "http://localhost/microservicio_producto/routes/api.php?action=listar"; // Reemplázalo con tu URL real
    const container = document.getElementById("productos-container");

    try {
        const response = await fetch(apiUrl);
        const productos = await response.json();

        productos.forEach((producto) => {
            const card = document.createElement("div");
            card.classList.add("col-12", "col-md-4", "mb-4");

            // Estructura de la tarjeta con un evento para redirigir al hacer clic
            card.innerHTML = `
                <div class="card h-100 product-card" data-id="${producto.id_producto}">
                    <img src="http://localhost/microservicio_producto/images/${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                    <div class="card-body">
                        <ul class="list-unstyled d-flex justify-content-between">
                            <li>
                                <i class="text-warning fa fa-star"></i>
                                <i class="text-warning fa fa-star"></i>
                                <i class="text-warning fa fa-star"></i>
                                <i class="text-muted fa fa-star"></i>
                                <i class="text-muted fa fa-star"></i>
                            </li>
                            <li class="text-muted text-right">$${producto.precio}</li>
                        </ul>
                        <h2 class="text-decoration-none text-dark">${producto.nombre}</h2>
                        <p class="card-text">${producto.descripcion}</p>
                        <p class="text-muted">Reviews (${producto.reviews ?? 0})</p>
                    </div>
                </div>
            `;

            // Agregar evento para redirigir al hacer clic en la tarjeta completa
            card.querySelector(".product-card").addEventListener("click", function () {
                window.location.href = `../views/Products/producto.html?id=${producto.id_producto}`;
            });

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
});

