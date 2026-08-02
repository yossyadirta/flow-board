import { describe, it, expect } from 'vitest';
import { formatDueDate, cn } from './utils';

describe('utils.ts', () => {
  describe('formatDueDate', () => {
    it('returns empty string if date is missing or invalid', () => {
      expect(formatDueDate()).toBe('');
      expect(formatDueDate('')).toBe('');
      expect(formatDueDate('invalid-date')).toBe('');
    });

    it('formats valid date correctly without time', () => {
      // Use a fixed date: 2026-07-23T00:00:00Z
      const date = new Date('2026-07-23T00:00:00Z');
      expect(formatDueDate(date)).toBe('23 Jul 2026');
    });

    it('formats valid date correctly with time', () => {
      const date = new Date('2026-07-23T14:30:00Z');
      // Note: time formatting depends on timezone, but this tests the basic inclusion
      const result = formatDueDate(date, true);
      expect(result).toContain('23 Jul 2026');
      expect(result).toMatch(/\d{2}:\d{2}/); // check if time is included
    });
  });

  describe('cn', () => {
    it('merges tailwind classes correctly', () => {
      expect(cn('bg-red-500', 'px-2')).toBe('bg-red-500 px-2');
      // Should handle conditional classes
      expect(cn('px-2', true && 'py-2', false && 'hidden')).toBe('px-2 py-2');
      // Should merge conflicting tailwind classes using tailwind-merge (e.g. pr-2 overrides px-4 padding-right)
      expect(cn('px-4', 'pr-2')).toBe('px-4 pr-2'); 
    });
  });
});
