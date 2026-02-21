const BACKEND_URL = '';

const input = document.getElementById("itemInput");
const button = document.getElementById("addButton");
const list = document.getElementById("itemList");
const form = document.getElementById("itemForm");
const statusOutput = document.getElementById("statusText");

let items = [];

// Cargar datos al iniciar
async function loadItems() {
  setStatus("Cargando elementos...");
  try {
    const response = await fetch(`${BACKEND_URL}/todos`);
    if (!response.ok) {
      throw new Error("Error al obtener los datos");
    }

    items = await response.json();
    renderList();
    setStatus(`${items.length} elemento(s) cargado(s).`, "success");
  } catch (error) {
    console.error(error);
    renderList();
    setStatus("No se pudo cargar la lista. Intenta de nuevo más tarde.", "error");
  }
}

function setStatus(message = "", variant = "") {
  statusOutput.textContent = message;
  statusOutput.classList.remove("success", "error");
  if (variant) {
    statusOutput.classList.add(variant);
  }
}

function renderList() {
  list.innerHTML = "";

  if (!items.length) {
    const placeholder = document.createElement("li");
    placeholder.className = "empty-state";
    placeholder.textContent = "La lista está vacía. Agrega tu primer valor para comenzar.";
    list.appendChild(placeholder);
    return;
  }

  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.value;
    list.appendChild(li);
  });
}

// Agregar nuevo item
// Cargar lista al abrir la página
form.addEventListener("submit", async event => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) {
    setStatus("Escribe algo para agregar un elemento.", "error");
    return;
  }

  button.disabled = true;
  setStatus("Guardando...");

  try {
    const response = await fetch(`${BACKEND_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ value })
    });

    if (!response.ok) {
      throw new Error("Error al guardar el elemento");
    }

    const saved = await response.json();
    items.push(saved);
    renderList();
    input.value = "";
    setStatus("Elemento guardado correctamente.", "success");
  } catch (error) {
    console.error(error);
    setStatus("No se pudo guardar el elemento. Intenta de nuevo.", "error");
  } finally {
    button.disabled = false;
    input.focus();
  }
});

// Cargar lista al abrir la página
await loadItems();
