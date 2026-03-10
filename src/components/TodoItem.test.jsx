import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoItem from './TodoItem';

const baseTodo = { id: 1, title: 'Test todo', description: 'A description', completed: false };

describe('TodoItem', () => {
  it('renders title and description', () => {
    render(<TodoItem todo={baseTodo} onUpdate={vi.fn()} onDelete={vi.fn()} onToggle={vi.fn()} />);
    expect(screen.getByText('Test todo')).toBeInTheDocument();
    expect(screen.getByText('A description')).toBeInTheDocument();
  });

  it('applies strikethrough style when completed', () => {
    const completed = { ...baseTodo, completed: true };
    render(<TodoItem todo={completed} onUpdate={vi.fn()} onDelete={vi.fn()} onToggle={vi.fn()} />);
    expect(screen.getByText('Test todo')).toHaveClass('line-through');
  });

  it('calls onToggle with the todo id when checkbox is clicked', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(<TodoItem todo={baseTodo} onUpdate={vi.fn()} onDelete={vi.fn()} onToggle={onToggle} />);

    await user.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it('calls onDelete with the todo id when Delete is clicked', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<TodoItem todo={baseTodo} onUpdate={vi.fn()} onDelete={onDelete} onToggle={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('switches to edit mode when Edit is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={baseTodo} onUpdate={vi.fn()} onDelete={vi.fn()} onToggle={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /edit/i }));
    expect(screen.getByDisplayValue('Test todo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('calls onUpdate with updated data when Save is clicked', async () => {
    const onUpdate = vi.fn();
    const user = userEvent.setup();
    render(<TodoItem todo={baseTodo} onUpdate={onUpdate} onDelete={vi.fn()} onToggle={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /edit/i }));
    const titleInput = screen.getByDisplayValue('Test todo');
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated todo');
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(onUpdate).toHaveBeenCalledWith(1, {
      title: 'Updated todo',
      description: 'A description',
      completed: false,
    });
  });

  it('cancels edit mode without calling onUpdate', async () => {
    const onUpdate = vi.fn();
    const user = userEvent.setup();
    render(<TodoItem todo={baseTodo} onUpdate={onUpdate} onDelete={vi.fn()} onToggle={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /edit/i }));
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onUpdate).not.toHaveBeenCalled();
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('does not render description element when description is absent', () => {
    const noDesc = { ...baseTodo, description: '' };
    render(<TodoItem todo={noDesc} onUpdate={vi.fn()} onDelete={vi.fn()} onToggle={vi.fn()} />);
    expect(screen.queryByText('A description')).not.toBeInTheDocument();
  });

});
