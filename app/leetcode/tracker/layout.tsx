import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'LeetCode Tracker' }

const tabs = [
  { href: '/leetcode/tracker', label: 'Dashboard', icon: '⚡' },
  { href: '/leetcode/tracker/questions', label: 'Questions', icon: '📋' },
  { href: '/leetcode/tracker/add', label: 'Add Questions', icon: '➕' },
  { href: '/leetcode/tracker/settings', label: 'Settings', icon: '⚙️' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Top tab nav */}
      <div className="flex items-center gap-1 mb-8 border-b border-stone-200 dark:border-stone-800 pb-4">
        {tabs.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all"
          >
            <span>{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
        <div className="ml-auto">
          <Link href="/leetcode" className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
            ← Back to showcase
          </Link>
        </div>
      </div>
      {children}
    </div>
  )
}
