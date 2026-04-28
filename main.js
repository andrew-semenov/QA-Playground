const translations = {
  en: {
    heroTitle: "Test & Break Things",
    heroDesc: "A collection of projects designed for testing, finding bugs, and having fun.",
    navProjects: "Projects",
    navAbout: "About",
    statTotal: "Total Projects",
    statBugs: "Bug Projects",
    statGames: "Games",
    aboutTitle: "About",
    aboutDesc: "QA Playground is a collection of intentionally buggy projects, demos, and mini-games for testing purposes. Find bugs, report issues, or just explore how things break!",
    filterAll: "All",
    filterBugs: "🐛 Bugs",
    filterGames: "🎮 Games",
    filterDemos: "📺 Demos",
    filterFrontend: "🎨 Frontend",
    filterBackend: "⚙️ Backend",
    filterApi: "🔌 API",
    btnOpen: "Open",
    todoPlaceholder: "Add a new task...",
    todoAdd: "Add",
    todoPending: "tasks pending",
    todoCompleted: "completed"
  },
  zh: {
    heroTitle: "测试与破坏",
    heroDesc: "一个专为测试、找bug和娱乐而设计的项目集合。",
    navProjects: "项目",
    navAbout: "关于",
    statTotal: "项目总数",
    statBugs: "Bug项目",
    statGames: "游戏",
    aboutTitle: "关于",
    aboutDesc: "QA Playground 是一个故意包含bug的项目、演示和小游戏的集合，用于测试目的。找bug、报告问题，或者 simply explore事物是如何出错的！",
    filterAll: "全部",
    filterBugs: "🐛 Bug",
    filterGames: "🎮 游戏",
    filterDemos: "📺 演示",
    filterFrontend: "🎨 前端",
    filterBackend: "⚙️ 后端",
    filterApi: "🔌 API",
    btnOpen: "打开",
    todoPlaceholder: "添加新任务...",
    todoAdd: "添加",
    todoPending: "待办任务",
    todoCompleted: "已完成"
  },
  ru: {
    heroTitle: "Тестируй и ломай",
    heroDesc: "Коллекция проектов для тестирования, поиска багов и развлечения.",
    navProjects: "Проекты",
    navAbout: "О нас",
    statTotal: "Всего проектов",
    statBugs: "Баг-проекты",
    statGames: "Игры",
    aboutTitle: "О нас",
    aboutDesc: "QA Playground — это коллекция намеренно багованных проектов, демок и мини-игр для тестирования. Находи баги, сообщай о проблемах или просто исследуй, как всё ломается!",
    filterAll: "Все",
    filterBugs: "🐛 Баги",
    filterGames: "🎮 Игры",
    filterDemos: "📺 Демо",
    filterFrontend: "🎨 Фронтенд",
    filterBackend: "⚙️ Бэкенд",
    filterApi: "🔌 API",
    btnOpen: "Открыть",
    todoPlaceholder: "Добавить новую задачу...",
    todoAdd: "Добавить",
    todoPending: "задач в ожидании",
    todoCompleted: "выполнено"
  }
};

const projects = [
  {
    title: "Broken Form",
    description: "A form with multiple validation bugs - submit without filling required fields.",
    link: "#",
    type: "bug",
    tags: ["frontend", "validation"]
  },
  {
    title: "Memory Leak Demo",
    description: "Watch the browser memory increase as you interact with this demo.",
    link: "#",
    type: "bug",
    tags: ["frontend", "performance"]
  },
  {
    title: "API Error Handler",
    description: "API client with broken error handling - watch it fail silently.",
    link: "#",
    type: "bug",
    tags: ["api", "backend"]
  },
  {
    title: "Snake Game",
    description: "Classic snake game with a few unexpected behaviors...",
    link: "./projects/snake-game/index.html",
    type: "game",
    tags: ["frontend", "game"]
  },
  {
    title: "Broken Cart",
    description: "E-commerce shopping cart with calculation errors.",
    link: "#",
    type: "bug",
    tags: ["frontend", "backend"]
  },
  {
    title: "Race Condition Demo",
    description: "Demonstrates race conditions in concurrent operations.",
    link: "#",
    type: "demo",
    tags: ["backend", "api"]
  },
  {
    title: "Typing Game",
    description: "Speed typing game with some odd scoring behavior.",
    link: "#",
    type: "game",
    tags: ["frontend", "game"]
  },
  {
    title: "Broken Search",
    description: "Search functionality that doesn't work as expected.",
    link: "#",
    type: "bug",
    tags: ["api", "frontend"]
  },
  {
    title: "To-Do List",
    description: "Task management app with some interesting behaviors...",
    link: "projects/todo-list/index.html",
    type: "frontend",
    tags: ["frontend", "app"]
  }
];

const grid = document.getElementById('projectsGrid');

function renderProjects(filter = 'all') {
  grid.innerHTML = '';
  
  const filtered = filter === 'all' 
    ? projects 
    : projects.filter(p => p.type === filter || p.tags.includes(filter));

  const t = translations[currentLang];

  filtered.forEach(project => {
    const card = document.createElement('div');
    card.className = 'card';
    
    const typeLabels = { bug: '🐛 Bug', game: '🎮 Game', demo: '📺 Demo' };
    const tagsHtml = project.tags.map(tag => `<span class="card-tag">${tag}</span>`).join('');

    card.innerHTML = `
      <span class="card-type ${project.type}">${typeLabels[project.type]}</span>
      <div class="card-tags">${tagsHtml}</div>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <a class="btn" href="${project.link}" target="_blank">${t.btnOpen}</a>
    `;

    grid.appendChild(card);
  });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(btn.dataset.filter);
  });
});

document.getElementById('totalCount').textContent = projects.length;
document.getElementById('bugCount').textContent = projects.filter(p => p.type === 'bug').length;
document.getElementById('gameCount').textContent = projects.filter(p => p.type === 'game').length;

// Language switcher
let currentLang = localStorage.getItem('lang') || 'en';
document.getElementById('langSelect').value = currentLang;

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  const t = translations[lang];
  
  document.querySelectorAll('[data-i18]').forEach(el => {
    const key = el.getAttribute('data-i18');
    if (t[key]) el.textContent = t[key];
  });
  
  // Update filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns[0].textContent = t.filterAll;
  filterBtns[1].textContent = t.filterBugs;
  filterBtns[2].textContent = t.filterGames;
  filterBtns[3].textContent = t.filterDemos;
  filterBtns[4].textContent = t.filterFrontend;
  filterBtns[5].textContent = t.filterBackend;
  filterBtns[6].textContent = t.filterApi;
  
  renderProjects(document.querySelector('.filter-btn.active').dataset.filter);
}

document.getElementById('langSelect').addEventListener('change', (e) => {
  setLanguage(e.target.value);
});

// Initialize
setLanguage(currentLang);