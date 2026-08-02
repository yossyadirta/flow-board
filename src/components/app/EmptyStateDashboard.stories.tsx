import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyStateDashboard';

const meta: Meta<typeof EmptyState> = {
  title: 'App/EmptyStateDashboard',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    setIsOpenAddBoardModal: () => console.log('Open Add Board Modal'),
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    userName: 'Alex',
  },
};

export const GuestUser: Story = {
  args: {
    userName: null,
  },
};
