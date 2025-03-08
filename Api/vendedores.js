document.getElementById("registroForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita la recarga de la página

    // Obtener el ID del usuario desde localStorage
    let idUsuario = localStorage.getItem("user_id");

    if (!idUsuario) {
        alert("⚠️ Error: No se encontró el ID de usuario. Inicia sesión nuevamente.");
        return;
    }

    // Obtener valores del formulario
    let nombre = document.getElementById("nombre").value.trim();
    let descripcion = document.getElementById("descripcion").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let ubicacion = document.getElementById("ubicacion").value.trim();
    let imagenInput = document.getElementById("imageInput").files[0];

    // Validación básica
    if (!nombre || !descripcion || !telefono || !ubicacion) {
        alert("⚠️ Todos los campos son obligatorios.");
        return;
    }

    let imagenRuta = ""; // Solo el nombre de la imagen

    // Si hay una imagen, la subimos primero
    if (imagenInput) {
        let formData = new FormData();
        formData.append("imagen", imagenInput);

        try {
            let imagenResponse = await fetch("http://localhost/microservicio_autenticacion/upload", {
                method: "POST",
                body: formData
            });

            if (!imagenResponse.ok) {
                throw new Error("Error al subir la imagen.");
            }

            let imagenData = await imagenResponse.json();
            if (imagenData.success && imagenData.nombre_imagen) {
                imagenRuta = imagenData.nombre_imagen; // Guardar solo el nombre del archivo con extensión
            } else {
                alert("⚠️ Error al subir la imagen: " + imagenData.message);
                return;
            }
        } catch (error) {
            console.error("❌ Error al subir la imagen:", error);
            alert("⚠️ No se pudo subir la imagen.");
            return;
        }
    }

    // Crear el JSON con los datos a enviar
    let data = {
        action: "crear_vendedor",
        nombre: nombre,
        descripcion: descripcion,
        id_ubicacion: parseInt(ubicacion),  
        telefono: telefono,
        id_usu: parseInt(idUsuario), // Se usa el ID obtenido del localStorage
        id_tipotienda: 1,  
        imagen: imagenRuta // Solo el nombre de la imagen
    };

    try {
        let response = await fetch("http://localhost/microservicio_autenticacion/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor.");
        }

        let result = await response.json();
        alert(result.message);
        console.log("Registro exitoso:", result);

        // Redirigir si el registro es exitoso
        if (result.success) {
            window.location.href = "gestiondeproductos.html";
        }
    } catch (error) {
        console.error("❌ Error al registrar:", error);
        alert("⚠️ No se pudo registrar el vendedor.");
    }
});

// Función para previsualizar la imagen
document.getElementById("imageInput").addEventListener("change", function (event) {
    let file = event.target.files[0];
    let preview = document.getElementById("imagePreview");

    if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
            preview.innerHTML = `<img src="${e.target.result}" class="img-fluid" alt="Previsualización">`;
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = "<span>Previsualización de imagen</span>";
    }
});
