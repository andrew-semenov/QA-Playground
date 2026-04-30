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
  },
  {
    title: "Calculator",
    description: "Calculator with obvious bugs: 0.1+0.2≠0.3, Infinity errors, and weird negative number handling...",
    link: "projects/calculator/index.html",
    type: "bug",
    tags: ["frontend", "math"]
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
    const isMissing = project.link === '#';
    const btnHtml = isMissing 
      ? `<button class="btn btn-disabled" disabled>${t.btnOpen}</button>`
      : `<a class="btn" href="${project.link}" target="_blank">${t.btnOpen}</a>`;

    if (isMissing) {
      card.classList.add('missing');
      card.dataset.soon = t.comingSoon;
    }

    card.innerHTML = `
      <span class="card-type ${project.type}">${typeLabels[project.type]}</span>
      <div class="card-tags">${tagsHtml}</div>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      ${btnHtml}
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