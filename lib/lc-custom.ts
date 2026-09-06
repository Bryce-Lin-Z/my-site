import type { LCQuestion } from './lc-types'
import { isTauri, getTauriStore } from './lc-store-backend'

const KEY = 'lc-custom-questions'

export async function getCustomQuestions(): Promise<LCQuestion[]> {
  if (isTauri()) {
    const store = await getTauriStore()
    return (await store.get<LCQuestion[]>(KEY)) ?? []
  }
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

async function saveCustomQuestions(questions: LCQuestion[]): Promise<void> {
  if (isTauri()) {
    const store = await getTauriStore()
    await store.set(KEY, questions)
    await store.save()
    return
  }
  localStorage.setItem(KEY, JSON.stringify(questions))
}

export async function addCustomQuestion(q: LCQuestion): Promise<void> {
  const existing = await getCustomQuestions()
  if (existing.some(e => e.id === q.id)) return
  await saveCustomQuestions([...existing, q])
}

export async function removeCustomQuestion(id: number): Promise<void> {
  const existing = await getCustomQuestions()
  await saveCustomQuestions(existing.filter(q => q.id !== id))
}
