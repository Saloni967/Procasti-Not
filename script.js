const form = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const heading = document.getElementById('task-heading').value;
  const description = document.getElementById('task-desc').value;
  const deadline = document.getElementById('deadline-input').value;
  const priority = document.getElementById('priority-input').value;

  tasks.push({ heading, description, deadline, priority, done: false });
  saveTasks();
  form.reset();
});

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = '';

  tasks.sort((a, b) => {
    if (a.done !== b.done) return b.done - a.done;
    if (!a.done && !b.done) return new Date(a.deadline) - new Date(b.deadline);
    return 0;
  });

  tasks.forEach((task, index) => {
    const div = document.createElement('div');
    div.className = `task ${task.priority.toLowerCase()} ${task.done ? 'done' : ''}`;

    div.innerHTML = `
      <strong>${task.heading}</strong>
      <p>${task.description}</p>
      <p><em>Deadline:</em> ${task.deadline}</p>
      <p><em>Priority:</em> ${task.priority}</p>
      ${task.done ? `
        <em>Completed</em>
        <button onclick="deleteTask(${index})">Delete</button>
      ` : `
        <button onclick="editTask(${index})">Edit</button>
        <button onclick="markDone(${index})">Mark as Done</button>
      `}
    `;

    taskList.appendChild(div);
  });
}

function editTask(index) {
  const task = tasks[index];
  if (task.done) return;

  const newHeading = prompt('Edit heading:', task.heading);
  const newDesc = prompt('Edit description:', task.description);
  const newDeadline = prompt('Edit deadline:', task.deadline);
  const newPriority = prompt('Edit priority (High, Medium, Low):', task.priority);

  if (newHeading && newDesc && newDeadline && newPriority) {
    tasks[index] = { ...task, heading: newHeading, description: newDesc, deadline: newDeadline, priority: newPriority };
    saveTasks();
  }
}

function markDone(index) {
  tasks[index].done = true;
  saveTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
}

renderTasks();