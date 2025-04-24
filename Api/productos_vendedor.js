document.addEventListener("DOMContentLoaded", () => {
    // Obtener el parámetro `vendedor` desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idVendedor = urlParams.get("vendedor");
  
    if (!idVendedor) {
      alert("No se encontró el ID del vendedor en la URL");
      return;
    }
  
    // Función para renderizar un producto en el contenedor
    function renderProducto(producto) {
      const productoDiv = document.createElement("div");
      productoDiv.classList.add("col-md-4");
  
      productoDiv.innerHTML = `
        <div class="card mb-4 product-wap rounded-0">
          <div class="card rounded-0">
            <img class="card-img rounded-0 img-fluid" src="ruta/a/imagenes/${producto.imagenes[0]}" alt="${producto.nombre}">
            <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
              <ul class="list-unstyled">
                <li><a class="btn btn-success text-white" href="../../views/producto.html?id=${producto.id}"><i class="far fa-heart"></i></a></li>
                <li><a class="btn btn-success text-white mt-2" href="../../views/producto.html?id=${producto.id}"><i class="far fa-eye"></i></a></li>
              </ul>
            </div>
          </div>
          <div class="card-body">
            <a href="../../views/producto.html?id=${producto.id}" class="h3 text-decoration-none">${producto.nombre}</a>
            <ul class="list-unstyled d-flex justify-content-between mb-0">
              <li>${producto.tallas?.join(" / ") || "Tallas no disponibles"}</li>
            </ul>
            <p class="text-center mb-0">$${producto.precio.toLocaleString()}</p>
          </div>
        </div>
      `;
  
      return productoDiv;
    }
  
    // Obtener los productos del vendedor desde la API
    fetch(`http://localhost/microservicio_producto/routes/api.php?action=listarPorVendedor&id_vendedor=${idVendedor}`)
      .then(response => {
        if (!response.ok) throw new Error("Error al obtener productos");
        return response.json();
      })
      .then(productos => {
        const container = document.getElementById("productos-container");
        container.innerHTML = ""; // Limpiar contenedor antes de renderizar
  
        if (productos.length === 0) {
          container.innerHTML = "<p>No se encontraron productos para este vendedor.</p>";
          return;
        }
  
        productos.forEach(producto => {
          const card = renderProducto(producto);
          container.appendChild(card);
        });
      })
      .catch(error => {
        console.error("Error al cargar productos:", error);
        const container = document.getElementById("productos-container");
        container.innerHTML = "<p>Error al cargar los productos. Intenta más tarde.</p>";
      });
  });
  