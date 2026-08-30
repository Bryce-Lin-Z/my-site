'use client'

import { useState } from 'react'
import type { ReviewRating } from '@/lib/lc-types'

interface Props {
  questionTitle: string
  isFirstSolve: boolean
  onSave: (interval: number, rating: ReviewRating) => void
  onSkip: () => void
}

const PRESETS = [1, 3, 7, 14, 30]

const RATING_DEFAULTS: Record<ReviewRating, number> = {
  Hard: 1,
  Medium: 3,
  Easy: 7,
}

export default function ReviewPopup({ questionTitle, isFirstSolve, onSave, onSkip }: Props) {
  const [rating, setRating] = useState<ReviewRating>('Medium')
  const [interval, setInterval] = useState(3)
  const [custom, setCustom] = useState('')

  const handleRating = (r: ReviewRating) => {
    setRating(r)
    setCustom('')
    setInterval(RATING_DEFAULTS[r])
  }

  const handlePreset = (d: number) => {
    setCustom('')
    setInterval(d)
  }

  const handleCustom = (val: string) => {
    setCustom(val)
    const n = parseInt(val)
    if (n > 0) setInterval(n)
  }

  const finalInterval = custom && parseInt(custom) > 0 ? parseInt(custom) : interval

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="glass w-full max-w-sm rounded-2xl p-6 space-y-5">
        <div>
          <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-1">
            {isFirstSolve ? '✓ Marked as solved!' : '✓ Review recorded!'}
          </p>
          <h3 className="font-bold text-base leading-snug">{questionTitle}</h3>
        </div>

        <div>
          <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-2 uppercase tracking-wider">How did it go?</p>
          <div className="grid grid-cols-3 gap-2">
            {(['Hard', 'Medium', 'Easy'] as ReviewRating[]).map(r => (
              <button
                key={r}
                onClick={() => handleRating(r)}
                className={`rounded-xl py-2.5 text-sm font-semibold transition-all border-2 ${
                  rating === r
                    ? r === 'Hard'
                      ? 'bg-red-500 border-red-500 text-white'
                      : r === 'Medium'
                      ? 'bg-yellow-500 border-yellow-500 text-white'
                      : 'bg-green-500 border-green-500 text-white'
                    : 'border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-2 uppercase tracking-wider">
            Review in: <span className="text-violet-500">{finalInterval}d</span>
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            {PRESETS.map(d => (
              <button
                key={d}
                onClick={() => handlePreset(d)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-all border ${
                  interval === d && !custom
                    ? 'btn-grad border-transparent text-white'
                    : 'border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
          <input
            type="number"
            min="1"
            placeholder="Custom days..."
            value={custom}
            onChange={e => handleCustom(e.target.value)}
            className="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-violet-400 placeholder:text-stone-400"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onSkip}
            className="flex-1 rounded-xl py-2.5 text-sm font-medium border border-stone-200 dark:border-stone-700 text-stone-500"
          >
            Skip
          </button>
          <button
            onClick={() => onSave(finalInterval, rating)}
            className="flex-1 btn-grad rounded-xl py-2.5 text-sm font-semibold"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  )
}
