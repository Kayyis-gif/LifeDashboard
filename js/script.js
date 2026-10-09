function updateClock() {
    const now = new Date();

    document.getElementById("date").textContent =
        now.toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    document.getElementById("clock").textContent =
        now.toLocaleTimeString("en-GB");
}

updateClock();
setInterval(updateClock, 1000);
const todoInput = document.getElementById("todo-input");
const addTodoButton = document.getElementById("add-todo");
const todoList = document.getElementById("todo-list");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = "";

    todos.forEach(function(todo, index) {
        const li = document.createElement("li");

        const taskText = document.createElement("span");
        taskText.textContent = todo.text || todo;
        
        if (todo.done) {
            taskText.style.textDecoration = "line-through";
            taskText.style.opacity = "0.5";
        }

        const doneButton = document.createElement("button");
        doneButton.textContent = todo.done ? "Undo ↩️" : "Done ☑️";
        doneButton.style.marginLeft = "10px";

        doneButton.addEventListener("click", function() {
            todos[index] = typeof todo === "string"
                ? { text: todo, done: true }
                : { ...todo, done: !todo.done };

            saveTodos();
            renderTodos();
        });

        const editButton = document.createElement("button");
        editButton.textContent = "Edit ✏️";
        editButton.style.marginLeft = "5px";

        editButton.addEventListener("click", function() {
            const newTask = prompt("Edit your task:", todo.text || todo);

            if (newTask !== null && newTask.trim() !== "") {
                todos[index] = {
                    ...(typeof todo === "string" ? { done: false } : todo),
                    text: newTask.trim()
                };

                saveTodos();
                renderTodos();
            }
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete 🗑️";
        deleteButton.style.marginLeft = "5px";

        deleteButton.addEventListener("click", function() {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        });

        li.appendChild(taskText);
        li.appendChild(doneButton);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        todoList.appendChild(li);
    });

}

function addTodo() {
    const task = todoInput.value.trim();

    if (task === "") {
        alert("Please enter a task first!");
        return;
    }

    todos.push({
        text: task,
        done: false
    });

    saveTodos();
    renderTodos();

    todoInput.value = "";
}

addTodoButton.addEventListener("click", addTodo);

todoInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTodo();
    }
});

renderTodos();
let selectedMinutes = 25;
let timerSeconds = selectedMinutes * 60;
let timerInterval = null;

const timerDisplay = document.getElementById("timer-display");
const startTimerButton = document.getElementById("start-timer");
const pauseTimerButton = document.getElementById("pause-timer");
const resetTimerButton = document.getElementById("reset-timer");
const timerMinutesInput = document.getElementById("timer-minutes");
const setTimerButton = document.getElementById("set-timer");

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

startTimerButton.addEventListener("click", function() {
    if (timerInterval !== null) return;

    timerInterval = setInterval(function() {
        if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("Great job! Focus session completed! 🐱");
        }
    }, 1000);
});

pauseTimerButton.addEventListener("click", function() {
    clearInterval(timerInterval);
    timerInterval = null;
});

resetTimerButton.addEventListener("click", function() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerSeconds = selectedMinutes * 60;
    updateTimerDisplay();
});

updateTimerDisplay();
setTimerButton.addEventListener("click", function() {
    const minutes = Number(timerMinutesInput.value);

    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
        alert("Please choose between 1 and 180 minutes!");
        return;
    }

    clearInterval(timerInterval);
    timerInterval = null;

    selectedMinutes = minutes;
    timerSeconds = selectedMinutes * 60;
    updateTimerDisplay();
});
const linkNameInput = document.getElementById("link-name");
const linkUrlInput = document.getElementById("link-url");
const addLinkButton = document.getElementById("add-link");
const linksList = document.getElementById("links-list");

let quickLinks = JSON.parse(localStorage.getItem("quickLinks")) || [];

function saveQuickLinks() {
    localStorage.setItem("quickLinks", JSON.stringify(quickLinks));
}

function renderQuickLinks() {
    linksList.innerHTML = "";

    quickLinks.forEach(function(link, index) {
        const li = document.createElement("li");

        const anchor = document.createElement("a");
        anchor.textContent = link.name;
        anchor.href = link.url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete 🗑️";
        deleteButton.style.marginLeft = "10px";

        deleteButton.addEventListener("click", function() {
            quickLinks.splice(index, 1);
            saveQuickLinks();
            renderQuickLinks();
        });

        li.appendChild(anchor);
        li.appendChild(deleteButton);
        linksList.appendChild(li);
    });
}

addLinkButton.addEventListener("click", function() {
    const name = linkNameInput.value.trim();
    let url = linkUrlInput.value.trim();

    if (name === "" || url === "") {
        alert("Please enter both a link name and URL!");
        return;
    }

    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }

    try {
        const parsedUrl = new URL(url);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            throw new Error("Invalid URL");
        }
    } catch {
        alert("Please enter a valid website URL!");
        return;
    }

    quickLinks.push({ name: name, url: url });
    saveQuickLinks();
    renderQuickLinks();

    linkNameInput.value = "";
    linkUrlInput.value = "";
});

renderQuickLinks();
const themeToggle = document.getElementById("theme-toggle");

let isDarkMode = localStorage.getItem("darkMode") === "true";

function applyTheme() {
    document.body.classList.toggle("dark-mode", isDarkMode);

    themeToggle.textContent = isDarkMode
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
}

themeToggle.addEventListener("click", function() {
    isDarkMode = !isDarkMode;

    localStorage.setItem("darkMode", isDarkMode);
    applyTheme();
});

applyTheme();
const greeting = document.getElementById("greeting");
const nameInput = document.getElementById("name-input");
const saveNameButton = document.getElementById("save-name");

let savedName = localStorage.getItem("userName") || "";

function updateGreeting() {
  const hour = new Date().getHours();
  let timeGreeting;

  if (hour < 12) {
    timeGreeting = "Good morning";
  } else if (hour < 18) {
    timeGreeting = "Good afternoon";
  } else {
    timeGreeting = "Good evening";
  }

  if (savedName) {
    greeting.textContent = ${timeGreeting}, ${savedName}!;
  } else {
    greeting.textContent = ${timeGreeting}, Kitty Lover!;
  }
}

saveNameButton.addEventListener("click", function () {
    const newName = nameInput.value.trim();

    if (newName === "") {
        alert("Please enter your name first! 🐱");
        return;
    }

    savedName = newName;
    localStorage.setItem("userName", savedName);
    updateGreeting();
    nameInput.value = "";
});

updateGreeting();

