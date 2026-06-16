import type { Metadata } from 'next'
import ProjectCard from '@/components/ProjectCard'

export const metadata: Metadata = { title: 'Projects' }

const projects = [
  {
    title: 'Personal Website',
    description: 'This site — a portfolio and blog built with Next.js 15, Tailwind CSS v4, and MDX.',
    tags: ['Next.js', 'Tailwind CSS', 'MDX', 'TypeScript'],
    github: 'https://github.com',
    demo: '/',
  },
  {
    title: 'Tic Tac Toe',
    description: 'A cat vs dog Tic Tac Toe game with score tracking, built as a single HTML file.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    demo: '#',
  },
  {
    title: 'Project Three',
    description: 'A short description of another project you have worked on. Replace this with your real project.',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    github: 'https://github.com',
  },
]

export default function Projects() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="grad-text mb-2 text-4xl font-bold tracking-tight">Projects</h1>
      <p className="mb-12 text-stone-500 dark:text-stone-400">Things I&apos;ve built or am currently building.</p>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map(p => <ProjectCard key={p.title} {...p} />)}
      </div>
    </div>
  )
}
