const form = document.getElementById("form");
const input = document.getElementById("task");
const list = document.getElementById("list");
const empty = document.getElementById("empty");
const counter = document.getElementById("counter");
const clearDoneBtn = document.getElementById("clearDone");
const filterBtns = document.querySelectorAll(".filter");

const STORAGE_KEY = "todo_tasks_v2";

let tasks = [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  // migração simples: se antes era array de strings
  if (saved.length && typeof saved[0] === "string") {
    tasks = saved.map((t) => ({ id: crypto.randomUUID(), text: t, done: false }));
    saveTasks();
  } else {
    tasks = saved;
  }
}

function render() {
  list.innerHTML = "";

  const filtered = tasks.filter((t) => {
    if (currentFilter === "active") return !t.done;
    if (currentFilter === "done") return t.done;
    return true;
  });

  filtered.forEach((task) => list.appendChild(createTaskItem(task)));

  // empty state
  empty.style.display = tasks.length === 0 ? "block" : "none";

  // counter
  const pending = tasks.filter((t) => !t.done).length;
  counter.textContent = `${pending} pendentes • ${tasks.length} total`;

  // botão limpar
  const hasDone = tasks.some((t) => t.done);
  clearDoneBtn.disabled = !hasDone;
  clearDoneBtn.style.opacity = hasDone ? "1" : ".5";
  clearDoneBtn.style.cursor = hasDone ? "pointer" : "not-allowed";
}

function createTaskItem(task) {
  const li = document.createElement("li");
  li.className = `todo ${task.done ? "done" : ""}`;

  const left = document.createElement("div");
  left.className = "left";

  const check = document.createElement("input");
  check.type = "checkbox";
  check.checked = task.done;
  check.setAttribute("aria-label", "Marcar como concluída");

  const span = document.createElement("span");
  span.className = "text";
  span.textContent = task.text;

  check.addEventListener("change", () => {
    task.done = check.checked;
    saveTasks();
    render();
  });

  left.appendChild(check);
  left.appendChild(span);

  const actions = document.createElement("div");
  actions.className = "actions";

  const del = document.createElement("button");
  del.className = "iconbtn danger";
  del.type = "button";
  del.textContent = "Excluir";
  del.setAttribute("aria-label", "Excluir tarefa");

  del.addEventListener("click", () => {
    tasks = tasks.filter((t) => t.id !== task.id);
    saveTasks();
    render();
  });

  actions.appendChild(del);

  li.appendChild(left);
  li.appendChild(actions);

  return li;
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  tasks.unshift({
    id: crypto.randomUUID(),
    text: trimmed,
    done: false,
  });

  saveTasks();
  render();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(input.value);
  input.value = "";
  input.focus();
});

clearDoneBtn.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.done);
  saveTasks();
  render();
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

// init
loadTasks();
render();