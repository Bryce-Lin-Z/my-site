import type { ReviewRating } from './lc-types'

export function calculateNextInterval(currentInterval: number, rating: ReviewRating): number {
  switch (rating) {
    case 'Easy': return Math.round(Math.max(currentInterval * 2.5, 7))
    case 'Medium': return Math.round(Math.max(currentInterval * 1.5, 3))
    case 'Hard': return 1
  }
}

export function addDays(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}

export function isDueToday(nextReviewDate: string | null): boolean {
  if (!nextReviewDate) return false
  return new Date(nextReviewDate) <= new Date()
}

export function daysUntilReview(nextReviewDate: string | null): number | null {
  if (!nextReviewDate) return null
  const diff = new Date(nextReviewDate).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
