document.getElementById("imagenesProducto").addEventListener("change", function(event) {
  const previewContainer = document.getElementById("previewContainer");
  previewContainer.innerHTML = "";

  const files = event.target.files;
  if (files.length < 3) {
    alert("Debes subir al menos 3 imágenes.");
    event.target.value = "";
    return;
  }

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.className = "img-thumbnail m-1";
      img.style.width = "100px";
      img.style.height = "100px";
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

document.getElementById("formProducto").addEventListener("submit", async function(e) {
  e.preventDefault();

  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Usuario no autenticado.");
    return;
  }

  // 1. Obtener el ID del vendedor con el userId
  const vendedorRes = await fetch(`http://localhost/microservicio_vendedor/routes/api.php?action=obtenerIdVendedor&id_usu=${userId}`);
  const vendedorData = await vendedorRes.json();

  if (!vendedorData.id_vendedor) {
    alert("No se pudo obtener el ID del vendedor.");
    return;
  }

  // 2. Armar los datos del formulario para enviarlos a crear
  const formData = new FormData(this);
  formData.append("id_vendedor", vendedorData.id_vendedor);

  // 3. Enviar al microservicio de productos
  fetch("http://localhost/microservicio_producto/routes/api.php?action=crear", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    alert(data.mensaje || data.error || "Producto creado");
    document.getElementById("formProducto").reset();
    document.getElementById("previewContainer").innerHTML = "";
  })
  .catch(err => {
    console.error("Error al guardar producto:", err);
    alert("Error al guardar el producto.");
  });
});

document.getElementById("formProducto").addEventListener("submit", async function(e) {
    e.preventDefault();
  
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Usuario no autenticado.");
      return;
    }
  
    try {
      // 1. Obtener el ID del vendedor a partir del ID del usuario
      const vendedorRes = await fetch(`http://localhost/microservicio_vendedor/routes/api.php?action=obtenerIdVendedor&id_usu=${userId}`);
      const vendedorData = await vendedorRes.json();
  
      if (!vendedorData.id_vendedor) {
        alert("No se pudo obtener el ID del vendedor.");
        return;
      }
  
      // 2. Armar el FormData con los datos del formulario
      const formData = new FormData(this);
      formData.append("id_vendedor", vendedorData.id_vendedor);
  
      // 3. Enviar los datos al microservicio de productos
      const response = await fetch("http://localhost/microservicio_producto/routes/api.php?action=crear", {
        method: "POST",
        body: formData
      });
  
      const data = await response.json();
      console.log(data);
  
      alert(data.mensaje || data.error || "Producto creado exitosamente");
  
      // 4. Limpiar el formulario
      document.getElementById("formProducto").reset();
      document.getElementById("previewContainer").innerHTML = "";
  
    } catch (err) {
      console.error("Error al guardar producto:", err);
      alert("Ocurrió un error al guardar el producto.");
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    const contenedor = document.getElementById("contenedor-productos");
    const userId = localStorage.getItem("userId"); // Obtener el ID del usuario desde localStorage

    if (!userId) {
        console.error("No se encontró el ID de usuario en localStorage");
        contenedor.innerHTML = `<p class="text-danger">Error: No se encontró el ID de usuario.</p>`;
        return;
    }

    // Obtener el id_vendedor a partir del id_usu
    fetch(`http://localhost/microservicio_producto/routes/api.php?action=obtenerIdVendedor&id_usu=${encodeURIComponent(userId)}`)
        .then(response => response.json())
        .then(data => {
            if (!data.id_vendedor) {
                throw new Error("No se encontró un vendedor asociado a este usuario.");
            }

            const id_vendedor = data.id_vendedor;
            
            // Ahora obtener los productos del vendedor
            return fetch(`http://localhost/microservicio_producto/routes/api.php?action=listarPorVendedor&id_vendedor=${id_vendedor}`);
        })
        .then(response => response.json())
        .then(productos => {
            contenedor.innerHTML = ""; // Limpiar contenido antes de agregar productos
            
            productos.forEach(producto => {
                const card = document.createElement("div");
                card.className = "col-md-3";

                card.innerHTML = `
                  <div class="card mb-3 shadow-sm">
                    <img src="../../profiles/${producto.id_img || 'default.jpg'}" class="card-img-top" alt="Imagen del Producto">
                    <div class="card-body">
                      <h5 class="card-title">${producto.nombre}</h5>
                      <p class="card-text">${producto.descripcion}</p>
                      <p class="card-text">Precio: $${producto.precio.toLocaleString()}</p>
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group">
                          <button type="button" class="btn btn-sm btn-outline-secondary">Editar</button>
                          <button type="button" class="btn btn-sm btn-outline-danger">Eliminar</button>
                          <button style="width: 100px;" type="button" class="btn btn-sm btn-outline-warning">Agotado</button>
                        </div>
                      </div>
                    </div>
                  </div>
                `;

                contenedor.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error al cargar productos:", error);
            contenedor.innerHTML = `<p class="text-danger">Error al cargar productos.</p>`;
        });
});