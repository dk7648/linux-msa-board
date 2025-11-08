/**
 * Format date to locale string
 * @param date - Date to format
 * @param locale - Locale string (default: 'ko-KR')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, locale = 'ko-KR'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(locale)
}

/**
 * Format date with time
 * @param date - Date to format
 * @param locale - Locale string (default: 'ko-KR')
 * @returns Formatted datetime string
 */
export function formatDateTime(date: Date | string, locale = 'ko-KR'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleString(locale)
}

/**
 * Get relative time string (e.g., "2시간 전", "3일 전")
 * @param date - Date to compare
 * @returns Relative time string
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - dateObj.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}일 전`
  if (hours > 0) return `${hours}시간 전`
  if (minutes > 0) return `${minutes}분 전`
  return '방금 전'
}
