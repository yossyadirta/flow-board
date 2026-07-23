import type { Meta, StoryObj } from '@storybook/react';
import { DemoSection } from './DemoSection';

const meta: Meta<typeof DemoSection> = {
  title: 'Landing/DemoSection',
  component: DemoSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DemoSection>;

export const Default: Story = {};
