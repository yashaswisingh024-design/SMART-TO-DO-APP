const taskInput = document.getElementById("taskInput");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filter");
const addTaskBtn = document.getElementById("addTaskBtn");
const darkBtn = document.querySelector(".dark-btn");
const taskList = document.getElementById("taskList");
const emptyText = document.getElementById("emptyText");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = localStorage.getItem("darkMode") === "true";

if (darkMode) {
  document.body.classList.add("dark");
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    addTask();
  }
});
searchInput.addEventListener("input", renderTasks);
filterSelect.addEventListener("change", renderTasks);
darkBtn.addEventListener("click", toggleDarkMode);

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false
  });

  taskInput.value = "";
  saveTasks();
  renderTasks();
  taskInput.focus();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );

  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(task => task.id === id);
  if (!task) return;

  const newText = prompt("Edit task:", task.text);
  if (newText === null) return;

  const trimmedText = newText.trim();
  if (!trimmedText) return;

  tasks = tasks.map(task =>
    task.id === id ? { ...task, text: trimmedText } : task
  );

  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveSettings() {
  localStorage.setItem("darkMode", darkMode ? "true" : "false");
}

function renderTasks() {
  const query = searchInput.value.trim().toLowerCase();
  const filter = filterSelect.value;

  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(query);
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "pending" && !task.completed);
    return matchesSearch && matchesFilter;
  });

  if (filteredTasks.length === 0) {
    emptyText.style.display = "block";
    emptyText.textContent = tasks.length === 0
      ? "No tasks yet 🎉"
      : "No tasks match your filters.";
    return;
  }

  emptyText.style.display = "none";

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    if (task.completed) {
      taskText.classList.add("done");
    }

    const actions = document.createElement("div");

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.textContent = "✔";
    toggleBtn.title = task.completed ? "Mark pending" : "Mark completed";
    toggleBtn.addEventListener("click", () => toggleTask(task.id));

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.textContent = "✏";
    editBtn.title = "Edit task";
    editBtn.addEventListener("click", () => editTask(task.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "🗑";
    deleteBtn.title = "Delete task";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    actions.append(toggleBtn, editBtn, deleteBtn);
    li.append(taskText, actions);
    taskList.appendChild(li);
  });
}

function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark", darkMode);
  saveSettings();
}

renderTasks();