let todos = [];
let currentFilter = "all";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const empty = document.getElementById("empty");
const count = document.getElementById("count");
const clearCompletedBtn = document.getElementById("clear-completed");
const filterBtns = Array.from(document.querySelectorAll("[data-filter]"));

const STORAGE_KEY = "todo_v1";

function makeId() {
    return crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random();
}

function save() {
    const data = { todos, currentFilter };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return;
    }

    try {
        const data = JSON.parse(raw);

        if (Array.isArray(data.todos)) {
            todos = data.todos;
        }

        if (typeof data.currentFilter === "string") {
            currentFilter = data.currentFilter;
        }
    } catch (err) {
        console.log(err);
    }
}

function getVisibleTodos() {
    if (currentFilter === "active") {
        return todos.filter(t => !t.completed);
    }

    if (currentFilter === "completed") {
        return todos.filter(t => t.completed);
    }

    return todos;
}

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function render() {
    const visible = getVisibleTodos();

    empty.style.display = visible.length === 0 ? "block" : "none";

    const remaining = todos.filter(t => !t.completed).length;
    count.textContent = `${remaining} item${remaining === 1 ? "" : "s"} left`;

    for (const btn of filterBtns) {
        btn.classList.toggle("is-active", btn.dataset.filter === currentFilter);
    }

    list.innerHTML = visible.map(todo => `
        <li class="item" data-id="${todo.id}">
            <input type="checkbox" data-action="toggle" ${todo.completed ? "checked" : ""} />
            <span class="text ${todo.completed ? "done" : ""}">
                ${escapeHtml(todo.text)}
            </span>
            <div class="actions">
                <button type="button" class="small" data-action="delete">Delete</button>
            </div>
        </li>
    `).join("");

    save();
}

load();
render();

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const text = input.value.trim();
    if (!text) {
        return;
    }

    todos.unshift({
        id: makeId(),
        text,
        completed: false,
    });

    input.value = "";
    input.focus();
    render();
});

list.addEventListener("change", function (e) {
    const li = e.target.closest(".item");
    if (!li) {
        return;
    }

    const id = li.dataset.id;
    const action = e.target.dataset.action;

    if (action === "toggle") {
        const todo = todos.find(t => t.id === id);
        if (!todo) {
            return;
        }

        todo.completed = !todo.completed;
        render();
    }
});

list.addEventListener("click", function (e) {
    const li = e.target.closest(".item");
    if (!li) {
        return;
    }

    const id = li.dataset.id;
    const action = e.target.dataset.action;

    if (action === "delete") {
        todos = todos.filter(t => t.id !== id);
        render();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener("click", function () {
        currentFilter = btn.dataset.filter;
        render();
    });
});

clearCompletedBtn.addEventListener("click", function () {
    todos = todos.filter(t => !t.completed);
    render();
});