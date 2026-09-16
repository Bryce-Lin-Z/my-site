import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'
import PostCard from '@/components/PostCard'

export const metadata: Metadata = { title: 'Blog' }

export default function Blog() {
  const posts = getAllPosts()
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="grad-text mb-2 text-4xl font-bold tracking-tight">Blog</h1>
      <p className="mb-6 text-stone-500 dark:text-stone-400">Thoughts on software, design, and life.</p>
      <Link
        href="/blog/ai-learning"
        className="glass mb-12 flex items-center justify-between rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div>
          <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">🧠 AI Learning</p>
          <p className="text-sm text-stone-500 dark:text-stone-400">Daily progress log — going deep on AI concepts</p>
        </div>
        <span className="text-stone-400">→</span>
      </Link>
      {posts.length === 0 ? (
        <p className="text-stone-400">No posts yet. Check back soon.</p>
      ) : (
        <div className="space-y-5">
          {posts.map(post => <PostCard key={post.slug} {...post} />)}
        </div>
      )}
    </div>
  )
}
