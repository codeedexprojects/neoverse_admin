import React, { useEffect, useState } from "react";
import { Plus, Calendar, AlertCircle } from "lucide-react";
import { deleteNote, getNote } from "../api";
import NoteCard from "../Components/Modas/NoteCard";
import AddNoteModal from "../Components/Modas/AddNoteModal";
import EditNoteModal from "../Components/Modas/EditNoteModal";
import DeleteConfirmationModal from "../../../Components/shared/DeleteModal";

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", description: "" });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState({
    title: "",
    description: "",
    _id: "",
  });

  const handleEditClick = (note) => {
    setEditingNote(note); // Load note data into state
    setIsEditModalOpen(true); // Open modal
  };

  const handleNoteUpdate = (updatedNote) => {
    setNotes((prev) =>
      prev.map((note) => (note._id === updatedNote._id ? updatedNote : note))
    );
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNote();
      setNotes(response.notes || []);
    } catch (err) {
      setError("Failed to load notes. Please try again.");
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = () => {
    if (newNote.title.trim() && newNote.description.trim()) {
      const note = {
        _id: Date.now().toString(),
        title: newNote.title,
        description: newNote.description,
        createdAt: new Date().toISOString(),
      };
      setNotes([note, ...notes]);
      setNewNote({ title: "", description: "" });
      setIsModalOpen(false);
    }
  };

  const handleOpenDeleteModal = (note) => {
    setNoteToDelete(note);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (noteToDelete) {
      setNotes(notes.filter((n) => n._id !== noteToDelete._id));
      setNoteToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <div className="flex-1">
              <p className="text-red-800">{error}</p>
            </div>
            <button
              onClick={fetchNotes}
              className="text-red-600 hover:text-red-800 font-medium text-sm"
            >
              Retry
            </button>
          </div>
        )}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
            <p className="text-gray-600 mt-1">{notes.length} notes total</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add Note
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={() => handleOpenDeleteModal()}
              onEdit={() => handleEditClick(note)}
            />
          ))}
        </div>
        {notes.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Calendar size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No notes yet
            </h3>
          </div>
        )}
        <AddNoteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddNote}
          newNote={newNote}
          setNewNote={setNewNote}
        />
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName={noteToDelete?.title}
          isLoading={false}
        />
        <EditNoteModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          note={editingNote}
          onUpdate={handleNoteUpdate}
        />
      </div>
    </div>
  );
};

export default NoteList;
