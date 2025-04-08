document
  .getElementById("imagenesProducto")
  .addEventListener("change", function (event) {
    const previewContainer = document.getElementById("previewContainer");
    previewContainer.innerHTML = "";

    const files = event.target.files;
    if (files.length < 3) {
      alert("Debes subir al menos 3 imágenes.");
      event.target.value = "";
      return;
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
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

document
  .getElementById("formProducto")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Usuario no autenticado.");
      return;
    }

    // 1. Obtener el ID del vendedor con el userId
    const vendedorRes = await fetch(
      `http://localhost/microservicio_producto/routes/api.php?action=obtenerIdVendedor&id_usu=${userId}`
    );
    const vendedorData = await vendedorRes.json();

    if (!vendedorData.id_vendedor) {
      alert("No se pudo obtener el ID del vendedor.");
      return;
    }

    // 2. Armar los datos del formulario para enviarlos a crear
    const formData = new FormData(this);
    formData.append("id_vendedor", vendedorData.id_vendedor);

    // 3. Enviar al microservicio de productos
    fetch(
      "http://localhost/microservicio_producto/routes/api.php?action=crear",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert(data.mensaje || data.error || "Producto creado");
        document.getElementById("formProducto").reset();
        document.getElementById("previewContainer").innerHTML = "";
      })
      .catch((err) => {
        console.error("Error al guardar producto:", err);
        alert("Error al guardar el producto.");
      });
  });

document
  .getElementById("formProducto")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Usuario no autenticado.");
      return;
    }

    try {
      // 1. Obtener el ID del vendedor a partir del ID del usuario
      const vendedorRes = await fetch(
        `http://localhost/microservicio_producto/routes/api.php?action=obtenerIdVendedor&id_usu=${userId}`
      );
      const vendedorData = await vendedorRes.json();

      if (!vendedorData.id_vendedor) {
        alert("No se pudo obtener el ID del vendedor.");
        return;
      }

      // 2. Armar el FormData con los datos del formulario
      const formData = new FormData(this);
      formData.append("id_vendedor", vendedorData.id_vendedor);

      // 3. Enviar los datos al microservicio de productos
      const response = await fetch(
        "http://localhost/microservicio_producto/routes/api.php?action=crear",
        {
          method: "POST",
          body: formData,
        }
      );

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
  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.error("No se encontró el ID de usuario en localStorage");
    contenedor.innerHTML = `<p class="text-danger">Error: No se encontró el ID de usuario.</p>`;
    return;
  }

  fetch(
    `http://localhost/microservicio_producto/routes/api.php?action=obtenerIdVendedor&id_usu=${encodeURIComponent(
      userId
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (!data.id_vendedor) {
        throw new Error("No se encontró un vendedor asociado a este usuario.");
      }

      const id_vendedor = data.id_vendedor;
      return fetch(
        `http://localhost/microservicio_producto/routes/api.php?action=listarPorVendedor&id_vendedor=${id_vendedor}`
      );
    })
    .then((response) => response.json())
    .then((productos) => {
      contenedor.innerHTML = "";

      productos.forEach((producto, index) => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";

        const imagenes = producto.imagenes || ["default.jpg"]; // Array de imágenes

        // Generar HTML del carrusel
        const carouselId = `carousel${index}`;
        const carouselIndicators = imagenes
          .map(
            (img, i) => `
                  <button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${i}" class="${
              i === 0 ? "active" : ""
            }" aria-current="${i === 0 ? "true" : "false"}" aria-label="Slide ${
              i + 1
            }"></button>
                `
          )
          .join("");

        const carouselItems = imagenes
          .map(
            (img, i) => `
  <div class="carousel-item ${i === 0 ? "active" : ""}">
  <img src="img_productos/${img}" class="d-block w-100 img-fluid" style="max-height: 180px; object-fit: contain;" alt="...">


  </div>
`
          )
          .join("");

          card.innerHTML = `
          <div class="card h-100 shadow-sm text-center p-2">
            <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel" data-bs-interval="2500" style="height: 250px;">
              <div class="carousel-indicators">
                ${carouselIndicators}
              </div>
              <div class="carousel-inner h-100">
                ${carouselItems}
              </div>
        
              <!-- Botón anterior -->
              <button class="carousel-control-prev position-absolute top-50 start-0 translate-middle-y p-1 border-0 bg-transparent shadow-none" 
                      type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              </button>
        
              <!-- Botón siguiente -->
              <button class="carousel-control-next position-absolute top-50 end-0 translate-middle-y p-1 border-0 bg-transparent shadow-none" 
                      type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
              </button>
            </div>
        
            <div class="card-body d-flex flex-column justify-content-between">
              <h5 class="card-title">${producto.nombre}</h5>
              <p class="card-text">${producto.descripcion}</p>
              <p class="card-text"><strong>Precio:</strong> $${producto.precio.toLocaleString()}</p>
              <div class="d-flex justify-content-center gap-2 mt-auto">
                <button type="button" class="btn btn-sm btn-outline-secondary">Editar</button>
                <button type="button" class="btn btn-sm btn-outline-danger">Eliminar</button>
                <button type="button" class="btn btn-sm btn-outline-warning" style="width: 100px;">Agotado</button>
              </div>
            </div>
          </div>
        `;
        
        contenedor.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error al cargar productos:", error);
      contenedor.innerHTML = `<p class="text-danger">Error al cargar productos.</p>`;
    });
});



// Supongamos que el ID del vendedor ya lo tienes definido en tu código
document.getElementById("formProducto").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;

  const nombre = document.getElementById("nombreProducto").value.trim();
  const descripcion = document.getElementById("descripcionProducto").value.trim();
  const precio = parseFloat(document.getElementById("precioProducto").value);
  const id_estado = 1; // puede ser dinámico si lo tienes

  const categoriasInputs = document.querySelectorAll(".categoria-input");
  const categoria = {};
  categoriasInputs.forEach((input, index) => {
    if (input.value.trim() !== "") {
      categoria[`categoria${index + 1}`] = input.value.trim();
    }
  });

  const imagenesInput = document.getElementById("imagenesProducto").files;
  const imagenes = {};
  for (let i = 0; i < imagenesInput.length && i < 3; i++) {
    const fileName = imagenesInput[i].name;
    imagenes[`imagen${i + 1}`] = fileName;
  }

  const payload = {
    imagenes,
    categoria,
    producto: {
      nombre,
      descripcion,
      precio,
      id_estado,
      id_vendedor // asegúrate de que esta variable esté definida y no sea undefined
    }
  };

  // ✅ Mostrar en consola antes de enviar
  console.log("Payload a enviar:", JSON.stringify(payload, null, 2));

  try {
    const response = await fetch("http://localhost/microservicio_producto/routes/api.php?action=crearTodo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Producto creado correctamente");
      form.reset();
      document.getElementById("previewContainer").innerHTML = "";
    } else {
      console.error("❌ Error del servidor:", data);
      alert("❌ Error al crear el producto: " + (data.error || "Error desconocido"));
    }

  } catch (error) {
    console.error("⚠️ Error en la conexión:", error);
    alert("⚠️ No se pudo conectar al servidor.");
  }
});