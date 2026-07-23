import type { Meta, StoryObj } from '@storybook/react';
import { FeaturesSection } from './FeaturesSection';

const meta: Meta<typeof FeaturesSection> = {
  title: 'Landing/FeaturesSection',
  component: FeaturesSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FeaturesSection>;

export const Default: Story = {};
