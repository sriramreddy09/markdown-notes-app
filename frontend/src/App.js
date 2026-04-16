import React, { useEffect, useState } from 'react';
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

  const fetchNotes = async () => {
    const res = await axios.get(`${API_URL}/notes`);
    setNotes(res.data.reverse());
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const saveNote = async () => {
    if (!title.trim()) return;

    if (selectedId) {
      await axios.put(`${API_URL}/notes/${selectedId}`, { title, content });
    } else {
      await axios.post(`${API_URL}/notes`, { title, content });
    }

    setTitle('');
    setContent('');
    setSelectedId(null);
    fetchNotes();
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    await axios.delete(`${API_URL}/notes/${id}`);

    if (selectedId === id) {
      setTitle('');
      setContent('');
      setSelectedId(null);
    }

    fetchNotes();
  };

  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setSelectedId(note.id);
  };

  const newNote = () => {
    setTitle('');
    setContent('');
    setSelectedId(null);
  };

  return (
    <div className="container">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>📝 Notes</h2>

        <button className="new-btn" onClick={newNote}>
          + New Note
        </button>

        <input
          className="search"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="notes-list">
          {notes
            .filter(note =>
              note.title.toLowerCase().includes(search.toLowerCase()) ||
              note.content.toLowerCase().includes(search.toLowerCase())
            )
            .map(note => (
              <div
                key={note.id}
                className={`note-card ${selectedId === note.id ? "active" : ""}`}
                onClick={() => editNote(note)}
              >
                <h4>{note.title || "Untitled"}</h4>
                <p>{note.content.substring(0, 60)}...</p>

                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Editor */}
      <div className="editor">
        <input
          className="title-input"
          placeholder="Enter title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="content-input"
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button className="save-btn" onClick={saveNote}>
          {selectedId ? "Update Note" : "Save Note"}
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