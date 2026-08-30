import { NextRequest, NextResponse } from 'next/server'
import type { LCQuestion } from '@/lib/lc-types'

interface RawProblem {
  questionFrontendId: string
  title: string
  titleSlug: string
  difficulty: string
  isPaidOnly: boolean
  topicTags: { name: string }[]
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (!q.trim()) return NextResponse.json([])

  const res = await fetch(
    `https://alfa-leetcode-api.onrender.com/problems?limit=20&search=${encodeURIComponent(q)}`,
    { next: { revalidate: 60 } }
  )

  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch' }, { status: 502 })

  const data = await res.json()
  const problems: LCQuestion[] = (data.problemsetQuestionList ?? [])
    .filter((p: RawProblem) => !p.isPaidOnly)
    .map((p: RawProblem) => ({
      id: parseInt(p.questionFrontendId),
      title: p.title,
      slug: p.titleSlug,
      difficulty: p.difficulty as LCQuestion['difficulty'],
      topics: p.topicTags?.map(t => t.name) ?? [],
      category: p.topicTags?.[0]?.name ?? 'General',
    }))

  return NextResponse.json(problems)
}
