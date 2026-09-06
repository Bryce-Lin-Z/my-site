import type { UserProgress, ReviewRating, LCSettings, ReviewEntry } from './lc-types'
import { calculateNextInterval, addDays } from './lc-srs'
import { isTauri, getTauriStore } from './lc-store-backend'

const PROGRESS_KEY = 'lc-progress'
const SETTINGS_KEY = 'lc-settings'

export async function getAllProgress(): Promise<Record<number, UserProgress>> {
  if (isTauri()) {
    const store = await getTauriStore()
    return (await store.get<Record<number, UserProgress>>(PROGRESS_KEY)) ?? {}
  }
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

async function saveAll(data: Record<number, UserProgress>): Promise<void> {
  if (isTauri()) {
    const store = await getTauriStore()
    await store.set(PROGRESS_KEY, data)
    await store.save()
    return
  }
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data))
}

export async function getProgress(id: number): Promise<UserProgress | null> {
  return (await getAllProgress())[id] ?? null
}

export async function markSolved(id: number, interval: number): Promise<UserProgress> {
  const all = await getAllProgress()
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
  await saveAll(all)
  return updated
}

export async function recordReview(id: number, rating: ReviewRating, interval: number): Promise<UserProgress> {
  const all = await getAllProgress()
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
  await saveAll(all)
  return updated
}

export async function updateNotes(id: number, notes: string): Promise<void> {
  const all = await getAllProgress()
  if (!all[id]) {
    all[id] = { id, status: 'not_started', notes, solvedAt: null, nextReviewDate: null, interval: 0, reviewHistory: [] }
  } else {
    all[id].notes = notes
  }
  await saveAll(all)
}

export async function getSettings(): Promise<LCSettings> {
  if (isTauri()) {
    const store = await getTauriStore()
    return (await store.get<LCSettings>(SETTINGS_KEY)) ?? { geminiApiKey: '' }
  }
  if (typeof window === 'undefined') return { geminiApiKey: '' }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? JSON.parse(raw) : { geminiApiKey: '' }
  } catch {
    return { geminiApiKey: '' }
  }
}

export async function saveSettings(settings: LCSettings): Promise<void> {
  if (isTauri()) {
    const store = await getTauriStore()
    await store.set(SETTINGS_KEY, settings)
    await store.save()
    return
  }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
