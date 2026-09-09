'use client'

import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { getCustomQuestions, addCustomQuestion } from '@/lib/lc-custom'
import { searchLeetCodeQuestions } from '@/lib/lc-search-client'
import type { LCQuestion } from '@/lib/lc-types'
import builtinQuestions from '@/data/lc-questions.json'

const DIFF_COLORS: Record<string, string> = {
  Easy: 'text-green-600 dark:text-green-400',
  Medium: 'text-yellow-600 dark:text-yellow-400',
  Hard: 'text-red-600 dark:text-red-400',
}

export default function AddQuestionsPage() {
  const [customQuestions, setCustomQuestions] = useState<LCQuestion[]>([])
  const [lcSearch, setLcSearch] = useState('')
  const [lcResults, setLcResults] = useState<LCQuestion[]>([])
  const [lcLoading, setLcLoading] = useState(false)
  const [lcError, setLcError] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    getCustomQuestions().then(setCustomQuestions)
  }, [])

  const allQuestions = useMemo(
    () => [...(builtinQuestions as LCQuestion[]), ...customQuestions],
    [customQuestions]
  )

  const searchLeetCode = useCallback((q: string) => {
    if (!q.trim()) { setLcResults([]); return }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLcLoading(true)
      setLcError('')
      try {
        setLcResults(await searchLeetCodeQuestions(q))
      } catch {
        setLcError('Search failed. Try again.')
      } finally {
        setLcLoading(false)
      }
    }, 500)
  }, [])

  const handleLcSearchChange = (val: string) => {
    setLcSearch(val)
    searchLeetCode(val)
  }

  const handleAdd = async (q: LCQuestion) => {
    await addCustomQuestion(q)
    setCustomQuestions(await getCustomQuestions())
  }

  const alreadyTracked = (id: number) => allQuestions.some(q => q.id === id)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-5">
      <div>
        <h1 className="grad-text text-3xl font-bold tracking-tight">Add Questions</h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Search LeetCode&apos;s full problem set — not limited to the built-in 149.
        </p>
      </div>

      <div className="glass rounded-2xl p-4 space-y-3">
        <input
          type="text"
          placeholder="e.g. binary tree, two sum..."
          value={lcSearch}
          onChange={e => handleLcSearchChange(e.target.value)}
          autoFocus
          className="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-violet-400 placeholder:text-stone-400"
        />
        {lcLoading && <p className="text-xs text-stone-400 text-center py-2 animate-pulse">Searching...</p>}
        {lcError && <p className="text-xs text-red-500">{lcError}</p>}
        {lcResults.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {lcResults.map(q => (
              <div key={q.id} className="flex items-center gap-3 rounded-xl border border-stone-100 dark:border-stone-800 px-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-stone-400">{q.id}.</span>
                    <span className="text-sm font-medium truncate">{q.title}</span>
                  </div>
                  <span className={`text-xs font-semibold ${DIFF_COLORS[q.difficulty]}`}>{q.difficulty}</span>
                </div>
                {alreadyTracked(q.id) ? (
                  <span className="text-xs text-green-500 font-semibold flex-shrink-0">✓ Added</span>
                ) : (
                  <button
                    onClick={() => handleAdd(q)}
                    className="flex-shrink-0 btn-outline rounded-lg px-3 py-1 text-xs font-semibold"
                  >
                    Add
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {!lcLoading && lcSearch.trim() && lcResults.length === 0 && !lcError && (
          <p className="text-xs text-stone-400 text-center py-2">No results found.</p>
        )}
        {!lcSearch.trim() && (
          <p className="text-xs text-stone-400 text-center py-6">Start typing to search LeetCode&apos;s problem set.</p>
        )}
      </div>
    </div>
  )
}
