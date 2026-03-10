import { useState, useCallback } from 'react';

function TodoItem({ todo, onUpdate, onDelete, onToggle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description ?? '');

  const handleSave = useCallback(() => {
    onUpdate(todo.id, {
      title: editTitle,
      description: editDescription,
      completed: todo.completed,
    });
    setIsEditing(false);
  }, [todo.id, todo.completed, editTitle, editDescription, onUpdate]);

  const handleCancel = useCallback(() => setIsEditing(false), []);
  const handleEdit = useCallback(() => setIsEditing(true), []);
  const handleDelete = useCallback(() => onDelete(todo.id), [todo.id, onDelete]);
  const handleToggle = useCallback(() => onToggle(todo.id), [todo.id, onToggle]);

  if (isEditing) {
    return (
      <div className="border-b last:border-0 py-3">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-2 focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Title"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-2 focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Description"
          rows="2"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 text-sm"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-3 py-1.5 rounded hover:bg-gray-600 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b last:border-0 py-3 hover:bg-gray-50 transition">
      <div className="flex items-start gap-2 sm:gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex-1 min-w-0">
          <h3
            className={`text-base sm:text-lg font-semibold ${
              todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p
              className={`text-sm sm:text-base mt-0.5 ${
                todo.completed ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {todo.description}
            </p>
          )}
        </div>
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={handleEdit}
            className="text-blue-500 hover:text-blue-600 px-2 py-1 rounded hover:bg-blue-50 text-sm sm:text-base"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 text-sm sm:text-base"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoItem;
