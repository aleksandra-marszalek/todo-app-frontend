import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import toast from 'react-hot-toast';
import { showSuccess, showError } from './toast';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('showSuccess', () => {
  it('delegates to toast.success with message and options', () => {
    showSuccess({ message: 'Done!', options: { duration: 2000 } });
    expect(toast.success).toHaveBeenCalledWith('Done!', { duration: 2000 });
  });

  it('works without options', () => {
    showSuccess({ message: 'Done!' });
    expect(toast.success).toHaveBeenCalledWith('Done!', undefined);
  });
});

describe('showError', () => {
  it('delegates to toast.error with message and options', () => {
    showError({ message: 'Failed!', options: { duration: 4000 } });
    expect(toast.error).toHaveBeenCalledWith('Failed!', { duration: 4000 });
  });

  it('works without options', () => {
    showError({ message: 'Failed!' });
    expect(toast.error).toHaveBeenCalledWith('Failed!', undefined);
  });
});
