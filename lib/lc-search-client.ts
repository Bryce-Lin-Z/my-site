import { isTauri } from './lc-store-backend'
import type { LCQuestion } from './lc-types'

interface RawProblem {
  questionFrontendId: string
  title: string
  titleSlug: string
  difficulty: string
  isPaidOnly: boolean
  topicTags: { name: string }[]
}

function mapProblems(data: { problemsetQuestionList?: RawProblem[] }): LCQuestion[] {
  return (data.problemsetQuestionList ?? [])
    .filter(p => !p.isPaidOnly)
    .map(p => ({
      id: parseInt(p.questionFrontendId),
      title: p.title,
      slug: p.titleSlug,
      difficulty: p.difficulty as LCQuestion['difficulty'],
      topics: p.topicTags?.map(t => t.name) ?? [],
      category: p.topicTags?.[0]?.name ?? 'General',
    }))
}

export async function searchLeetCodeQuestions(q: string): Promise<LCQuestion[]> {
  if (!isTauri()) {
    const res = await fetch(`/api/lc-search?q=${encodeURIComponent(q)}`)
    if (!res.ok) throw new Error('Search failed')
    return res.json()
  }

  const url = `https://alfa-leetcode-api.onrender.com/problems?limit=20&search=${encodeURIComponent(q)}`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Search failed')
    return mapProblems(await res.json())
  } catch {
    // Plain fetch inside the webview can hit CORS depending on the target's
    // headers — fall back to the Rust-side HTTP plugin, which bypasses it.
    const { fetch: tauriFetch } = await import('@tauri-apps/plugin-http')
    const res = await tauriFetch(url)
    if (!res.ok) throw new Error('Search failed')
    return mapProblems(await res.json())
  }
}
