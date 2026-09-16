'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
]

const learningLinks = [
  { href: '/blog/ai-learning', label: '🧠 AI Learning' },
  { href: '/leetcode', label: '💻 LeetCode' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const isLearningActive = learningLinks.some(({ href }) => pathname === href || pathname.startsWith(href + '/'))

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // The Tauri desktop build only ships the leetcode subtree (see scripts/build-tauri.mjs) —
  // links to the rest of the site would 404 there. This must be a build-time check (not a
  // runtime isTauri() check): the static export bakes this component's HTML in at build
  // time regardless, so only a build-time flag guarantees the nav is never in the exported
  // HTML at all, rather than relying on client hydration to remove it after the fact.
  if (process.env.NEXT_PUBLIC_TAURI_BUILD === '1') return null

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 dark:border-white/8" style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}>
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          <span className="grad-text">zelinjin</span>
          <span className="text-violet-400 dark:text-violet-300">.</span>
        </Link>
        <div className="flex items-center gap-0.5">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                pathname === href
                  ? 'bg-violet-100 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300 shadow-sm'
                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
              }`}
            >
              {label}
            </Link>
          ))}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOpen(o => !o)}
              className={`flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                isLearningActive
                  ? 'bg-violet-100 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300 shadow-sm'
                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
              }`}
            >
              Learning
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open && (
              <div className="absolute right-0 top-full mt-2 min-w-[10rem]">
                <div className="glass rounded-2xl p-1.5">
                  {learningLinks.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`block rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
                        pathname === href || pathname.startsWith(href + '/')
                          ? 'bg-violet-100 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300'
                          : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-stone-100'
                      }`}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}
