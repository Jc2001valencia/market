document.getElementById("registroForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita el recarga de la página

    // Obtener valores del formulario
    let nombre = document.getElementById("nombre").value.trim();
    let descripcion = document.getElementById("descripcion").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let ubicacion = document.getElementById("ubicacion").value.trim();
    let imagenInput = document.getElementById("imageInput").files[0];

    // Validación básica
    if (!nombre || !descripcion || !telefono || !ubicacion) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    let imagenRuta = ""; // Ruta de la imagen que se enviará

    if (imagenInput) {
        let formData = new FormData();
        formData.append("imagen", imagenInput);

        try {
            let imagenResponse = await fetch("http://localhost/microservicio_autenticacion/", {
                method: "POST",
                body: formData
            });

            if (!imagenResponse.ok) {
                throw new Error("Error al subir la imagen.");
            }

            let imagenData = await imagenResponse.json();
            if (imagenData.success) {
                imagenRuta = imagenData.ruta;
            } else {
                alert("Error al subir la imagen: " + imagenData.message);
                return;
            }
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            alert("No se pudo subir la imagen.");
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
        id_usu: 5,  
        id_tipotienda: 1,  
        imagen: imagenRuta 
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

        // Resetear el formulario después de registrar
        document.getElementById("registroForm").reset();
    } catch (error) {
        console.error("Error al registrar:", error);
        alert("No se pudo registrar el vendedor.");
    }
});
