import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './App.css';

const API_URL = "https://notes-backend-n9g3.onrender.com";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  // ✅ Fetch notes
  const fetchNotes = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/notes`);
      setNotes(res.data.reverse()); // latest first
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // ✅ Auto-save
  const autoSaveNote = useCallback(async () => {
    if (!title.trim() && !content.trim()) return;

    try {
      setSaving(true);

      if (selectedId) {
        await axios.put(`${API_URL}/notes/${selectedId}`, {
          title,
          content,
        });
      } else {
        const res = await axios.post(`${API_URL}/notes`, {
          title,
          content,
        });
        setSelectedId(res.data.id);
      }

      fetchNotes();
      setSaving(false);
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  }, [title, content, selectedId, fetchNotes]);

  // ⏱️ Debounce
  useEffect(() => {
    if (!title && !content) return;

    const timer = setTimeout(() => {
      autoSaveNote();
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, content, autoSaveNote]);

  // ✅ New Note
  const newNote = () => {
    setTitle('');
    setContent('');
    setSelectedId(null);
  };

  // ✅ Delete
  const deleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      await axios.delete(`${API_URL}/notes/${id}`);
      fetchNotes();

      if (selectedId === id) newNote();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Edit
  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setSelectedId(note.id);
  };

  return (
    <div className="container">

      {/* Sidebar */}
      <div className="sidebar">
        <button className="new-btn" onClick={newNote}>
          + New Note
        </button>

        <input
          className="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <h3>Notes</h3>

        {notes.length === 0 && <p>No notes yet</p>}

        {notes
          .filter(note =>
            note.title.toLowerCase().includes(search.toLowerCase()) ||
            note.content.toLowerCase().includes(search.toLowerCase())
          )
          .map(note => (
            <div
              key={note.id}
              className={`note-item ${selectedId === note.id ? "active" : ""}`}
              onClick={() => editNote(note)}
            >
              {note.title || "Untitled"}
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
              >
                Delete
              </button>
            </div>
          ))}
      </div>

      {/* Editor */}
      <div className="editor">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          rows="20"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <p className="status">{saving ? "Saving..." : "Saved"}</p>
      </div>

      {/* Preview */}
      <div className="preview">
        <h3>Preview</h3>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>

    </div>
  );
}

export default App;