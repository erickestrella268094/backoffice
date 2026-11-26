const API_URL = "https://portfolio-api-three-black.vercel.app/api/v1";
const token = localStorage.getItem("token");

const formMercancia = document.getElementById("formMercancia");
const tituloFormulario = document.getElementById("tituloFormulario");
const btnSubmitForm = document.getElementById("btnSubmitForm");
const btnCancelarEdicion = document.getElementById("btnCancelarEdicion");
const panelMercancia = document.getElementById("panelMercancia");

const inputNombre = document.getElementById("inputNombre");
const inputDepartamento = document.getElementById("inputDepartamento");
const inputPrecio = document.getElementById("inputPrecio");
const inputImagen = document.getElementById("inputImagen");

const IMAGEN_DEFECTO = "https://placehold.co/300x160/E0F2FE/0284C7?text=Producto";
let idEnEdicion = null;

function obtenerHeaders() {
    return {
        "Content-Type": "application/json",
        "auth-token": token
    };
}

function verificarSesion(status) {
    if (status === 401 || status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.replace("login.html");
        return true;
    }
    return false;
}

async function cargarMercancia() {
    try {
        const respuesta = await fetch(`${API_URL}/projects`, {
            method: "GET",
            headers: obtenerHeaders()
        });

        if (verificarSesion(respuesta.status)) return;

        const data = await respuesta.json();
        const productos = Array.isArray(data) ? data : (data.projects || data.data || []);

        panelMercancia.innerHTML = "";
        productos.forEach((producto) => {
            renderizarTarjeta(producto);
        });
    } catch (error) {
        console.error("Error al obtener mercancía:", error);
    }
}

function renderizarTarjeta(producto) {
    const id = producto._id || producto.id;
    const departamento = Array.isArray(producto.technologies) && producto.technologies.length > 0
        ? producto.technologies[0]
        : "General";
    const precioNumerico = parseFloat(producto.description);
    const precioFormateado = isNaN(precioNumerico) ? "0.00" : precioNumerico.toFixed(2);
    const urlImagen = Array.isArray(producto.images) && producto.images.length > 0 && producto.images[0]
        ? producto.images[0]
        : IMAGEN_DEFECTO;

    const nuevaTarjeta = document.createElement("article");
    nuevaTarjeta.className = "tarjetaProducto";
    nuevaTarjeta.dataset.id = id;
    nuevaTarjeta.innerHTML = `
        <img src="${urlImagen}" alt="${producto.title}" class="imgProducto" onerror="this.src='${IMAGEN_DEFECTO}'">
        <div class="infoProducto">
            <span class="etiquetaDepartamento">${departamento}</span>
            <h3>${producto.title}</h3>
            <p class="precioProducto">$${precioFormateado}</p>
        </div>
        <div class="botonesProducto">
            <button type="button" class="btnActualizar">Actualizar</button>
            <button type="button" class="btnEliminar">Eliminar</button>
        </div>
    `;
    panelMercancia.appendChild(nuevaTarjeta);
}

panelMercancia.addEventListener("click", async (e) => {
    const tarjeta = e.target.closest(".tarjetaProducto");
    if (!tarjeta) return;

    const projectId = tarjeta.dataset.id;

    if (e.target.classList.contains("btnActualizar")) {
        try {
            const respuesta = await fetch(`${API_URL}/projects/${projectId}`, {
                method: "GET",
                headers: obtenerHeaders()
            });

            if (verificarSesion(respuesta.status)) return;
            if (!respuesta.ok) {
                alert("No se pudo obtener la información del producto.");
                return;
            }

            const data = await respuesta.json();
            const producto = data.project || data.data || data;

            idEnEdicion = producto._id || producto.id;
            inputNombre.value = producto.title || "";
            inputDepartamento.value = Array.isArray(producto.technologies) && producto.technologies.length > 0
                ? producto.technologies[0]
                : "";
            inputPrecio.value = producto.description || "";
            const imgGuardada = Array.isArray(producto.images) && producto.images.length > 0
                ? producto.images[0]
                : "";
            inputImagen.value = imgGuardada === IMAGEN_DEFECTO ? "" : imgGuardada;

            tituloFormulario.textContent = "Editar Mercancía";
            btnSubmitForm.textContent = "Guardar cambios";
            btnCancelarEdicion.style.display = "inline-block";
            inputNombre.focus();
        } catch (error) {
            console.error("Error al consultar producto:", error);
            alert("Error de conexión al cargar el producto.");
        }
    }

    if (e.target.classList.contains("btnEliminar")) {
        try {
            const respuesta = await fetch(`${API_URL}/projects/${projectId}`, {
                method: "DELETE",
                headers: obtenerHeaders()
            });

            if (verificarSesion(respuesta.status)) return;
            if (!respuesta.ok) {
                alert("No se pudo eliminar el producto.");
                return;
            }

            if (idEnEdicion === projectId) resetearFormulario();
            tarjeta.remove();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            alert("Error de conexión al eliminar el producto.");
        }
    }
});

formMercancia.addEventListener("submit", async (e) => {
    e.preventDefault();

    const urlImagen = inputImagen.value.trim();
    const precioFormateado = parseFloat(inputPrecio.value).toFixed(2);

    const payload = {
        title: inputNombre.value.trim(),
        description: precioFormateado,
        technologies: [inputDepartamento.value.trim()],
        images: urlImagen ? [urlImagen] : []
    };

    try {
        if (idEnEdicion) {
            const respuesta = await fetch(`${API_URL}/projects/${idEnEdicion}`, {
                method: "PUT",
                headers: obtenerHeaders(),
                body: JSON.stringify(payload)
            });

            if (verificarSesion(respuesta.status)) return;
            if (!respuesta.ok) {
                const err = await respuesta.json();
                alert(err.message || "Error al actualizar el producto.");
                return;
            }

            resetearFormulario();
            await cargarMercancia();
        } else {
            const respuesta = await fetch(`${API_URL}/projects`, {
                method: "POST",
                headers: obtenerHeaders(),
                body: JSON.stringify(payload)
            });

            if (verificarSesion(respuesta.status)) return;
            if (!respuesta.ok) {
                const err = await respuesta.json();
                alert(err.message || "Error al agregar el producto.");
                return;
            }

            formMercancia.reset();
            await cargarMercancia();
        }
    } catch (error) {
        console.error("Error al guardar producto:", error);
        alert("No se pudo conectar con el servidor.");
    }
});

btnCancelarEdicion.addEventListener("click", resetearFormulario);

function resetearFormulario() {
    idEnEdicion = null;
    formMercancia.reset();
    tituloFormulario.textContent = "Agregar Mercancía";
    btnSubmitForm.textContent = "+ Agregar mercancía";
    btnCancelarEdicion.style.display = "none";
}

document.getElementById("btnCerrarSesion").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
});

cargarMercancia();


