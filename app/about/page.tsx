import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About' }

const skills = ['TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Tailwind CSS', 'PostgreSQL', 'Docker']

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="grad-text mb-2 text-4xl font-bold tracking-tight">About me</h1>
      <p className="mb-12 text-stone-500 dark:text-stone-400">A bit about who I am and what I do.</p>

      <div className="grid gap-16 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6 text-stone-600 dark:text-stone-300 leading-relaxed">
          <p>
            I&apos;m a software developer who loves building products that are simple, fast, and enjoyable to use. I care deeply about the details — both in code and in design.
          </p>
          <p>
            When I&apos;m not coding, I&apos;m probably reading, exploring new places, playing badminton, or thinking about how to make something better.
          </p>
          <p>
            This site is where I share my projects and writing. I write to think more clearly and to connect with people who care about similar things.
          </p>
          <div className="pt-2">
            <a
              href="https://www.linkedin.com/in/zelin-jin/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold"
            >
              Get in touch
            </a>
          </div>
        </div>

        <aside className="space-y-8">
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span key={s} className="glass rounded-full px-3 py-1 text-xs font-medium text-stone-600 dark:text-stone-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">Links</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-800 dark:text-violet-400 transition-colors">GitHub →</a></li>
              <li><a href="mailto:zj199807@gmail.com" className="text-violet-600 hover:text-violet-800 dark:text-violet-400 transition-colors">Email →</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
