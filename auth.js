const API_URL = "https://portfolio-api-three-black.vercel.app/api/v1";


const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const datosUsuario = {
            name: registerForm.name.value.trim(),
            email: registerForm.email.value.trim(),
            itsonId: registerForm.itsonId.value.trim(),
            password: registerForm.password.value
        };

        try {
            const respuesta = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosUsuario)
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                alert(data.message || "Error al registrar usuario. Verifica tus datos.");
                return;
            }

            alert("Usuario registrado con éxito. Ahora inicia sesión.");
            window.location.href = "login.html";
        } catch (error) {
            alert("No se pudo conectar con el servidor. Intenta de nuevo.");
            console.error(error);
        }
    });
}


const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const credenciales = {
            email: loginForm.email.value.trim(),
            password: loginForm.password.value
        };

        try {
            const respuesta = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credenciales)
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                alert(data.message || "Correo o contraseña incorrectos.");
                return;
            }


            localStorage.setItem("token", data.token);
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            window.location.href = "home.html";
        } catch (error) {
            alert("No se pudo conectar con el servidor. Intenta de nuevo.");
            console.error(error);
        }
    });
}