import { Edit, Trash2 } from 'lucide-react';

const NoteCard = ({ note, onDelete, onEdit }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {note.title}
        </h3>
        <div className="flex gap-2 ml-2">
          <button onClick={() => onEdit(note)} className="text-gray-400 hover:text-blue-600 transition-colors">
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(note._id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {note.description}
      </p>
    </div>
  );
};

export default NoteCard;
