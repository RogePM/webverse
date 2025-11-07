import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging Tailwind CSS classes
 * Essential for shadcn/ui components
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

