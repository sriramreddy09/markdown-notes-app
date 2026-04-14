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

  // ✅ Fetch notes
  const fetchNotes = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/notes`);
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes", err);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // ✅ Auto-save (debounced)
  const autoSaveNote = useCallback(async () => {
    if (!title && !content) return;

    try {
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
    } catch (err) {
      console.error("Auto-save error", err);
    }
  }, [title, content, selectedId, fetchNotes]);

  // ⏱️ Debounce auto-save
  useEffect(() => {
    if (!title && !content) return;

    const timer = setTimeout(() => {
      autoSaveNote();
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, content, autoSaveNote]);

  // ✅ Manual save
  const saveNote = async () => {
    if (!title || !content) return;

    try {
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
    } catch (err) {
      console.error("Save error", err);
    }
  };

  // ✅ Delete note
  const deleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      await axios.delete(`${API_URL}/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  // ✅ Edit note
  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setSelectedId(note.id);
  };

  return (
    <div className="container">

      {/* Sidebar */}
      <div className="sidebar">

        {/* Search */}
        <input
          className="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <h3>Notes</h3>

        {notes
          .filter(note =>
            note.title.toLowerCase().includes(search.toLowerCase()) ||
            note.content.toLowerCase().includes(search.toLowerCase())
          )
          .map(note => (
            <div key={note.id} className="note-item">
              <p onClick={() => editNote(note)}>{note.title}</p>
              <button
                className="delete-btn"
                onClick={() => deleteNote(note.id)}
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

        <button className="save-btn" onClick={saveNote}>
          Save
        </button>
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