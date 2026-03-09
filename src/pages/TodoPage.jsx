import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { todoAPI } from '../services/api';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';

function TodoPage() {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load todos on mount
  useEffect(() => {
    loadTodos();
  }, []);

  const sortTodos = (todoList) => {
  return [...todoList].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return b.id - a.id;
  });
};

  const loadTodos = async () => {
    try {
      setLoading(true);
      const response = await todoAPI.getAll();
      setTodos(sortTodos(response.data));
      setError('');
    } catch (err) {
      setError('Failed to load todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (newTodo) => {
    try {
      const response = await todoAPI.create(newTodo);
      setTodos(sortTodos([response.data, ...todos]));
    } catch (err) {
      setError('Failed to add todo');
      console.error(err);
    }
  };

  const handleUpdate = async (id, updatedTodo) => {
    try {
      const response = await todoAPI.update(id, updatedTodo);
      setTodos(sortTodos(todos.map((todo) => (todo.id === id ? response.data : todo))));
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;

    try {
      await todoAPI.delete(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Todos</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.username}!</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-around text-center">
            <div>
              <div className="text-3xl font-bold text-blue-500">{totalCount}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500">{completedCount}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500">
                {totalCount - completedCount}
              </div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Add Todo Form */}
        <TodoForm onAdd={handleAdd} />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading todos...</div>
          </div>
        )}

        {/* Todo List */}
        {!loading && todos.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 text-lg">No todos yet!</div>
            <div className="text-gray-500 text-sm mt-2">Add your first task above</div>
          </div>
        )}

        {!loading && todos.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Your Tasks</h2>
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoPage;