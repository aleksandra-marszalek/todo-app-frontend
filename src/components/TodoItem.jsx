import { useState } from 'react';

function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  const handleSave = () => {
    onUpdate(todo.id, {
      title: editTitle,
      description: editDescription,
      completed: todo.completed,
    });
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    onUpdate(todo.id, {
      ...todo,
      completed: !todo.completed,
    });
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-3">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-2 focus:ring-2 focus:ring-blue-500"
          placeholder="Title"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-3 focus:ring-2 focus:ring-blue-500"
          placeholder="Description"
          rows="2"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-3 hover:shadow-md transition">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          className="mt-1 h-5 w-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex-1">
          <h3
            className={`text-lg font-semibold ${
              todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p
              className={`text-sm mt-1 ${
                todo.completed ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {todo.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 hover:text-blue-600 px-3 py-1 rounded hover:bg-blue-50"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="text-red-500 hover:text-red-600 px-3 py-1 rounded hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoItem;