import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { todoAPI } from '../services/api';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import TodoSkeleton from '../components/TodoSkeleton';  // ← Import skeleton
import toast from 'react-hot-toast';
import { TOAST_MESSAGES } from '../constants/messages';

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();

  // Sort function
  const sortTodos = (todoList) => {
    return [...todoList].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return b.id - a.id;
    });
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const response = await todoAPI.getAll();
      setTodos(sortTodos(response.data));
      setError('');
    } catch (err) {
      setError(TOAST_MESSAGES.TODO_LOAD_ERROR.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (newTodo) => {
    try {
      const response = await todoAPI.create(newTodo);
      setTodos(sortTodos([...todos, response.data]));
      
      toast.success(
        TOAST_MESSAGES.TODO_ADDED.message,
        TOAST_MESSAGES.TODO_ADDED.options
      );
    } catch (err) {
      toast.error(
        TOAST_MESSAGES.TODO_ADD_ERROR.message,
        TOAST_MESSAGES.TODO_ADD_ERROR.options
      );
    }
  };

  const handleUpdate = async (id, updatedTodo) => {
    try {
      const response = await todoAPI.update(id, updatedTodo);
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? response.data : todo
      );
      setTodos(sortTodos(updatedTodos));
      
      toast.success(
        TOAST_MESSAGES.TODO_UPDATED.message,
        TOAST_MESSAGES.TODO_UPDATED.options
      );
    } catch (err) {
      toast.error(
        TOAST_MESSAGES.TODO_UPDATE_ERROR.message,
        TOAST_MESSAGES.TODO_UPDATE_ERROR.options
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await todoAPI.delete(id);
      setTodos(todos.filter((todo) => todo.id !== id));
      
      toast.success(
        TOAST_MESSAGES.TODO_DELETED.message,
        TOAST_MESSAGES.TODO_DELETED.options
      );
    } catch (err) {
      toast.error(
        TOAST_MESSAGES.TODO_DELETE_ERROR.message,
        TOAST_MESSAGES.TODO_DELETE_ERROR.options
      );
    }
  };

  const handleToggle = async (id) => {
    const todo = todos.find((t) => t.id === id);
    try {
      const response = await todoAPI.update(id, {
        ...todo,
        completed: !todo.completed,
      });
      const updatedTodos = todos.map((t) =>
        t.id === id ? response.data : t
      );
      setTodos(sortTodos(updatedTodos));
      
      if (!todo.completed) {
        toast.success(
          TOAST_MESSAGES.TODO_COMPLETED.message,
          TOAST_MESSAGES.TODO_COMPLETED.options
        );
      } else {
        toast.success(
          TOAST_MESSAGES.TODO_INCOMPLETE.message,
          TOAST_MESSAGES.TODO_INCOMPLETE.options
        );
      }
    } catch (err) {
      toast.error(
        TOAST_MESSAGES.TODO_UPDATE_ERROR.message,
        TOAST_MESSAGES.TODO_UPDATE_ERROR.options
      );
    }
  };

  // Stats calculation
  const totalTodos = todos.length;
  const completedTodos = todos.filter((t) => t.completed).length;
  const remainingTodos = totalTodos - completedTodos;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Todos</h1>
            <p className="text-gray-600">Welcome back, {user?.username}!</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl font-bold text-blue-500">{totalTodos}</div>
            <div className="text-gray-600 mt-2">Total Tasks</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl font-bold text-green-500">{completedTodos}</div>
            <div className="text-gray-600 mt-2">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl font-bold text-orange-500">{remainingTodos}</div>
            <div className="text-gray-600 mt-2">Remaining</div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Add Todo Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Todo</h2>
          <TodoForm onAdd={handleAdd} />
        </div>

        {/* Todo List with Skeleton Loading */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {loading ? (
            // Skeleton screens while loading
            <div>
              <TodoSkeleton />
              <TodoSkeleton />
              <TodoSkeleton />
            </div>
          ) : todos.length === 0 ? (
            // Empty state
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">No todos yet!</p>
              <p className="text-gray-400">Add your first task above</p>
            </div>
          ) : (
            // Actual todos
            <div>
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoPage;