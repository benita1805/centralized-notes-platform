import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NoteCard from '../components/NoteCard';
import UploadForm from '../components/UploadForm';

const API_BASE_URL = process.env.REACT_APP_API_URL;


const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState('');

useEffect(() => {
  fetchNotes();
}, []);

  useEffect(() => {
    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredNotes(filtered);
  }, [notes, searchTerm]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const notesData = await response.json();
        setNotes(notesData.notes);
      } else {
        console.error('Failed to fetch notes:', await response.text());
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setIsPublic(false);
    setTags('');
    setIsModalOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsPublic(note.isPublic);
    setTags(note.tags?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleSubmitNote = async (e) => {
    e.preventDefault();

    const noteData = {
      title,
      content,
      isPublic,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    const url = editingNote
      ? `${API_BASE_URL}/api/notes/${editingNote._id}`
      : `${API_BASE_URL}/api/notes`;
    const method = editingNote ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchNotes();
      } else {
        console.error('Note save failed:', await response.text());
      }
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchNotes();
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleUpload = () => {
    fetchNotes();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sunset-retro flex items-center justify-center">
        <div className="text-cyanGlow font-sans text-lg animate-pulse">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sunset-retro text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-cyanGlow">📚 My Notes</h2>
            <p className="text-magentaGlow">Manage and share your notes</p>
          </div>
          <button
            onClick={handleCreateNote}
            className="bg-magentaGlow text-black px-5 py-3 rounded-lg hover:bg-cyanGlow hover:text-white transition duration-200 flex items-center space-x-2 w-fit"
          >
            <Plus size={20} />
            <span>New Note</span>
          </button>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-magentaGlow" size={20} />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-black border border-cyanGlow text-magentaGlow rounded-lg placeholder-magentaGlow focus:outline-none"
          />
        </div>

        <UploadForm onUpload={handleUpload} />

        {filteredNotes.length === 0 ? (
          <div className="text-center py-16 text-magentaGlow">
            <Edit3 size={64} className="mx-auto text-cyanGlow mb-4" />
            <h3 className="text-xl font-semibold mb-2">No notes found</h3>
            <p className="mb-6">
              {searchTerm ? 'Try a different search term' : 'You haven’t created any notes yet'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreateNote}
                className="bg-magentaGlow text-black px-6 py-3 rounded-lg hover:bg-cyanGlow hover:text-white transition inline-flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Create Note</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={handleEditNote}
                onDelete={() => handleDeleteNote(note._id)}
              />
            ))}
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-black border-4 border-cyanGlow rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-2xl text-magentaGlow font-semibold mb-6">
              {editingNote ? 'Edit Note' : 'Create New Note'}
            </h3>
            <form onSubmit={handleSubmitNote} className="space-y-6">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-magentaGlow text-cyanGlow rounded-lg placeholder-magentaGlow focus:outline-none"
                placeholder="Enter note title"
                required
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="6"
                className="w-full px-4 py-3 bg-black border border-magentaGlow text-cyanGlow rounded-lg placeholder-magentaGlow focus:outline-none resize-none"
                placeholder="Write your note content here..."
                required
              />
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-magentaGlow text-cyanGlow rounded-lg placeholder-magentaGlow focus:outline-none"
                placeholder="e.g., work, personal, ideas"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 text-magentaGlow border-cyanGlow bg-black rounded"
                />
                <label htmlFor="isPublic" className="ml-2 text-sm text-cyanGlow">
                  Make this note public
                </label>
              </div>
              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-cyanGlow text-cyanGlow rounded-lg hover:bg-cyanGlow hover:text-black transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-magentaGlow text-black rounded-lg hover:bg-cyanGlow hover:text-white transition"
                >
                  {editingNote ? 'Update Note' : 'Create Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
