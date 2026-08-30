import type { UserProgress, ReviewRating, LCSettings, ReviewEntry } from './lc-types'
import { calculateNextInterval, addDays } from './lc-srs'

const PROGRESS_KEY = 'lc-progress'
const SETTINGS_KEY = 'lc-settings'

export function getAllProgress(): Record<number, UserProgress> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveAll(data: Record<number, UserProgress>): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data))
}

export function getProgress(id: number): UserProgress | null {
  return getAllProgress()[id] ?? null
}

export function markSolved(id: number, interval: number): UserProgress {
  const all = getAllProgress()
  const now = new Date().toISOString()
  const entry: ReviewEntry = { date: now, rating: 'Medium', nextInterval: interval }
  const updated: UserProgress = {
    id,
    status: 'reviewing',
    notes: all[id]?.notes ?? '',
    solvedAt: all[id]?.solvedAt ?? now,
    nextReviewDate: addDays(interval).toISOString(),
    interval,
    reviewHistory: [...(all[id]?.reviewHistory ?? []), entry],
  }
  all[id] = updated
  saveAll(all)
  return updated
}

export function recordReview(id: number, rating: ReviewRating, interval: number): UserProgress {
  const all = getAllProgress()
  const existing = all[id]
  const now = new Date().toISOString()
  const nextInterval = interval > 0 ? interval : calculateNextInterval(existing?.interval ?? 1, rating)
  const updated: UserProgress = {
    ...(existing ?? { id, status: 'reviewing', notes: '', solvedAt: now, reviewHistory: [] }),
    interval: nextInterval,
    nextReviewDate: addDays(nextInterval).toISOString(),
    reviewHistory: [...(existing?.reviewHistory ?? []), { date: now, rating, nextInterval }],
  }
  all[id] = updated
  saveAll(all)
  return updated
}

export function updateNotes(id: number, notes: string): void {
  const all = getAllProgress()
  if (!all[id]) {
    all[id] = { id, status: 'not_started', notes, solvedAt: null, nextReviewDate: null, interval: 0, reviewHistory: [] }
  } else {
    all[id].notes = notes
  }
  saveAll(all)
}

export function getSettings(): LCSettings {
  if (typeof window === 'undefined') return { geminiApiKey: '' }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? JSON.parse(raw) : { geminiApiKey: '' }
  } catch {
    return { geminiApiKey: '' }
  }
}

export function saveSettings(settings: LCSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
