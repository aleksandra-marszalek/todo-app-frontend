import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from './TodoForm';

describe('TodoForm', () => {
  it('renders the title input and submit button', () => {
    render(<TodoForm onAdd={vi.fn()} />);
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
  });

  it('shows the heading when not compact', () => {
    render(<TodoForm onAdd={vi.fn()} compact={false} />);
    expect(screen.getByText('Add New Todo')).toBeInTheDocument();
  });

  it('hides the heading when compact', () => {
    render(<TodoForm onAdd={vi.fn()} compact />);
    expect(screen.queryByText('Add New Todo')).not.toBeInTheDocument();
  });

  it('calls onAdd with trimmed title and description on submit', async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(<TodoForm onAdd={onAdd} />);

    await user.type(screen.getByPlaceholderText('What needs to be done?'), '  Buy milk  ');
    await user.type(screen.getByPlaceholderText('Description (optional)'), '  2%  ');
    await user.click(screen.getByRole('button', { name: /add todo/i }));

    expect(onAdd).toHaveBeenCalledOnce();
    expect(onAdd).toHaveBeenCalledWith({
      title: 'Buy milk',
      description: '2%',
      completed: false,
    });
  });

  it('does not call onAdd when title is blank', async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(<TodoForm onAdd={onAdd} />);

    await user.type(screen.getByPlaceholderText('What needs to be done?'), '   ');
    await user.click(screen.getByRole('button', { name: /add todo/i }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it('resets fields after a successful submit', async () => {
    const user = userEvent.setup();
    render(<TodoForm onAdd={vi.fn()} />);

    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    await user.type(titleInput, 'Walk the dog');
    await user.click(screen.getByRole('button', { name: /add todo/i }));

    expect(titleInput).toHaveValue('');
  });
});
