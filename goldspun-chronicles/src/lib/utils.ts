import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats large gold numbers into a more readable format
 * @param value - The gold amount to format
 * @param decimals - Number of decimal places to show (default: 2)
 * @returns Formatted string (e.g., "4.19B", "1.5M", "850K", "1,234")
 */
export function formatGold(value: number, decimals: number = 2): string {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(decimals).replace(/\.?0+$/, '') + 'B';
  }
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(decimals).replace(/\.?0+$/, '') + 'M';
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(decimals).replace(/\.?0+$/, '') + 'K';
  }
  return value.toLocaleString();
}
