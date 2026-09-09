'use client'

import { useEffect, useState, useMemo } from 'react'
import { getAllProgress } from '@/lib/lc-storage'
import { getCustomQuestions } from '@/lib/lc-custom'
import type { LCQuestion, UserProgress, Difficulty, QuestionStatus } from '@/lib/lc-types'
import QuestionCard from '@/components/lc/QuestionCard'
import builtinQuestions from '@/data/lc-questions.json'

const difficulties: ('All' | Difficulty)[] = ['All', 'Easy', 'Medium', 'Hard']
const statuses: { label: string; value: 'all' | QuestionStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'not_started' },
  { label: 'Solving', value: 'reviewing' },
]

export default function QuestionsPage() {
  const [progress, setProgress] = useState<Record<number, UserProgress>>({})
  const [customQuestions, setCustomQuestions] = useState<LCQuestion[]>([])
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState<'All' | Difficulty>('All')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState<'all' | QuestionStatus>('all')

  useEffect(() => {
    getAllProgress().then(setProgress)
    getCustomQuestions().then(setCustomQuestions)
  }, [])

  const allQuestions = useMemo(
    () => [...(builtinQuestions as LCQuestion[]), ...customQuestions],
    [customQuestions]
  )

  const allCategories = useMemo(
    () => ['All', ...Array.from(new Set(allQuestions.map(q => q.category)))],
    [allQuestions]
  )

  const filtered = useMemo(() => {
    return allQuestions.filter(q => {
      if (difficulty !== 'All' && q.difficulty !== difficulty) return false
      if (category !== 'All' && q.category !== category) return false
      if (status !== 'all') {
        const s = progress[q.id]?.status ?? 'not_started'
        if (s !== status) return false
      }
      if (search.trim()) {
        const term = search.toLowerCase()
        return q.title.toLowerCase().includes(term) || q.topics.some(t => t.toLowerCase().includes(term))
      }
      return true
    })
  }, [allQuestions, progress, search, difficulty, category, status])

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-5">
      <div>
        <h1 className="grad-text text-3xl font-bold tracking-tight">Questions</h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          {filtered.length} of {allQuestions.length} questions
        </p>
      </div>

      {/* Search within tracked */}
      <input
        type="text"
        placeholder="Filter your questions..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-violet-400 placeholder:text-stone-400"
      />

      {/* Difficulty filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {difficulties.map(d => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              difficulty === d
                ? 'btn-grad text-white'
                : 'border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex gap-2">
        {statuses.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setStatus(value)}
            className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all border ${
              status === value
                ? 'bg-violet-100 dark:bg-violet-950/60 border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300'
                : 'border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-violet-400 text-stone-700 dark:text-stone-300"
      >
        {allCategories.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Question list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-stone-400 dark:text-stone-600">
            No questions match your filters.
          </div>
        ) : (
          filtered.map(q => (
            <QuestionCard key={q.id} question={q} progress={progress[q.id] ?? null} />
          ))
        )}
      </div>
    </div>
  )
}
