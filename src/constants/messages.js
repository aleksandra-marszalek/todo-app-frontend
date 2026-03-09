export const TOAST_MESSAGES = {
  // Authentication messages
  SESSION_EXPIRED: {
    message: 'Your session has expired. Please log in again.',
    options: {
      duration: 4000,
      icon: '🔒',
    },
  },
  
  LOGIN_SUCCESS: {
    message: 'Welcome back!',
    options: {
      duration: 2500,
      icon: '👋',
    },
  },
  
  REGISTER_SUCCESS: {
    message: 'Account created!',
    options: {
      duration: 2500,
      icon: '🎉',
    },
  },
  
  // Todo operation messages
  TODO_ADDED: {
    message: 'Todo added!',
    options: {
      duration: 2500,
      icon: '✅',
    },
  },
  
  TODO_UPDATED: {
    message: 'Todo updated!',
    options: {
      duration: 2500,
    },
  },
  
  TODO_DELETED: {
    message: 'Todo deleted!',
    options: {
      duration: 2500,
    },
  },
  
  TODO_COMPLETED: {
    message: 'Completed!',
    options: {
      duration: 2000,
      icon: '🎉',
    },
  },
  
  TODO_INCOMPLETE: {
    message: 'Marked incomplete',
    options: {
      duration: 2000,
    },
  },
  
  // Error messages
  TODO_ADD_ERROR: {
    message: 'Failed to add todo',
    options: {
      duration: 4000,
    },
  },
  
  TODO_UPDATE_ERROR: {
    message: 'Failed to update todo',
    options: {
      duration: 4000,
    },
  },
  
  TODO_DELETE_ERROR: {
    message: 'Failed to delete todo',
    options: {
      duration: 4000,
    },
  },
  
  TODO_LOAD_ERROR: {
    message: 'Failed to load todos',
    options: {
      duration: 4000,
    },
  },
};