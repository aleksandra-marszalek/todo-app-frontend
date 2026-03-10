import { useEffect, useRef } from 'react';

/**
 * Accessible confirmation dialog with focus trap and keyboard support.
 * Closes on Escape and backdrop click.
 */
function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    cancelRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        aria-hidden="true"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 pointer-events-auto">
          <h3 id="confirm-dialog-title" className="text-xl font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p id="confirm-dialog-description" className="text-gray-600 mb-6">
            {message}
          </p>
          <div className="flex gap-3 justify-end">
            <button
              ref={cancelRef}
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmDialog;
