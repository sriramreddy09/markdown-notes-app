import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  

  // Fetch notes
  const fetchNotes = useCallback(async () => {
    const res = await axios.get('http://127.0.0.1:5000/notes');
    setNotes(res.data);
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // ✅ Auto-save (FIXED)
  const autoSaveNote = useCallback(async () => {
    if (!title && !content) return;

    if (selectedId) {
      await axios.put(`http://127.0.0.1:5000/notes/${selectedId}`, {
        title,
        content,
      });
    } else {
      const res = await axios.post('http://127.0.0.1:5000/notes', {
        title,
        content,
      });

      setSelectedId(res.data.id); // important fix
    }

    fetchNotes();
  }, [title, content, selectedId, fetchNotes]);

  // ⏱️ Auto-save trigger (debounced style)
  useEffect(() => {
    if (!title && !content) return;

    const timer = setTimeout(() => {
      autoSaveNote();
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, content, autoSaveNote]);

  // Manual save (button)
  const saveNote = async () => {
    if (!title || !content) return;

    if (selectedId) {
      await axios.put(`http://127.0.0.1:5000/notes/${selectedId}`, {
        title,
        content,
      });
    } else {
      const res = await axios.post('http://127.0.0.1:5000/notes', {
        title,
        content,
      });

      setSelectedId(res.data.id);
    }

    fetchNotes();
  };

  // Delete note
  const deleteNote = async (id) => {
    await axios.delete(`http://127.0.0.1:5000/notes/${id}`);
    fetchNotes();
  };

  // Edit note
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
            note.title.toLowerCase().includes(search.toLowerCase())
          )
          .map(note => (
            <div key={note.id} className="note-item">
              <p onClick={() => editNote(note)}>{note.title}</p>
              <button className="delete-btn" onClick={() => deleteNote(note.id)}>
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