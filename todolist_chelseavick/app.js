let todos = [];
let currentfilter = 'all';

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const empty = document.getElementById("empty");
const count = document.getElementById("count");
const clearCompletedBtn = document.getElementById("clear-completed");
const filterBtns = Array.from(document.querySelectorAll("[dta-filter]"));

const STORAGE_KEY = "todo_v1";

function makeId() {
    return crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random();
}

function save() {
    const data = { todos, currentFilter };
    localStorage,setItem(STORAGE_KEY, JSON.stringify(data));

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
         if (typeof data.currentFilter == "string") {
            currentfilter = data.currentFilter;

         }
         
    } catch (err) {
        console.log(err);
    }
} 

function getVisableTodos () {
    if ( currentFilter == "active") {
        return todos.filter(t => !t.completed);
    }
    if (currentFilter === "completed") {
        return todos.filter(t => t.completed);
    }
    return todos; 

}


function render() {
    const visible = getVisableTodos();

    empty.style.display = visible.length === 0 ? "block" : "none";


    const remaining = todos.filter(t => !t.completed).length;
    count.textContent = `${remaining} item${remaining === 1 ? "" : "s"} left`;

    for(const btn of filterBtns) {
        btn.classList.toggle("is-active", btn.dataset.filter == currentFilter);
    }


    list.innerHTML = visible.map(todos => `
          <li class="item" data-id"${todos.id}">
          <input type="checkbox" data-action="toggle" ${todos.completed ? "checked" : "" } />
          span class="text" ${todos.completed ? "done" : ""}>
               ${escapeHtml(todos.text)}
               </span>
            <div class="actions">
            <button type="button" class="small" data-actions="delete">Delete</button>
            </div>
          </li>
        `).join("");


save();
    }