import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [notes, setNotes] = useState(() => {
    // Load notes from localStorage on initial render
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editText, setEditText] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'alphabetical'
  const [searchQuery, setSearchQuery] = useState(''); // New state for search

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (newNote.trim() === '') return;
    
    setNotes([...notes, {
      id: Date.now(),
      text: newNote,
      createdAt: new Date().toLocaleString()
    }]);
    setNewNote('');
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleEditNote = (note) => {
    setEditingNote(note.id);
    setEditText(note.text);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editText.trim() === '') return;

    setNotes(notes.map(note => 
      note.id === editingNote 
        ? { ...note, text: editText, createdAt: new Date().toLocaleString() }
        : note
    ));
    setEditingNote(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditText('');
  };

  const getSortedNotes = () => {
    const sortedNotes = [...notes];
    switch (sortBy) {
      case 'newest':
        return sortedNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return sortedNotes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'alphabetical':
        return sortedNotes.sort((a, b) => a.text.localeCompare(b.text));
      default:
        return sortedNotes;
    }
  };

  // Filter notes based on search query
  const getFilteredNotes = () => {
    const sortedNotes = getSortedNotes();
    if (!searchQuery.trim()) return sortedNotes;
    
    return sortedNotes.filter(note => 
      note.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Mis Notas Semestrales</h1>
        
        <div className="space-y-4 mb-8">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar notas..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Escribe una nueva nota..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Agregar
            </button>
          </form>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguas</option>
            <option value="alphabetical">Alfabético</option>
          </select>
        </div>

        <div className="space-y-4">
          {getFilteredNotes().map(note => (
            <div
              key={note.id}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              {editingNote === note.id ? (
                <form onSubmit={handleSaveEdit} className="space-y-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-800">{note.text}</p>
                    <p className="text-sm text-gray-500 mt-1">{note.createdAt}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {getFilteredNotes().length === 0 && (
            <p className="text-center text-gray-500">
              {searchQuery ? 'No se encontraron notas que coincidan con la búsqueda.' : 'No hay notas. ¡Agrega una!'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
