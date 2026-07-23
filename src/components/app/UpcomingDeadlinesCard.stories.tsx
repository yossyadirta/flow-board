import type { Meta, StoryObj } from '@storybook/react';
import { UpcomingDeadlinesCard } from './UpcomingDeadlinesCard';
import { Task } from '@/types/task';
import { Board } from '@/types/board';

const meta: Meta<typeof UpcomingDeadlinesCard> = {
  title: 'App/UpcomingDeadlinesCard',
  component: UpcomingDeadlinesCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UpcomingDeadlinesCard>;

const mockBoards: Board[] = [
  { id: 'b1', name: 'Frontend', key: 'FE', icon: 'gear', createdAt: '', isFavorite: true, taskCounter: 14 },
  { id: 'b2', name: 'Backend', key: 'BE', icon: 'briefcase', createdAt: '', isFavorite: false, taskCounter: 8 },
];

const mockTasks: Task[] = [
  {
    id: '1',
    boardId: 'b1',
    title: 'Release v1.0 to App Store',
    description: '',
    status: 'done',
    order: 0,
    key: 'FE-14',
    dueDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    boardId: 'b2',
    title: 'Database Migration',
    description: '',
    status: 'todo',
    order: 1,
    key: 'BE-8',
    dueDate: new Date(Date.now() + 172800000).toISOString(), // in 2 days
    createdAt: '',
    updatedAt: '',
  },
];

export const Default: Story = {
  args: {
    hasUpcomingTasks: true,
    upcomingTasks: mockTasks,
    boards: mockBoards,
    getBoardName: (id: string) => mockBoards.find(b => b.id === id)?.name || 'Unknown Board',
  },
};

export const Empty: Story = {
  args: {
    hasUpcomingTasks: false,
    upcomingTasks: [],
    boards: mockBoards,
    getBoardName: () => '',
  },
};
