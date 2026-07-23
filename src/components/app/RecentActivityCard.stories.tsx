import type { Meta, StoryObj } from '@storybook/react';
import { RecentActivitiesCard } from './RecentActivityCard';
import { Task } from '@/types/task';

const meta: Meta<typeof RecentActivitiesCard> = {
  title: 'App/RecentActivitiesCard',
  component: RecentActivitiesCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RecentActivitiesCard>;

const mockTasks: Task[] = [
  {
    id: '1',
    boardId: 'b1',
    title: 'Design new landing page',
    description: '',
    status: 'done',
    order: 0,
    key: 'T-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    boardId: 'b1',
    title: 'Implement authentication flow',
    description: '',
    status: 'todo',
    order: 1,
    key: 'T-2',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    boardId: 'b2',
    title: 'Fix responsive issues on mobile',
    description: '',
    status: 'in-progress',
    order: 0,
    key: 'T-3',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const Default: Story = {
  args: {
    recentTasks: mockTasks,
  },
};

export const Empty: Story = {
  args: {
    recentTasks: [],
  },
};
