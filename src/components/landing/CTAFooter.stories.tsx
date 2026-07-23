import type { Meta, StoryObj } from '@storybook/react';
import { CTAFooter } from './CTAFooter';

// Define the metadata for the story
const meta: Meta<typeof CTAFooter> = {
  title: 'Landing/CTAFooter', // The category and name in the Storybook sidebar
  component: CTAFooter, // The actual component being documented
  parameters: {
    // Optional: configure layout
    layout: 'fullscreen',
    // We can also configure Next.js specific things here if needed
  },
  tags: ['autodocs'], // Automatically generate documentation page
};

export default meta;
type Story = StoryObj<typeof CTAFooter>;

// Create the Default story variant
export const Default: Story = {
  args: {
    // CTAFooter doesn't have any props to pass down right now, 
    // but if it did, you would pass them here.
  },
};
