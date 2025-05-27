import { useState } from 'react';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

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

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Mis Notas Semestrales</h1>
        
        <form onSubmit={handleAddNote} className="mb-8">
          <div className="flex gap-2">
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
          </div>
        </form>

        <div className="space-y-4">
          {notes.map(note => (
            <div
              key={note.id}
              className="bg-white p-4 rounded-lg shadow-md flex justify-between items-start"
            >
              <div>
                <p className="text-gray-800">{note.text}</p>
                <p className="text-sm text-gray-500 mt-1">{note.createdAt}</p>
              </div>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </div>
          ))}
          {notes.length === 0 && (
            <p className="text-center text-gray-500">No hay notas. ¡Agrega una!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
