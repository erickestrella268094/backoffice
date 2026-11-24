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
let tarjetaEnEdicion = null;

panelMercancia.addEventListener("click", (e) => {
    const tarjeta = e.target.closest(".tarjetaProducto");
    if (!tarjeta) return;

    if (e.target.classList.contains("btnActualizar")) {
        tarjetaEnEdicion = tarjeta;

        const imgActual = tarjeta.querySelector(".imgProducto").src;
        inputNombre.value = tarjeta.querySelector("h3").textContent;
        inputDepartamento.value = tarjeta.querySelector(".etiquetaDepartamento").textContent;
        inputPrecio.value = tarjeta.dataset.precio || "";
        inputImagen.value = imgActual === IMAGEN_DEFECTO ? "" : imgActual;

        tituloFormulario.textContent = "Editar Mercancía";
        btnSubmitForm.textContent = "Guardar cambios";
        btnCancelarEdicion.style.display = "inline-block";
        inputNombre.focus();
    }

    if (e.target.classList.contains("btnEliminar")) {
        if (tarjetaEnEdicion === tarjeta) resetearFormulario();
        tarjeta.remove();
    }
});

formMercancia.addEventListener("submit", (e) => {
    e.preventDefault();
    const urlImagen = inputImagen.value.trim() || IMAGEN_DEFECTO;
    const precioFormateado = parseFloat(inputPrecio.value).toFixed(2);

    if (tarjetaEnEdicion) {
        const img = tarjetaEnEdicion.querySelector(".imgProducto");
        img.src = urlImagen;
        img.alt = inputNombre.value;
        tarjetaEnEdicion.dataset.precio = precioFormateado;
        tarjetaEnEdicion.querySelector(".etiquetaDepartamento").textContent = inputDepartamento.value;
        tarjetaEnEdicion.querySelector("h3").textContent = inputNombre.value;
        tarjetaEnEdicion.querySelector(".precioProducto").textContent = `$${precioFormateado}`;
        resetearFormulario();
    } else {
        const nuevaTarjeta = document.createElement("article");
        nuevaTarjeta.className = "tarjetaProducto";
        nuevaTarjeta.dataset.precio = precioFormateado;
        nuevaTarjeta.innerHTML = `
            <img src="${urlImagen}" alt="${inputNombre.value}" class="imgProducto" onerror="this.src='${IMAGEN_DEFECTO}'">
            <div class="infoProducto">
                <span class="etiquetaDepartamento">${inputDepartamento.value}</span>
                <h3>${inputNombre.value}</h3>
                <p class="precioProducto">$${precioFormateado}</p>
            </div>
            <div class="botonesProducto">
                <button type="button" class="btnActualizar">Actualizar</button>
                <button type="button" class="btnEliminar">Eliminar</button>
            </div>
        `;
        panelMercancia.appendChild(nuevaTarjeta);
        formMercancia.reset();
    }
});

btnCancelarEdicion.addEventListener("click", resetearFormulario);

function resetearFormulario() {
    tarjetaEnEdicion = null;
    formMercancia.reset();
    tituloFormulario.textContent = "Agregar Mercancía";
    btnSubmitForm.textContent = "+ Agregar mercancía";
    btnCancelarEdicion.style.display = "none";
}

document.getElementById("btnCerrarSesion").addEventListener("click", () => {
    localStorage.removeItem("token");
});