import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { EmptyState } from './EmptyStateDashboard';

// Mock OnboardingContext because it's used inside EmptyState
vi.mock('@/context/OnboardingContext', () => ({
  useOnboardingContext: () => ({
    signalEvent: vi.fn(),
  }),
}));

describe('EmptyStateDashboard', () => {
  it('renders correctly with a username', () => {
    render(<EmptyState setIsOpenAddBoardModal={vi.fn()} userName="Alex" />);
    
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    expect(screen.getByText(/Alex/i)).toBeInTheDocument();
  });

  it('renders correctly without a username', () => {
    render(<EmptyState setIsOpenAddBoardModal={vi.fn()} userName={null} />);
    
    expect(screen.getByText(/Welcome back! 👋/i)).toBeInTheDocument();
    // Should not render undefined or null text
    expect(screen.queryByText(/null/i)).not.toBeInTheDocument();
  });

  it('calls setIsOpenAddBoardModal when New Board button is clicked', async () => {
    const user = userEvent.setup();
    const mockSetIsOpen = vi.fn();
    
    render(<EmptyState setIsOpenAddBoardModal={mockSetIsOpen} />);
    
    const newBoardButton = screen.getByRole('button', { name: /New Board/i });
    await user.click(newBoardButton);
    
    expect(mockSetIsOpen).toHaveBeenCalledTimes(1);
    expect(mockSetIsOpen).toHaveBeenCalledWith(true);
  });
});
