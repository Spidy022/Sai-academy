# Sai Police Academy - Monorepo Portal

![Sai Police Academy Logo](frontend/public/logo.png)

A full-stack educational management portal built for **Sai Police Academy**. 

Features multi-role student/admin dashboards, course distribution, PDF question bank downloads, interactive mock exams, fee tracking, and downloadable payment receipts.

---

## 📁 Repository Structure

```
Sai-academy/
├── backend/                      # Python FastAPI REST API Backend
│   ├── config.py                 # Environment & app settings
│   ├── database.py               # SQLAlchemy PostgreSQL / SQLite driver
│   ├── models.py                 # Database ORM models
│   ├── schemas.py                # Pydantic API validation schemas
│   ├── seed.py                   # Auto-seeding database engine
│   ├── main.py                   # FastAPI REST API handlers
│   └── requirements.txt          # Python dependencies
│
├── frontend/                     # React 19 + Vite Frontend Application
│   ├── public/                   # Static branding & assets
│   │   └── logo.png              # Academy official logo badge
│   ├── src/                      # Components, pages, and router
│   ├── index.html                # Entry HTML file
│   ├── package.json              # Frontend Node dependencies
│   └── vite.config.js            # Vite config with API proxy
│
├── .gitignore                    # Git ignore specifications
├── docker-compose.yml            # Containerized deployment specification
├── package.json                  # Root monorepo script runner
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
# Install Python backend requirements
pip install -r backend/requirements.txt

# Install Node dependencies
npm install
npm --prefix frontend install
```

### 2. Run Both Frontend & Backend Concurrently
```bash
npm run dev
```

* **Frontend Web App**: `http://localhost:5173`
* **FastAPI Backend & Interactive Swagger API Docs**: `http://localhost:8000/docs`
