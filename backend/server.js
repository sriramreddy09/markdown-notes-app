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

try {
  const res = await axios.get('http://127.0.0.1:5000/notes');
  setNotes(res.data);
} catch (err) {
  console.error("Error fetching notes", err);
}
app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  db.run("INSERT INTO notes (title, content) VALUES (?, ?)", [title, content], function(err) {
    res.json({ id: this.lastID });
  });
});

app.put('/notes/:id', (req, res) => {
  const { title, content } = req.body;
  db.run("UPDATE notes SET title=?, content=? WHERE id=?",
    [title, content, req.params.id],
    () => res.json({ updated: true })
  );
});

app.delete('/notes/:id', (req, res) => {
  db.run("DELETE FROM notes WHERE id=?", req.params.id, () => {
    res.json({ deleted: true });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));