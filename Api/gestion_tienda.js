document.addEventListener("DOMContentLoaded", function () {
  // Obtener el user_id o userId de localStorage
  const idUsuario = localStorage.getItem("user_id") || localStorage.getItem("userId");

  if (!idUsuario) {
      console.error("No se encontró user_id ni userId en localStorage.");
      return;
  }

  // Petición al servidor para obtener la lista de vendedores
  fetch("http://localhost/microservicio_autenticacion/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "listar_vendedores" }),
  })
  .then((response) => response.json())
  .then((data) => {
      if (!data || !Array.isArray(data)) {
          console.error("Respuesta inválida del servidor.");
          return;
      }

      // Buscar el vendedor con el id_usu guardado en localStorage
      const vendedor = data.find((v) => v.id_usu === parseInt(idUsuario, 10));

      if (!vendedor) {
          console.error("No se encontró un vendedor con este id_usu.");
          return;
      }

      // **Usar los IDs correctos del HTML**
      document.getElementById("nombreTiendaTexto").textContent = vendedor.nombre;
      document.getElementById("direccionTexto").textContent = vendedor.ubicacion;
      document.getElementById("telefonoTexto").textContent = vendedor.telefono;
      document.getElementById("correoTexto").textContent = vendedor.correo || "No disponible";
      document.getElementById("descripcionTexto").textContent = vendedor.descripcion;

      // **Actualizar la imagen de perfil**
      const imagenPerfil = document.getElementById("imagenTienda");
      if (imagenPerfil && vendedor.imagen) {
          imagenPerfil.setAttribute("src", `../../profiles/${vendedor.imagen}`);
      } else {
          console.warn("No se encontró imagen o elemento de imagen.");
      }
  })
  .catch((error) => console.error("Error al obtener datos:", error));
});

