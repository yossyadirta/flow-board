import type { Meta, StoryObj } from '@storybook/react';
import BoardHeader from './BoardHeader';
import { Board } from '@/types/board';

const meta: Meta<typeof BoardHeader> = {
  title: 'App/BoardHeader',
  component: BoardHeader,
  tags: ['autodocs'],
  args: {
    setModalState: () => { },
    closeModal: () => { },
    onToggleFavorite: () => { },
  },
};

export default meta;
type Story = StoryObj<typeof BoardHeader>;

const mockBoard: Board = {
  id: 'board-123',
  name: 'Product Launch 2026',
  key: 'PLN',
  icon: 'rocket',
  createdAt: Date.now(),
  isFavorite: false,
  taskCounter: 0,
};

export const Default: Story = {
  args: {
    derived: {
      emoji: '🚀',
      currentBoard: mockBoard,
    },
    mounted: true,
    modalState: { type: 'option-board' },
    isFavorite: false,
  },
};

export const Favorited: Story = {
  args: {
    derived: {
      emoji: '⭐',
      currentBoard: { ...mockBoard, name: 'VIP Client Project' },
    },
    mounted: true,
    modalState: { type: 'delete-board' },
    isFavorite: true,
  },
};
