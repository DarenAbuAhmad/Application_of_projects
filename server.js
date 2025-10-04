const express = require("express");
const cors = require("cors");
const path = require("path");
const open = require("open");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

let projects = [
  { id: 1, name: "Subway Game Project", description: "משחק ריצה מהנה ברכבת התחתית", rating: 0 },
  { id: 2, name: "Application Projects", description: "עוזר למשתמשים לארגן פרויקטים", rating: 0 },
  { id: 3, name: "TO-DO List Project", description: "רשימת משימות", rating: 0 },
  { id: 4, name: "Memory Game Project", description: "משחק זיכרון", rating: 0 },
  { id: 5, name: "Simon Game Project", description: "משחק צבעים וקולות", rating: 0 }
];

// 🔄 API Routes
app.get("/projects", (req, res) => res.json(projects));

app.get("/projects/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const project = projects.find(p => p.id === id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

app.post("/projects", (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) return res.status(400).json({ error: "Name and description are required" });

  const newProject = {
    id: projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1,
    name,
    description,
    rating: 0
  };
  projects.push(newProject);
  res.status(201).json(newProject);
});

app.put("/projects/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description } = req.body;
  const project = projects.find(p => p.id === id);
  if (!project) return res.status(404).json({ error: "Project not found" });

  project.name = name;
  project.description = description;
  res.json(project);
});

app.delete("/projects/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Project not found" });
  projects.splice(index, 1);
  res.json({ success: true });
});

app.patch("/projects/:id/rate", (req, res) => {
  const id = parseInt(req.params.id);
  const { rating } = req.body;
  const project = projects.find(p => p.id === id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  if (typeof rating !== "number") return res.status(400).json({ error: "Rating must be a number" });

  project.rating = rating;
  res.json(project);
});

// 🔍 Serve index.html and details.html
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.get("/details.html", (req, res) => {
  res.sendFile(path.join(publicPath, "details.html"));
});

// 🟢 Start server
app.listen(PORT, async () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  try {
    await open(`http://localhost:${PORT}/index.html`);
  } catch (err) {
    console.warn("⚠️ Could not open browser:", err.message);
  }
});
