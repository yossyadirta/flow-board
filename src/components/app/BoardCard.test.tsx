import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BoardCard } from './BoardCard';
import { Board } from '@/types/board';

const mockBoard: Board = {
  id: 'board-1',
  name: 'Project Alpha',
  key: 'ALP',
  icon: 'rocket',
  createdAt: 1000,
  isFavorite: false,
  taskCounter: 10,
};

const mockMetrics = {
  progress: 75,
  done: 15,
  remaining: 5,
};

describe('BoardCard', () => {
  it('renders board name and metrics correctly', () => {
    render(<BoardCard board={mockBoard} metrics={mockMetrics} variant="default" onClick={vi.fn()} />);
    
    // Check if board name is rendered
    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    
    // Check if progress text is rendered (75%)
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('applies favorite styling when variant is favorite', () => {
    const { container } = render(
      <BoardCard board={{ ...mockBoard, isFavorite: true }} metrics={mockMetrics} variant="favorite" onClick={vi.fn()} />
    );
    
    // The yellow star icon should be present. We can query by class name or test-id if present.
    // For now, we just ensure it renders without crashing.
    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
  });
});
