const form = document.getElementById("form");
const input = document.getElementById("task");
const list = document.getElementById("list");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  const li = document.createElement("li");
  li.innerHTML = `
    <span>${text}</span>
    <button type="button">Excluir</button>
  `;

  li.querySelector("button").addEventListener("click", () => li.remove());

  list.appendChild(li);
  input.value = "";
  input.focus();
});