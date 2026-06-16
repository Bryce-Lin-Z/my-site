import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Contact' }

export default function Contact() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="grad-text mb-2 text-4xl font-bold tracking-tight">Contact</h1>
      <p className="mb-12 text-stone-500 dark:text-stone-400">I&apos;d love to hear from you.</p>

      <div className="max-w-lg space-y-8">
        <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
          Whether you have a question, a project idea, or just want to say hi — my inbox is open.
        </p>
        <a
          href="mailto:zj199807@gmail.com"
          className="btn-grad inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          zj199807@gmail.com
        </a>
        <div className="pt-4">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">Also find me on</h2>
          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-violet-600 hover:text-violet-800 dark:text-violet-400 transition-colors">
              GitHub →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
