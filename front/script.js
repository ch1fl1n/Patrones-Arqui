const BACKEND_URL = "http://localhost:3000";

const input = document.getElementById("itemInput");
const button = document.getElementById("addButton");
const list = document.getElementById("itemList");

// Cargar datos al iniciar
async function loadItems() {
  try {
    const response = await fetch(`${BACKEND_URL}/todos`);
    if (!response.ok) {
      throw new Error("Error al obtener los datos");
    }

    const data = await response.json();

    list.innerHTML = "";

    data.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item.value;
      list.appendChild(li);
    });
  } catch (error) {
    console.error(error);
  }
}

// Agregar nuevo item
button.addEventListener("click", async () => {
  const value = input.value.trim();
  if (!value) return;

  try {
    const response = await fetch(`${BACKEND_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ value })
    });

    if (!response.ok) {
      throw new Error("Error al guardar el item");
    }

    input.value = "";
    loadItems(); // refresca lista desde la DB
  } catch (error) {
    console.error(error);
  }
});

// Cargar lista al abrir la página
loadItems();
