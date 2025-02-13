document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    let userId = null;

    if (!loginForm) {
        console.error("No se encontró el formulario de inicio de sesión.");
        return;
    }

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
    
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
    
        try {
            const response = await fetch("http://localhost/microservicio_autenticacion/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "login",
                    email: email,
                    password: password
                })
            });
    
            const result = await response.json();
            console.log("Respuesta del servidor:", result);
    
            if (result.estado === "correcto" && result.usuario?.id_usuario) {
                const userId = result.usuario.id_usuario;
                console.log("✅ ID usuario recibido:", userId);
    
                // 🔹 Guardar ID en localStorage para usarlo después en la validación
                localStorage.setItem("userId", userId);
    
                // 🔹 Mostrar el modal para ingresar el código 2FA
                $("#authModal").modal("show");
            } else {
                alert("❌ Error en el inicio de sesión: " + (result.msg || "Credenciales incorrectas"));
            }
        } catch (error) {
            console.error("❌ Error al conectar con la API:", error);
            alert("❌ Error al conectar con el servidor.");
        }
    });
    
    
    // 📌 Validar token 2FA
    document.addEventListener("click", async function (event) {
        if (event.target && event.target.id === "verifyToken") {
            console.log("✅ Botón de validación presionado.");
    
            const authCode = document.getElementById("authCode").value;
            if (!authCode) {
                alert("❌ Por favor, ingresa el código de verificación.");
                return;
            }
    
            // 🔹 Recuperar userId desde localStorage
            const userId = localStorage.getItem("userId");
    
            if (!userId) {
                alert("❌ Error: No se encontró el ID del usuario. Inicia sesión nuevamente.");
                return;
            }
    
            console.log(`Validando código: ${authCode} para usuario: ${userId}`);
    
            try {
                const response = await fetch("http://localhost/microservicio_autenticacion/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "validar_token_2fa",
                        id_usuario: userId,
                        token_2fa: authCode
                    })
                });
    
                // 🔍 Ver la respuesta como texto antes de convertir a JSON
                const responseText = await response.text();
                console.log("🔹 Respuesta de validación (texto):", responseText);
    
                const result = JSON.parse(responseText);
                console.log("🔹 Respuesta de validación (JSON):", result);
    
                if (result.message && result.message.includes("exitosa")) {
                    alert("✅ Autenticación exitosa.");
                    window.location.href = "gestion_productos.html"; // Redirigir a la página deseada
                } else {
                    alert("❌ Código incorrecto. Intenta de nuevo.");
                }
            } catch (error) {
                console.error("❌ Error al validar el token:", error);
                alert("❌ Error al conectar con el servidor.");
            }
        }
    });
    
});


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("registerButton").addEventListener("click", async function () {
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value.trim();

        if (!email || !password) {
            alert("⚠️ Por favor, completa todos los campos.");
            return;
        }

        console.log(`🔹 Enviando registro para: ${email}`);

        try {
            const response = await fetch("http://localhost/microservicio_autenticacion/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "registrar",
                    email: email,
                    password: password
                })
            });

            const result = await response.json();
            console.log("🔹 Respuesta del servidor:", result);

            if (result.message && result.message.includes("Usuario registrado correctamente")) {
                alert(`✅ Registro exitoso. Ahora puedes continuar con el registro de tu tienda.`);
                $("#registerModal").modal("hide"); // Cierra el modal
                window.location.href = "signup.html"; // Redirige a signup.html
            } else {
                alert("⚠️ Error: " + result.message);
            }
        } catch (error) {
            console.error("❌ Error al conectar con la API:", error);
            alert("❌ Error al conectar con el servidor.");
        }
    });
});




