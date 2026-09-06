'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllProgress } from '@/lib/lc-storage'
import { isDueToday } from '@/lib/lc-srs'
import type { LCQuestion, UserProgress } from '@/lib/lc-types'
import QuestionCard from '@/components/lc/QuestionCard'
import questions from '@/data/lc-questions.json'

const allQuestions = questions as LCQuestion[]

export default function LeetcodeDashboard() {
  const [progress, setProgress] = useState<Record<number, UserProgress>>({})

  useEffect(() => {
    getAllProgress().then(setProgress)
  }, [])

  const solved = Object.values(progress).filter(p => p.status === 'reviewing' || p.status === 'solved')
  const dueToday = allQuestions.filter(q => {
    const p = progress[q.id]
    return p && isDueToday(p.nextReviewDate)
  })

  const recentlySolved = allQuestions
    .filter(q => progress[q.id]?.solvedAt)
    .sort((a, b) => {
      const dateA = progress[a.id]?.solvedAt ?? ''
      const dateB = progress[b.id]?.solvedAt ?? ''
      return dateB.localeCompare(dateA)
    })
    .slice(0, 5)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-8">
      <div>
        <h1 className="grad-text text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Your LeetCode memory trainer</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Solved', value: solved.length, color: 'text-green-600 dark:text-green-400' },
          { label: 'Due Today', value: dueToday.length, color: 'text-violet-600 dark:text-violet-400' },
          { label: 'Total', value: allQuestions.length, color: 'text-stone-600 dark:text-stone-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass rounded-2xl p-4 text-center">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Due today */}
      {dueToday.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Due Today
            </h2>
            <span className="text-xs font-semibold text-violet-500 bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 rounded-full">
              {dueToday.length}
            </span>
          </div>
          <div className="space-y-2">
            {dueToday.map(q => (
              <QuestionCard key={q.id} question={q} progress={progress[q.id] ?? null} />
            ))}
          </div>
        </section>
      )}

      {dueToday.length === 0 && solved.length > 0 && (
        <div className="glass rounded-2xl p-5 text-center">
          <div className="text-2xl mb-2">🎉</div>
          <p className="font-semibold text-sm">All caught up!</p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">No reviews due today.</p>
        </div>
      )}

      {/* Recently solved */}
      {recentlySolved.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Recently Solved
          </h2>
          <div className="space-y-2">
            {recentlySolved.map(q => (
              <QuestionCard key={q.id} question={q} progress={progress[q.id] ?? null} />
            ))}
          </div>
        </section>
      )}

      {/* CTA for new users */}
      {solved.length === 0 && (
        <div className="glass rounded-2xl p-6 text-center space-y-3">
          <div className="text-3xl">🧠</div>
          <p className="font-semibold">Start tracking your progress</p>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Browse questions, mark them solved, and we&apos;ll remind you when to review.
          </p>
          <Link href="/leetcode/app/questions" className="btn-grad inline-block rounded-full px-5 py-2 text-sm font-semibold">
            Browse Questions
          </Link>
        </div>
      )}
    </div>
  )
}
