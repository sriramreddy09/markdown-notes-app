const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./notes.db');

db.run(`CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  content TEXT
)`);

// ✅ GET notes
app.get('/notes', (req, res) => {
  db.all("SELECT * FROM notes", [], (err, rows) => {
    res.json(rows);
  });
});

// ✅ POST
app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  db.run(
    "INSERT INTO notes (title, content) VALUES (?, ?)",
    [title, content],
    function (err) {
      res.json({ id: this.lastID });
    }
  );
});

// ✅ PUT
app.put('/notes/:id', (req, res) => {
  const { title, content } = req.body;
  db.run(
    "UPDATE notes SET title=?, content=? WHERE id=?",
    [title, content, req.params.id],
    () => res.json({ updated: true })
  );
});

// ✅ DELETE
app.delete('/notes/:id', (req, res) => {
  db.run("DELETE FROM notes WHERE id=?", req.params.id, () => {
    res.json({ deleted: true });
  });
});

// ✅ PORT FIX (important for Render)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));