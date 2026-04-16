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

  // Fetch notes
  const fetchNotes = async () => {
    const res = await axios.get(`${API_URL}/notes`);
    setNotes(res.data.reverse());
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Save (Create or Update)
  const saveNote = async () => {
    if (!title.trim()) return;

    if (selectedId) {
      await axios.put(`${API_URL}/notes/${selectedId}`, {
        title,
        content,
      });
    } else {
      await axios.post(`${API_URL}/notes`, {
        title,
        content,
      });
    }

    // reset after save
    setTitle('');
    setContent('');
    setSelectedId(null);

    fetchNotes();
  };

  // Delete
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

  // Edit
  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setSelectedId(note.id);
  };

  // New Note
  const newNote = () => {
    setTitle('');
    setContent('');
    setSelectedId(null);
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
              <p>{note.title || "Untitled"}</p>
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