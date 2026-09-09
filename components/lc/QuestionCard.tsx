'use client'

import Link from 'next/link'
import type { LCQuestion, UserProgress } from '@/lib/lc-types'
import { isDueToday, daysUntilReview } from '@/lib/lc-srs'

interface Props {
  question: LCQuestion
  progress: UserProgress | null
}

const DIFF_COLORS: Record<string, string> = {
  Easy: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/40',
  Medium: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/40',
  Hard: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/40',
}

export default function QuestionCard({ question, progress }: Props) {
  const due = isDueToday(progress?.nextReviewDate ?? null)
  const days = daysUntilReview(progress?.nextReviewDate ?? null)
  const status = progress?.status ?? 'not_started'

  return (
    <Link
      href={`/leetcode/tracker/questions/detail?id=${question.id}`}
      className="glass flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all hover:-translate-y-0.5 active:scale-98"
    >
      <div className="flex-shrink-0 w-8 text-center">
        {status === 'not_started' && <span className="text-stone-300 dark:text-stone-600 text-lg">○</span>}
        {status === 'reviewing' && due && <span className="text-violet-500 text-lg">●</span>}
        {status === 'reviewing' && !due && <span className="text-green-500 text-lg">✓</span>}
        {status === 'solved' && <span className="text-green-500 text-lg">✓</span>}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs text-stone-400 dark:text-stone-500 font-mono">{question.id}.</span>
          <span className="font-medium text-sm truncate">{question.title}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFF_COLORS[question.difficulty]}`}>
            {question.difficulty}
          </span>
          {question.topics.slice(0, 2).map(t => (
            <span key={t} className="text-xs text-stone-400 dark:text-stone-500">{t}</span>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 text-right">
        {status === 'not_started' && (
          <span className="text-xs text-stone-400 dark:text-stone-500">New</span>
        )}
        {status === 'reviewing' && due && (
          <span className="text-xs font-semibold text-violet-500">Due</span>
        )}
        {status === 'reviewing' && !due && days !== null && (
          <span className="text-xs text-stone-400 dark:text-stone-500">in {days}d</span>
        )}
      </div>
    </Link>
  )
}
