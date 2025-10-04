const container = document.getElementById("projectsContainer");
let editId = null;

const defaultProjects = [
  { id: 1, name: "Subway Game Project", description: "משחק ריצה מהנה ברכבת התחתית", rating: 0 },
  { id: 2, name: "Application Projects", description: "עוזר למשתמשים לארגן פרויקטים", rating: 0 },
  { id: 3, name: "TO-DO List Project", description: "רשימת משימות", rating: 0 },
  { id: 4, name: "Memory Game Project", description: "משחק זיכרון", rating: 0 },
  { id: 5, name: "Simon Game Project", description: "משחק צבעים וקולות", rating: 0 }
];

function getProjects() {
  return JSON.parse(localStorage.getItem("projectsData")) || defaultProjects;
}

function saveProjects(projects) {
  localStorage.setItem("projectsData", JSON.stringify(projects));
}

function displayProjects() {
  const projects = getProjects();
  container.innerHTML = "";

  projects.forEach(p => {
    const div = document.createElement("div");
    div.className = "project-card";
    div.innerHTML = `
      <a href="details.html?id=${p.id}">
        <h3>${p.name}</h3>
      </a>
      <p>${p.description}</p>
      <div id="stars-${p.id}">
        ${[1, 2, 3, 4, 5].map(i => `
          <span class="stars ${i <= (p.rating || 0) ? 'selected' : ''}" data-id="${p.id}" data-value="${i}">&#9733;</span>
        `).join('')}
      </div>
      <div class="actions">
        <button class="editBtn" data-id="${p.id}">✏️</button>
        <button class="deleteBtn" data-id="${p.id}">🗑️</button>
      </div>
    `;
    container.appendChild(div);
  });

  document.querySelectorAll(".stars").forEach(star => {
    star.addEventListener("click", () => {
      const id = parseInt(star.dataset.id);
      const value = parseInt(star.dataset.value);
      const projects = getProjects();
      const project = projects.find(p => p.id === id);
      if (!project) return;
      project.rating = value;
      saveProjects(projects);
      displayProjects();
    });
  });

  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      let projects = getProjects();
      projects = projects.filter(p => p.id !== id);
      saveProjects(projects);
      displayProjects();
    });
  });

  document.querySelectorAll(".editBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const projects = getProjects();
      const project = projects.find(p => p.id === id);
      if (!project) return;

      editId = id;
      document.getElementById("projectName").value = project.name;
      document.getElementById("projectDesc").value = project.description;
      // document.getElementById("projectImg").value = project.image;

      document.getElementById("formTitle").textContent = "✏️";
      document.getElementById("addProjectBtn").textContent = "💾";
      document.getElementById("cancelEditBtn").style.display = "inline";
    });
  });
}

document.getElementById("addProjectBtn").addEventListener("click", () => {
  const name = document.getElementById("projectName").value.trim();
  const desc = document.getElementById("projectDesc").value.trim();
  // const img = document.getElementById("projectImg").value.trim();

  if (!name || !desc) {
    alert("Name and description are required!");
    return;
  }

  const projects = getProjects();

  if (editId) {
    const project = projects.find(p => p.id === editId);
    project.name = name;
    project.description = desc;
    // editId = null;
    document.getElementById("formTitle").textContent = "📁 Add new project";
    document.getElementById("addProjectBtn").textContent = "➕ Add project";
    document.getElementById("cancelEditBtn").style.display = "none";
  } else {
    const newProject = {
      id: projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1,
      name,
      description: desc,
      rating: 0
    };
    projects.push(newProject);
  }

  saveProjects(projects);
  document.getElementById("projectName").value = "";
  document.getElementById("projectDesc").value = "";
  // document.getElementById("projectImg").value = "";
  displayProjects();
});

document.getElementById("cancelEditBtn").addEventListener("click", () => {
  editId = null;
  document.getElementById("projectName").value = "";
  document.getElementById("projectDesc").value = "";
  // document.getElementById("projectImg").value = "";
  document.getElementById("formTitle").textContent = "📁 Add new project";
  document.getElementById("addProjectBtn").textContent = "➕ Add project";
  document.getElementById("cancelEditBtn").style.display = "none";
});

displayProjects();
