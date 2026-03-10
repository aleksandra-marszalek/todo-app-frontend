import toast from 'react-hot-toast';

/**
 * Shows a success toast using a pre-defined message configuration.
 * @param {{ message: string, options?: import('react-hot-toast').ToastOptions }} msgConfig
 */
export const showSuccess = ({ message, options }) => toast.success(message, options);

/**
 * Shows an error toast using a pre-defined message configuration.
 * @param {{ message: string, options?: import('react-hot-toast').ToastOptions }} msgConfig
 */
export const showError = ({ message, options }) => toast.error(message, options);
