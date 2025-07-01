import React from 'react';
import { Edit3, Trash2, Eye, Globe, Lock } from 'lucide-react';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-black border-2 border-cyanGlow text-magentaGlow rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="p-4 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-cyanGlow leading-snug line-clamp-2">
              {note.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-magentaGlow mt-1">
              <span className="flex items-center space-x-1">
                {note.isPublic ? <Globe size={12} /> : <Lock size={12} />}
                <span>{note.isPublic ? 'Public' : 'Private'}</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{formatDate(note.createdAt || note.updated_at)}</span>
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => onEdit(note)}
              title="Edit"
              className="p-1 text-cyanGlow hover:bg-cyanGlow hover:text-black rounded-md transition"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => onDelete(note.id)}
              title="Delete"
              className="p-1 text-magentaGlow hover:bg-magentaGlow hover:text-black rounded-md transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm text-white flex-grow mb-4">
          {truncateContent(note.content)}
        </p>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {note.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium bg-cyanGlow text-black rounded-full"
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">
                +{note.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-cyanGlow flex justify-between items-center text-xs text-magentaGlow">
          {note.updatedAt && note.updatedAt !== note.createdAt && (
            <span>Updated {formatDate(note.updatedAt)}</span>
          )}
          <button
            onClick={() => onEdit(note)}
            className="flex items-center space-x-1 hover:underline text-cyanGlow"
          >
            <Eye size={12} />
            <span>View</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
