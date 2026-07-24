import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import BoardHeader from './BoardHeader';
import { Board } from '@/types/board';

const mockBoard: Board = {
  id: 'board-123',
  name: 'Product Launch 2026',
  key: 'PLN',
  icon: 'rocket',
  createdAt: Date.now(),
  isFavorite: false,
  taskCounter: 0,
};

describe('BoardHeader', () => {
  it('renders board name and emoji', () => {
    render(
      <BoardHeader
        derived={{ emoji: '🚀', currentBoard: mockBoard }}
        mounted={true}
        modalState={{ type: null }}
        setModalState={vi.fn()}
        closeModal={vi.fn()}
        onToggleFavorite={vi.fn()}
        isFavorite={false}
      />
    );

    expect(screen.getByText('Product Launch 2026')).toBeInTheDocument();
    expect(screen.getByText('🚀')).toBeInTheDocument();
  });

  it('calls onToggleFavorite when star button is clicked', async () => {
    const user = userEvent.setup();
    const handleToggleFavorite = vi.fn();

    const { container } = render(
      <BoardHeader
        derived={{ emoji: '🚀', currentBoard: mockBoard }}
        mounted={true}
        modalState={{ type: null }}
        setModalState={vi.fn()}
        closeModal={vi.fn()}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={false}
      />
    );

    // Find the button (it contains the Star icon, usually the first button before the dropdown)
    const buttons = container.querySelectorAll('button');
    const starButton = buttons[0]; // Assuming it's the first button

    await user.click(starButton);

    expect(handleToggleFavorite).toHaveBeenCalledTimes(1);
    expect(handleToggleFavorite).toHaveBeenCalledWith('board-123');
  });
});
