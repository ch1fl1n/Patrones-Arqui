const BACKEND_URL = "http://localhost:3000"; 

const input = document.getElementById("itemInput");
const button = document.getElementById("addButton");
const list = document.getElementById("itemList");

// Cargar datos al iniciar
async function loadItems() {
  const response = await fetch(`${BACKEND_URL}/items`);
  const data = await response.json();

  list.innerHTML = "";

  data.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.value;
    list.appendChild(li);
  });
}

// Agregar nuevo item
button.addEventListener("click", async () => {
  const value = input.value.trim();
  if (!value) return;

  await fetch(`${BACKEND_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ value })
  });

  input.value = "";
  loadItems();
});

// Cargar lista al abrir la página
loadItems();
