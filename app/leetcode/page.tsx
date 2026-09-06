import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'LeetCode Tracker' }

const features = [
  {
    icon: '🧠',
    title: 'Spaced Repetition',
    description: 'Built on the forgetting curve — reviews resurface at exactly the right time so you retain what you learn.',
  },
  {
    icon: '📋',
    title: '149 Curated Questions',
    description: 'The full NeetCode 150 list, organised by category. Filter by difficulty, topic, or your progress status.',
  },
  {
    icon: '🤖',
    title: 'AI Hints',
    description: 'Stuck? Ask the built-in Gemini assistant for a nudge, an approach explanation, or a quiz — without spoiling the answer.',
  },
  {
    icon: '🔍',
    title: 'Search Any LC Question',
    description: 'Not limited to the 149. Search LeetCode\'s full problem set and add any question to your tracker on demand.',
  },
  {
    icon: '📝',
    title: 'Personal Notes',
    description: 'Jot down your approach, key insights, or gotchas for each question. Auto-saved locally in your browser.',
  },
  {
    icon: '📊',
    title: 'Review History',
    description: 'See how each question went over time — Hard, Medium, Easy — and watch your intervals grow as you improve.',
  },
]

const steps = [
  { step: '1', text: 'Browse or search for a LeetCode question' },
  { step: '2', text: 'Solve it on LeetCode, then come back and mark it done' },
  { step: '3', text: 'Rate how it went and pick your review interval' },
  { step: '4', text: 'The app resurfaces it when your memory is about to fade' },
]

export default function LeetcodeLanding() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 space-y-24">
      {/* Hero */}
      <section className="text-center space-y-6">
        <p className="inline-block rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1 text-xs font-semibold tracking-widest text-violet-600 dark:border-violet-800/50 dark:bg-violet-950/40 dark:text-violet-300">
          PERSONAL PROJECT
        </p>
        <h1 className="grad-text text-5xl font-bold tracking-tight leading-tight">
          LeetCode Tracker
        </h1>
        <p className="mx-auto max-w-xl text-lg text-stone-500 dark:text-stone-400 leading-relaxed">
          A spaced repetition app for interview prep. Review the right questions at the right time, with AI hints when you&apos;re stuck.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/leetcode/app" className="btn-grad rounded-full px-7 py-3 text-sm font-semibold">
            Launch App →
          </Link>
          {process.env.NEXT_PUBLIC_TAURI_BUILD !== '1' && (
            <a
              href="/downloads/leetcode-tracker-mac.dmg"
              download
              className="glass rounded-full px-7 py-3 text-sm font-semibold text-stone-700 dark:text-stone-300 hover:-translate-y-0.5 transition-all"
            >
              ⬇ Download for Mac
            </a>
          )}
          <a
            href="https://github.com/Bryce-Lin-Z/my-site"
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-full px-7 py-3 text-sm font-semibold text-stone-700 dark:text-stone-300 hover:-translate-y-0.5 transition-all"
          >
            View Source
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-center">How it works</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map(({ step, text }) => (
            <div key={step} className="glass rounded-2xl p-5 flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full btn-grad flex items-center justify-center text-sm font-bold text-white">
                {step}
              </span>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed pt-1">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-center">Features</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon, title, description }) => (
            <div key={title} className="glass rounded-2xl p-5 space-y-2">
              <div className="text-2xl">{icon}</div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="glass rounded-2xl p-8 space-y-4">
        <h2 className="text-xl font-bold">Built with</h2>
        <div className="flex flex-wrap gap-2">
          {['Next.js 16', 'TypeScript', 'Tailwind CSS v4', 'localStorage', 'Gemini AI', 'alfa-leetcode-api', 'PWA'].map(tag => (
            <span key={tag} className="rounded-full border border-violet-200 dark:border-violet-800/50 bg-violet-50 dark:bg-violet-950/30 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          All progress is stored locally in your browser — no account, no server, no cost.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Try it yourself</h2>
        <p className="text-stone-500 dark:text-stone-400">Your progress stays in your browser. No sign-up needed.</p>
        <Link href="/leetcode/app" className="btn-grad inline-block rounded-full px-8 py-3 text-sm font-semibold">
          Launch App →
        </Link>
      </section>
    </div>
  )
}
