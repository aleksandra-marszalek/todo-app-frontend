export const TOAST_MESSAGES = {
  SESSION_EXPIRED: {
    message: 'Your session has expired. Please log in again.',
    options: { duration: 4000, icon: '🔒' },
  },
  LOGIN_SUCCESS: {
    message: 'Welcome back!',
    options: { duration: 2500, icon: '👋' },
  },
  REGISTER_SUCCESS: {
    message: 'Account created!',
    options: { duration: 2500, icon: '🎉' },
  },
  TODO_ADDED: {
    message: 'Todo added!',
    options: { duration: 2500, icon: '✅' },
  },
  TODO_UPDATED: {
    message: 'Todo updated!',
    options: { duration: 2500 },
  },
  TODO_DELETED: {
    message: 'Todo deleted!',
    options: { duration: 2500 },
  },
  TODO_COMPLETED: {
    message: 'Completed!',
    options: { duration: 2000, icon: '🎉' },
  },
  TODO_INCOMPLETE: {
    message: 'Marked incomplete',
    options: { duration: 2000 },
  },
  TODO_ADD_ERROR: {
    message: 'Failed to add todo',
    options: { duration: 4000 },
  },
  TODO_UPDATE_ERROR: {
    message: 'Failed to update todo',
    options: { duration: 4000 },
  },
  TODO_DELETE_ERROR: {
    message: 'Failed to delete todo',
    options: { duration: 4000 },
  },
  TODO_LOAD_ERROR: {
    message: 'Failed to load todos',
    options: { duration: 4000 },
  },
};

export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid username or password',
  LOGIN_FAILED: 'Login failed. Please check your connection.',
  USERNAME_OR_EMAIL_TAKEN: 'Username or email already taken',
  INVALID_REGISTRATION: 'Invalid registration data',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
};
