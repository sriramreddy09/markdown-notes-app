const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize DB
const db = new Database('notes.db');

// Create table
db.prepare(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT
  )
`).run();

// GET all notes
app.get('/notes', (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM notes").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  CREATE note
app.post('/notes', (req, res) => {
  try {
    const { title, content } = req.body;

    const result = db
      .prepare("INSERT INTO notes (title, content) VALUES (?, ?)")
      .run(title, content);

    res.json({ id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE note
app.put('/notes/:id', (req, res) => {
  try {
    const { title, content } = req.body;

    db.prepare(
      "UPDATE notes SET title=?, content=? WHERE id=?"
    ).run(title, content, req.params.id);

    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE note
app.delete('/notes/:id', (req, res) => {
  try {
    db.prepare("DELETE FROM notes WHERE id=?").run(req.params.id);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root route (optional but useful)
app.get('/', (req, res) => {
  res.send("API is running 🚀");
});

// Port fix for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));