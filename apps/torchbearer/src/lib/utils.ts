/**
 * Utility functions for Torchbearer
 * 
 * Collection of helper functions used throughout the application.
 * Kept simple and focused on core functionality.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 * This prevents Tailwind class conflicts and allows conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
