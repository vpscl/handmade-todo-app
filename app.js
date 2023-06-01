const todoForm = document.querySelector(".todo-form"),
  todoList = document.querySelector(".todo-list"),
  todoInput = todoForm.querySelector("input");
(totalTodos = document.querySelector(".total-tasks span")),
  (completedTodos = document.querySelector(".completed-tasks span")),
  (remainingTodos = document.querySelector(".remaining-tasks span"));

let todos = JSON.parse(localStorage.getItem("todos")) || [];

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!todoInput.value) {
    return;
  }

  const task = {
    id: new Date().getTime(),
    name: todoInput.value,
    isCompleted: false,
  };

  todos.push(task);
  localStorage.setItem("todos", JSON.stringify(todos));
  todoForm.reset();
  todoInput.focus();
  displayTodo(task);
  countTodos();
});

todoList.addEventListener("input", (e) => {
  const todoId = e.target.closest("li").id;
  updateTodo(todoId, e.target);
});

todoList.addEventListener("click", (e) => {
  const todoId = e.target.closest("li").id;

  if (
    e.target.parentElement.classList.contains("remove-task") ||
    e.target.classList.contains("remove-task")
  ) {
    removeTodo(todoId);
  }
});

const displayTodo = (todo) => {
  const todoItem = document.createElement("li");
  const todoMarkup = `
    <div class="checkbox-wrapper">
    <input type="checkbox" id="${todo.name}-${todo.id}" name="tasks" />
    <label for="${todo.name}-${todo.id}">
      <svg class="checkbox-empty">
        <use href="#checkbox_empty"></use>
      </svg>
      <svg class="checkmark">
        <use href="#checkmark"></use>
      </svg>
    </label>
    <span contenteditable>${todo.name}</span>
  </div>
  <button class="remove-task" title="Remove ${todo.name} task">
    <svg>
      <use href="#close"></use>
    </svg>
  </button>
  `;

  todoItem.setAttribute("id", todo.id);
  todo.isCompleted ? todoItem.classList.add("completed") : "";
  todoItem.innerHTML = todoMarkup;
  todoList.appendChild(todoItem);

  countTodos();
};

const countTodos = () => {
  const completed = todos.filter((todo) => todo.isCompleted === true);

  totalTodos.innerText = todos.length;
  completedTodos.innerText = completed.length;
  remainingTodos.innerText = todos.length - completed.length;
};

const updateTodo = (todoId, el) => {
  const todo = todos.find((todo) => todo.id === parseInt(todoId));
  const todoText = document.querySelector(`[id='${todoId}'] span`);

  if (el.type == "checkbox") {
    todo.isCompleted = !todo.isCompleted;

    if (todo.isCompleted) {
      el.closest("li").classList.add("completed");
      todoText.removeAttribute("contenteditable");
    } else {
      el.closest("li").classList.remove("completed");
      todoText.setAttribute("contenteditable", true);
    }
  } else {
    todo.name = todoText.innerText.trim();
    todoList.onkeydown = (e) => (e.key == "Enter" ? e.target.blur() : "");
  }

  localStorage.setItem("todos", JSON.stringify(todos));
  countTodos();
};

const removeTodo = (todoId) => {
  todos = todos.filter((todo) => todo.id !== parseInt(todoId));
  localStorage.setItem("todos", JSON.stringify(todos));

  document.getElementById(todoId).remove();
  countTodos();
};

if (localStorage.getItem("todos")) {
  todos.map((todo) => {
    displayTodo(todo);
  });
}
