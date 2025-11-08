/**
 * Format number with thousand separators
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR')
}

/**
 * Format currency
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'KRW')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency = 'KRW'): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Clamp a number between min and max
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
