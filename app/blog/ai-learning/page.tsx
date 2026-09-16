import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'
import PostCard from '@/components/PostCard'
import StudyCalendar from '@/components/StudyCalendar'

export const metadata: Metadata = { title: 'AI Learning' }

export default function AiLearning() {
  const posts = getAllPosts().filter(post => post.tags.includes('ai-learning'))
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/blog" className="mb-8 inline-flex items-center gap-1 text-sm text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors">
        ← Back to blog
      </Link>
      <h1 className="grad-text mb-2 mt-4 text-4xl font-bold tracking-tight">AI Learning</h1>
      <p className="mb-8 text-stone-500 dark:text-stone-400">
        Success is the sum of small efforts, repeated day in and day out.
      </p>
      <StudyCalendar tag="ai-learning" />
      {posts.length === 0 ? (
        <p className="text-stone-400">No entries yet.</p>
      ) : (
        <div className="space-y-5">
          {posts.map(post => <PostCard key={post.slug} {...post} />)}
        </div>
      )}
    </div>
  )
}
