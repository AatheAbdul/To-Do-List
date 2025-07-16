// Load tasks from localStorage on page load
window.addEventListener("load", () => {
  const stored = localStorage.getItem("tasks");
  const tasks = stored ? JSON.parse(stored) : [];
  tasks.forEach(createTaskElement);
});

// Save tasks to localStorage
function saveTasksToStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Handle form submit
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  addTask();
});

function addTask() {
  const taskDetails = document.getElementById("taskdetail").value.trim();
  const dueDate = document.getElementById("duedate").value;
  const isStarred = document.getElementById("star").checked;

  if (taskDetails === "") return;

  const dateFormatted = dueDate
    ? new Date(dueDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      })
    : "";

  const task = {
    detail: taskDetails,
    dueDate: dateFormatted,
    isStarred: isStarred,
    isCompleted: false,
  };

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  saveTasksToStorage(tasks);

  createTaskElement(task);
  document.querySelector("form").reset();
  document.getElementById("taskdetail").focus();
}

// Create a task card and insert into DOM
function createTaskElement(task) {
  if (!task.detail || typeof task.detail !== 'string') return;
  const taskHTML = `
    <div class="task">
      <div class="task-details" style="margin-left: 0.5rem">
        <p style="text-decoration: ${task.isCompleted ? 'line-through' : 'none'};">
          ${task.detail}
        </p>
      </div>
      <div class="task-icons">
        <p class="star-icon" style="color: ${task.isStarred ? "gold" : "#ffffff"};">&#9733;</p>
        <div class="date">
          <i class="bi bi-calendar" style="margin-right: 0.2rem;"></i>
          <span>${task.dueDate}</span>
        </div>
        <i class="${task.isCompleted ? 'bi bi-check2-square' : 'bi bi-square'}" onclick="markAsComplete(this)" style="cursor: pointer;"></i>
        <i class="bi bi-trash-fill" onclick="deleteTask(this)" style="cursor: pointer; margin-right: 0.5rem;"></i>
      </div>
    </div>
  `;
  document.querySelector(".tasks").insertAdjacentHTML("beforeend", taskHTML);
}

// Delete a task
function deleteTask(icon) {
  const taskElement = icon.closest(".task");
  const taskText = taskElement.querySelector(".task-details p").textContent.trim();

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((t) => t.detail !== taskText);
  saveTasksToStorage(tasks);

  taskElement.remove();
}

// Mark a task as complete/incomplete
function markAsComplete(icon) {
  const currentTask = icon.closest(".task");
  const taskDetails = currentTask.querySelector(".task-details p");
  const taskText = taskDetails.textContent.trim();

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks = tasks.map((t) => {
    if (t.detail === taskText) {
      t.isCompleted = !t.isCompleted;
    }
    return t;
  });

  saveTasksToStorage(tasks);

  const isComplete = taskDetails.style.textDecoration === 'line-through';
  taskDetails.style.textDecoration = isComplete ? 'none' : 'line-through';
  icon.className = isComplete ? 'bi bi-square' : 'bi bi-check2-square';
}
