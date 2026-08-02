import type { Meta, StoryObj } from '@storybook/react';
import { BoardCard } from './BoardCard';
import { Board } from '@/types/board';

const meta: Meta<typeof BoardCard> = {
  title: 'App/BoardCard',
  component: BoardCard,
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  }
};

export default meta;
type Story = StoryObj<typeof BoardCard>;

const mockBoard: Board = {
  id: 'board-1',
  name: 'Product Roadmap',
  key: 'PRD',
  icon: 'rocket',
  createdAt: new Date().toISOString(),
  isFavorite: false,
  taskCounter: 22,
};

export const Default: Story = {
  args: {
    board: mockBoard,
    metrics: { progress: 45, done: 10, remaining: 12 },
    variant: 'default',
  },
};

export const Favorite: Story = {
  args: {
    board: { ...mockBoard, icon: 'brain' },
    metrics: { progress: 80, done: 24, remaining: 6 },
    variant: 'favorite',
  },
};

export const Completed: Story = {
  args: {
    board: { ...mockBoard, name: 'Q1 Planning', icon: 'briefcase' },
    metrics: { progress: 100, done: 15, remaining: 0 },
    variant: 'favorite',
  },
};
