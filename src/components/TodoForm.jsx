import { useState, useCallback } from 'react';

function TodoForm({ onAdd, compact = false }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!title.trim()) return;

      onAdd({ title: title.trim(), description: description.trim(), completed: false });
      setTitle('');
      setDescription('');
    },
    [title, description, onAdd]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {!compact && (
        <h2 className="text-xl font-semibold text-gray-800">Add New Todo</h2>
      )}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder:text-sm sm:placeholder:text-base"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm placeholder:text-sm sm:placeholder:text-base"
        rows="2"
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition text-sm sm:text-base"
      >
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
