import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/mdx'
import PostCard from '@/components/PostCard'

export const metadata: Metadata = { title: 'Blog' }

export default function Blog() {
  const posts = getAllPosts()
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="grad-text mb-2 text-4xl font-bold tracking-tight">Blog</h1>
      <p className="mb-12 text-stone-500 dark:text-stone-400">Thoughts on software, design, and life.</p>
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
