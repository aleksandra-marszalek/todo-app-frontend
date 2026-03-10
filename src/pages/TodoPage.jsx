import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/useAuth';
import { todoAPI } from '../services/api';
import { showSuccess, showError } from '../utils/toast';
import { TOAST_MESSAGES } from '../constants/messages';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import TodoSkeleton from '../components/TodoSkeleton';
import ConfirmDialog from '../components/ConfirmDialog';

const INITIAL_CONFIRM_STATE = { isOpen: false, todoId: null };

const sortTodos = (todoList) =>
  [...todoList].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return b.id - a.id;
  });

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(INITIAL_CONFIRM_STATE);

  const { user, logout } = useAuth();

  const { totalTodos, completedTodos, remainingTodos } = useMemo(() => {
    const completed = todos.filter((t) => t.completed).length;
    return { totalTodos: todos.length, completedTodos: completed, remainingTodos: todos.length - completed };
  }, [todos]);

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await todoAPI.getAll();
      setTodos(sortTodos(data));
      setError('');
    } catch {
      setError(TOAST_MESSAGES.TODO_LOAD_ERROR.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleAdd = useCallback(
    async (newTodo) => {
      try {
        const { data } = await todoAPI.create(newTodo);
        setTodos((prev) => sortTodos([...prev, data]));
        setShowAddForm(false);
        showSuccess(TOAST_MESSAGES.TODO_ADDED);
      } catch {
        showError(TOAST_MESSAGES.TODO_ADD_ERROR);
      }
    },
    []
  );

  const handleUpdate = useCallback(async (id, updatedTodo) => {
    try {
      const { data } = await todoAPI.update(id, updatedTodo);
      setTodos((prev) => sortTodos(prev.map((t) => (t.id === id ? data : t))));
      showSuccess(TOAST_MESSAGES.TODO_UPDATED);
    } catch {
      showError(TOAST_MESSAGES.TODO_UPDATE_ERROR);
    }
  }, []);

  const handleToggle = useCallback(
    async (id) => {
      const todo = todos.find((t) => t.id === id);
      try {
        const { data } = await todoAPI.update(id, { ...todo, completed: !todo.completed });
        setTodos((prev) => sortTodos(prev.map((t) => (t.id === id ? data : t))));
        showSuccess(todo.completed ? TOAST_MESSAGES.TODO_INCOMPLETE : TOAST_MESSAGES.TODO_COMPLETED);
      } catch {
        showError(TOAST_MESSAGES.TODO_UPDATE_ERROR);
      }
    },
    [todos]
  );

  const handleDeleteClick = useCallback((id) => {
    setConfirmDialog({ isOpen: true, todoId: id });
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    const { todoId } = confirmDialog;
    setConfirmDialog(INITIAL_CONFIRM_STATE);

    try {
      await todoAPI.delete(todoId);
      setTodos((prev) => prev.filter((t) => t.id !== todoId));
      showSuccess(TOAST_MESSAGES.TODO_DELETED);
    } catch {
      showError(TOAST_MESSAGES.TODO_DELETE_ERROR);
    }
  }, [confirmDialog]);

  const handleDeleteCancel = useCallback(() => {
    setConfirmDialog(INITIAL_CONFIRM_STATE);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-3 sm:py-8">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-2 sm:p-6 text-center">
            <div className="text-2xl sm:text-4xl font-bold text-blue-500">{totalTodos}</div>
            <div className="text-sm sm:text-base text-gray-600 mt-0.5 sm:mt-2">Total</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-2 sm:p-6 text-center">
            <div className="text-2xl sm:text-4xl font-bold text-green-500">{completedTodos}</div>
            <div className="text-sm sm:text-base text-gray-600 mt-0.5 sm:mt-2">Done</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-2 sm:p-6 text-center">
            <div className="text-2xl sm:text-4xl font-bold text-orange-500">{remainingTodos}</div>
            <div className="text-sm sm:text-base text-gray-600 mt-0.5 sm:mt-2">Left</div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4 sm:mb-8">
          <div className="sm:hidden">
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2"
              >
                <span className="text-lg">+</span> Add New Todo
              </button>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-3">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">Add New Todo</h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-500 hover:text-gray-700 text-lg"
                  >
                    ✕
                  </button>
                </div>
                <TodoForm onAdd={handleAdd} compact />
              </div>
            )}
          </div>

          <div className="hidden sm:block bg-white rounded-lg shadow-sm p-6">
            <TodoForm onAdd={handleAdd} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
          {loading ? (
            <div>
              <TodoSkeleton />
              <TodoSkeleton />
              <TodoSkeleton />
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-6 sm:py-12">
              <p className="text-gray-500 text-base sm:text-lg mb-1">No todos yet!</p>
              <p className="text-gray-400 text-sm">Add your first task above</p>
            </div>
          ) : (
            <div>
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleUpdate}
                  onDelete={handleDeleteClick}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        title="Delete Todo"
        message="Are you sure you want to delete this todo? This action cannot be undone."
      />
    </div>
  );
}

export default TodoPage;
