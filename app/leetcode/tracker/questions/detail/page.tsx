'use client'

import { Suspense, useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getProgress, markSolved, recordReview, updateNotes, getSettings } from '@/lib/lc-storage'
import { isDueToday, daysUntilReview } from '@/lib/lc-srs'
import { askGemini } from '@/lib/lc-gemini'
import type { LCQuestion, UserProgress, ReviewRating } from '@/lib/lc-types'
import ReviewPopup from '@/components/lc/ReviewPopup'
import questions from '@/data/lc-questions.json'

const allQuestions = questions as LCQuestion[]

const DIFF_COLORS: Record<string, string> = {
  Easy: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/40',
  Medium: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/40',
  Hard: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/40',
}

interface Message {
  role: 'user' | 'assistant'
  text: string
}

const QUICK_PROMPTS = ['Give me a hint', 'Explain the approach', 'What data structure should I use?', 'Quiz me on this']

function QuestionDetailContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const router = useRouter()
  const question = allQuestions.find(q => q.id === parseInt(id ?? ''))

  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [notes, setNotes] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [isFirstSolve, setIsFirstSolve] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!question) return
    ;(async () => {
      const p = await getProgress(question.id)
      setProgress(p)
      setNotes(p?.notes ?? '')
      setApiKey((await getSettings()).geminiApiKey)
    })()
  }, [question])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleNotesChange = (val: string) => {
    setNotes(val)
    if (notesTimer.current) clearTimeout(notesTimer.current)
    notesTimer.current = setTimeout(async () => {
      if (question) {
        await updateNotes(question.id, val)
        setNoteSaved(true)
        setTimeout(() => setNoteSaved(false), 1500)
      }
    }, 800)
  }

  const handleMarkSolved = async () => {
    const p = await getProgress(question!.id)
    setIsFirstSolve(!p || p.status === 'not_started')
    setShowPopup(true)
  }

  const handleReviewSave = async (interval: number, rating: ReviewRating) => {
    if (!question) return
    let updated: UserProgress
    if (isFirstSolve) {
      updated = await markSolved(question.id, interval)
    } else {
      updated = await recordReview(question.id, rating, interval)
    }
    setProgress(updated)
    setShowPopup(false)
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || !question) return
    if (!apiKey) {
      setMessages(m => [...m, { role: 'assistant', text: 'Please add your Gemini API key in Settings first.' }])
      return
    }
    const userMsg: Message = { role: 'user', text }
    setMessages(m => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const reply = await askGemini(apiKey, question.title, text)
      setMessages(m => [...m, { role: 'assistant', text: reply }])
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', text: `Error: ${(e as Error).message}` }])
    } finally {
      setLoading(false)
    }
  }

  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-stone-500">Question not found.</p>
        <button onClick={() => router.back()} className="btn-outline rounded-xl px-5 py-2 text-sm font-semibold">Go back</button>
      </div>
    )
  }

  const due = isDueToday(progress?.nextReviewDate ?? null)
  const days = daysUntilReview(progress?.nextReviewDate ?? null)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <button onClick={() => router.back()} className="text-sm text-stone-500 dark:text-stone-400 mb-3 flex items-center gap-1">
          ← Back
        </button>
        <div className="flex items-start gap-3">
          <span className="text-xs font-mono text-stone-400 pt-1">{question.id}.</span>
          <div className="flex-1">
            <h1 className="font-bold text-xl leading-snug">{question.title}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${DIFF_COLORS[question.difficulty]}`}>
                {question.difficulty}
              </span>
              <span className="text-xs text-stone-400 dark:text-stone-500 px-2 py-1 rounded-full border border-stone-200 dark:border-stone-700">
                {question.category}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {question.topics.map(t => (
                <span key={t} className="text-xs text-stone-400 dark:text-stone-500">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status & actions */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">🔁 Recap Schedule</p>
        <div className="flex items-center justify-between">
          <div>
            {!progress || progress.status === 'not_started' ? (
              <p className="text-sm text-stone-500">Not started</p>
            ) : due ? (
              <p className="text-sm font-semibold text-violet-500">Due for review today!</p>
            ) : days !== null ? (
              <p className="text-sm text-stone-500">Next review in <span className="font-semibold text-stone-700 dark:text-stone-300">{days} days</span></p>
            ) : null}
            {progress?.solvedAt && (
              <p className="text-xs text-stone-400 mt-0.5">
                First solved {new Date(progress.solvedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <a
            href={`https://leetcode.com/problems/${question.slug}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 glass rounded-xl py-2.5 text-sm font-semibold text-center border border-stone-200 dark:border-stone-700"
          >
            Open on LeetCode ↗
          </a>
          <button
            onClick={handleMarkSolved}
            className="flex-1 btn-outline rounded-xl py-2.5 text-sm font-semibold"
          >
            {!progress || progress.status === 'not_started' ? 'Mark Solved' : 'Update Recap'}
          </button>
        </div>

        {progress?.reviewHistory && progress.reviewHistory.length > 0 && (
          <div className="pt-1 border-t border-stone-100 dark:border-stone-800">
            <p className="text-xs text-stone-400 dark:text-stone-500 mb-2">Review history</p>
            <div className="flex gap-1.5 flex-wrap">
              {progress.reviewHistory.map((r, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    r.rating === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400'
                    : r.rating === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                  }`}
                >
                  {r.rating} · {r.nextInterval}d
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="glass rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">📝 My Notes</p>
          {noteSaved && <span className="text-xs text-green-500">Saved ✓</span>}
        </div>
        <p className="text-xs text-stone-400 dark:text-stone-500 -mt-1">Auto-saves as you type.</p>
        <textarea
          value={notes}
          onChange={e => handleNotesChange(e.target.value)}
          placeholder="Jot down your approach, key insight, or gotchas..."
          rows={5}
          className="w-full bg-transparent text-sm resize-none outline-none placeholder:text-stone-400 leading-relaxed"
        />
      </div>

      {/* AI Assistant */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">AI Assistant</p>

        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map(p => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="text-xs px-3 py-1.5 rounded-full border border-violet-200 dark:border-violet-800/50 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {messages.length > 0 && (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                    m.role === 'user'
                      ? 'btn-grad text-white rounded-br-sm'
                      : 'bg-stone-100 dark:bg-stone-800/60 text-stone-800 dark:text-stone-200 rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-stone-100 dark:bg-stone-800/60 rounded-2xl rounded-bl-sm px-4 py-2.5">
                  <span className="text-sm text-stone-400 animate-pulse">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder="Ask for a hint..."
            className="flex-1 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent px-3.5 py-2 text-sm outline-none focus:border-violet-400 placeholder:text-stone-400"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="btn-outline rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>

      {showPopup && (
        <ReviewPopup
          questionTitle={question.title}
          isFirstSolve={isFirstSolve}
          onSave={handleReviewSave}
          onSkip={() => setShowPopup(false)}
        />
      )}
    </div>
  )
}

export default function QuestionDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-stone-400">Loading...</div>}>
      <QuestionDetailContent />
    </Suspense>
  )
}
