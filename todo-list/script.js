const form = document.getElementById("form");
const input = document.getElementById("task");
const list = document.getElementById("list");

const STORAGE_KEY = "todo_tasks";

// Carrega tarefas salvas quando abrir a página
document.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  saved.forEach(addTaskToDOM);
});

function saveTasks() {
  const tasks = Array.from(list.querySelectorAll("li span")).map(span => span.textContent);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function addTaskToDOM(text) {
  const li = document.createElement("li");
  li.innerHTML = `
    <span>${text}</span>
    <button type="button">Excluir</button>
  `;

  li.querySelector("button").addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  list.appendChild(li);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  addTaskToDOM(text);
  saveTasks();

  input.value = "";
  input.focus();
});