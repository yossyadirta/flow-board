import type { Meta, StoryObj } from '@storybook/react';
import { ProjectStatusList } from './ProjectStatusList';
import { Board } from '@/types/board';

const meta: Meta<typeof ProjectStatusList> = {
  title: 'App/ProjectStatusList',
  component: ProjectStatusList,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProjectStatusList>;

const mockBoards: Board[] = [
  { id: 'b1', name: 'Marketing Campaign Q3', key: 'MKT', icon: 'target', createdAt: '', isFavorite: true, taskCounter: 20 },
  { id: 'b2', name: 'Website Redesign', key: 'WEB', icon: 'chart', createdAt: '', isFavorite: false, taskCounter: 24 },
  { id: 'b3', name: 'Mobile App Launch', key: 'APP', icon: 'rocket', createdAt: '', isFavorite: false, taskCounter: 16 },
];

const mockMetrics: Record<string, { progress: number; done: number; remaining: number }> = {
  b1: { progress: 75, done: 15, remaining: 5 },
  b2: { progress: 100, done: 24, remaining: 0 },
  b3: { progress: 12, done: 2, remaining: 14 },
};

export const Default: Story = {
  args: {
    boards: mockBoards,
    getBoardMetrics: (id: string) => mockMetrics[id] || { progress: 0, done: 0, remaining: 0 },
  },
};

export const Empty: Story = {
  args: {
    boards: [],
    getBoardMetrics: () => ({ progress: 0, done: 0, remaining: 0 }),
  },
};
