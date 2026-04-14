# Markdown Notes App

A full-stack Notes Application with Markdown support and real-time preview.

## 🚀 Features
- Create, edit, delete notes
- Markdown support (bold, headings, lists, code)
- Live preview
- Auto-save (debounced)
- Search notes

## 🛠 Tech Stack
- Frontend: React.js
- Backend: Node.js (Express)
- Database: SQLite (better-sqlite3)
- Deployment:
  - Frontend: Vercel
  - Backend: Render

## 🔗 Live Demo
Frontend: https://markdown-notes-app-sooty.vercel.app/  
Backend: https://notes-backend-n9g3.onrender.com/

## ⚙️ Run Locally

### Backend
cd backend  
npm install  
npm start  

### Frontend
cd frontend  
npm install  
npm start  

## 📌 API Endpoints
- GET /notes
- POST /notes
- PUT /notes/:id
- DELETE /notes/:id
