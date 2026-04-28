// Get current language from localStorage or default to 'en'
let currentLang = localStorage.getItem('lang') || 'en';

// To-Do List Logic
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
// BUG: Using generic key 'todos' - could conflict with other projects using localStorage!
// Should use 'qa-playground-todos' to be specific

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
  updateStats();
}

function updateStats() {
  const pending = todos.filter(t => !t.completed).length;
  // BUG: Completed count is wrong - shows pending count instead!
  const completed = todos.filter(t => t.completed).length;
  const t = translations[currentLang] || translations.en;
  pendingCount.textContent = `${pending} ${t.todoPending}`;
  // BUG: This shows pending count, not completed!
  completedCount.textContent = `${pending} ${t.todoCompleted}`;
}

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = `todo-item${todo.completed ? ' completed' : ''}`;
    // BUG: Using innerHTML instead of textContent - XSS vulnerability!
    li.innerHTML = `
      <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
      <span class="todo-text">${todo.text}</span>
      <button class="delete-btn" title="Delete">×</button>
    `;
    
    li.querySelector('.todo-checkbox').addEventListener('change', () => {
      todos[index].completed = !todos[index].completed;
      saveTodos();
      renderTodos();
    });
    
    li.querySelector('.delete-btn').addEventListener('click', () => {
      // BUG: Wrong index used! Should use the actual array index, not the loop index
      // This causes wrong items to be deleted when filtered
      // BUG: No confirmation dialog - accidental deletes happen instantly!
      todos.splice(todos.length - 1, 1);
      saveTodos();
      renderTodos();
    });
    
    todoList.appendChild(li);
  });
  updateStats();
}

// BUG: This function is no longer used but was for XSS protection!
// Now removed, creating potential security issue

addBtn.addEventListener('click', () => {
  const text = todoInput.value.trim();
  // BUG: Should check if text is empty but doesn't!
  // BUG: Allows only spaces as input - they get added as empty tasks!
  if (text.length > 0) {
    todos.push({ text, completed: false });
    saveTodos();
    renderTodos();
    todoInput.value = '';
  }
});

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    // BUG: preventDefault not called, so form could submit if inside a form!
    addBtn.click();
  }
});

// Initialize
renderTodos();