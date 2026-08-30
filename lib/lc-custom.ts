import type { LCQuestion } from './lc-types'

const KEY = 'lc-custom-questions'

export function getCustomQuestions(): LCQuestion[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addCustomQuestion(q: LCQuestion): void {
  const existing = getCustomQuestions()
  if (existing.some(e => e.id === q.id)) return
  localStorage.setItem(KEY, JSON.stringify([...existing, q]))
}

export function removeCustomQuestion(id: number): void {
  const existing = getCustomQuestions()
  localStorage.setItem(KEY, JSON.stringify(existing.filter(q => q.id !== id)))
}
