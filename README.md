# EngiPath 🚀

> **Personalized, Prerequisite-Aware Career Roadmap for Engineering Students**

EngiPath is a full-stack MERN application that helps engineering students build a personalized learning path toward their target engineering career. Students take a skill assessment, get a topologically-ordered roadmap, see recommended portfolio projects, and track a live Placement Readiness Score.

---

## ✨ Features

- **Guided Onboarding**: Login → Assessment → Roadmap → Projects (step-by-step)
- **Technical Skill Assessment**: 90 comprehensive quiz questions (10 per topic across 9 skills)
- **Topological Prerequisite Roadmap**: DAG-based Kahn's algorithm ensures you learn skills in the right dependency order
- **Project Recommendations Ladder**: Beginner → Intermediate → Advanced projects matched to your skill level
- **Live Placement Readiness Score**: Computed from skill mastery (70%), quiz scores (20%), projects completed (10%)
- **Monitored Activity Feed**: Every quiz submission, progress update, and project completion is tracked and scored
- **Career Path Differentiation**: Full-Stack Web Developer, Backend Systems Engineer, Frontend React Specialist
- **Gossamer Design Theme**: Premium `#2BCFCE` (Cyan) & `#EC4D25` (Orange) Gossamer color palette

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite, React Router v6, Axios, Recharts |
| Backend | Node.js, Express.js, JWT Authentication |
| Database | MongoDB (local) / mongodb-memory-server (fallback) |
| Styling | Vanilla CSS with Gossamer design system |

---

## 📁 Project Structure

```
engipath/
├── client/               # React Vite Frontend
│   ├── src/
│   │   ├── pages/        # Dashboard, Roadmap, Projects, Assessment, Profile
│   │   ├── components/   # Navbar, Footer, ProtectedRoute
│   │   ├── context/      # AuthContext (JWT state)
│   │   └── services/     # Axios API instance
│   └── vite.config.js
│
├── server/               # Express Backend
│   ├── config/           # connectDB (auto-seed on startup)
│   ├── controllers/      # dashboard, roadmap, assessment, projects, profile
│   ├── models/           # User, Skill, CareerPath, Project, QuizQuestion, Progress
│   ├── routes/           # REST API routes
│   ├── seed/             # autoSeed.js (90 quiz questions, 9 skills, 3 career paths)
│   └── services/         # roadmapEngine, projectEngine, readinessEngine, gapEngine
│
└── .gitignore
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- MongoDB (optional — falls back to in-memory MongoDB automatically)

### 1. Clone Repository
```bash
git clone https://github.com/<your-username>/engipath.git
cd engipath
```

### 2. Install Dependencies
```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 3. Configure Environment (Optional)
```bash
# server/.env
MONGO_URI=mongodb://localhost:27017/engipath
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```
> If no `.env` is provided, the server auto-starts with an in-memory MongoDB and auto-seeds all data.

### 4. Run Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd server
node server.js

# Terminal 2 — Frontend (port 3000)
cd client
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | student@engipath.com | student123 |
| Admin | admin@engipath.com | admin123 |

---

## 📊 Assessment Quiz Topics

The assessment features **90 technical questions (10 per topic)**:

1. **HTML & CSS** — Flexbox, Grid, Specificity, Box Model
2. **JavaScript Fundamentals** — Closures, Async, Event Loop, Destructuring
3. **Git & GitHub** — Branching, Rebase vs Merge, Cherry-pick, PR Workflow
4. **React Fundamentals** — Hooks, Virtual DOM, Context, Memoization
5. **Node.js & Express** — Event Loop, Middleware, Error Handling, CORS
6. **MongoDB & Mongoose** — Documents, Schemas, Aggregation, Indexes
7. **JWT Authentication** — Token structure, bcrypt, Role-based Access, XSS
8. **DSA Basics** — Arrays, Big-O, Sorting, BFS/DFS, Hash Tables
9. **MERN Capstone** — Full-stack data flow, Proxy config, AuthContext, Deployment

---

## 🎨 Color Theme — Gossamer

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#FAFAFA` | Page backgrounds |
| Borders | `#CDCDCF` | Cards, inputs |
| Muted Text | `#939599` | Placeholders |
| Cyan Accent | `#2BCFCE` | Mastered skills, success |
| Orange Primary | `#EC4D25` | Buttons, actions, highlights |

---

## 📄 License

MIT License — Built for engineering students by engineering students.
