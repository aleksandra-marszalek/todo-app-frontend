import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { todoAPI } from '../services/api';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import TodoSkeleton from '../components/TodoSkeleton';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';
import { TOAST_MESSAGES } from '../constants/messages';

function TodoPage() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false); // For collapsible form on mobile
    const { user, logout } = useAuth();

    // Confirmation dialog state
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        todoId: null,
    });

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
            setShowAddForm(false); // Close form on mobile after adding

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

    // Show confirmation dialog
    const handleDeleteClick = (id) => {
        setConfirmDialog({
            isOpen: true,
            todoId: id,
        });
    };

    // User confirmed deletion
    const handleDeleteConfirm = async () => {
        const { todoId } = confirmDialog;

        // Close dialog first
        setConfirmDialog({ isOpen: false, todoId: null });

        // Perform delete
        try {
            await todoAPI.delete(todoId);
            setTodos(todos.filter((todo) => todo.id !== todoId));

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

    // User cancelled deletion
    const handleDeleteCancel = () => {
        setConfirmDialog({ isOpen: false, todoId: null });
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

    const totalTodos = todos.length;
    const completedTodos = todos.filter((t) => t.completed).length;
    const remainingTodos = totalTodos - completedTodos;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - LEFT aligned on ALL screen sizes */}
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
                {/* Stats - COMPACT on mobile */}
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

                {/* Error */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Add Todo Form - COLLAPSIBLE on mobile, ALWAYS VISIBLE on desktop */}
                <div className="mb-4 sm:mb-8">
                    {/* Mobile: Collapsible */}
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
                                <TodoForm onAdd={handleAdd} compact={true} />
                            </div>
                        )}
                    </div>

                    {/* Desktop: Always visible */}
                    <div className="hidden sm:block bg-white rounded-lg shadow-sm p-6">
                        <TodoForm onAdd={handleAdd} compact={false} />
                    </div>
                </div>

                {/* Todo List - COMPACT padding */}
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

            {/* Confirmation Dialog */}
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
