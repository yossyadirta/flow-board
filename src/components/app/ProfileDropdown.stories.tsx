import type { Meta, StoryObj } from '@storybook/react';
import { ProfileDropdown } from './ProfileDropdown';

const meta: Meta<typeof ProfileDropdown> = {
  title: 'App/ProfileDropdown',
  component: ProfileDropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered', // Center the dropdown in the canvas for better viewing
  }
};

export default meta;
type Story = StoryObj<typeof ProfileDropdown>;

export const LoggedIn: Story = {
  args: {
    userEmail: 'hello@flowboard.app',
  },
};

export const Guest: Story = {
  args: {
    userEmail: null,
  },
};
