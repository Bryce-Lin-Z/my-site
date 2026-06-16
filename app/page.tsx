import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'
import PostCard from '@/components/PostCard'

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 2)

  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      {/* Hero */}
      <section className="mb-24">
        <p className="mb-4 inline-block rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1 text-xs font-semibold tracking-widest text-violet-600 dark:border-violet-800/50 dark:bg-violet-950/40 dark:text-violet-300">
          HI THERE, I&apos;M
        </p>
        <h1 className="grad-text mb-5 text-6xl font-bold tracking-tight leading-tight">
          Zelinjin
        </h1>
        <p className="mb-10 max-w-lg text-xl leading-relaxed text-stone-600 dark:text-stone-400">
          I build things for the web and write about what I learn along the way.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/projects" className="btn-grad rounded-full px-6 py-2.5 text-sm font-semibold">
            See my work
          </Link>
          <Link href="/about" className="glass rounded-full px-6 py-2.5 text-sm font-semibold text-stone-700 transition-all hover:-translate-y-0.5 dark:text-stone-300">
            About me
          </Link>
        </div>
      </section>

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <section>
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-200">Recent posts</h2>
            <Link href="/blog" className="text-sm font-medium text-violet-600 hover:text-violet-800 dark:text-violet-400 transition-colors">
              All posts →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {recentPosts.map(post => <PostCard key={post.slug} {...post} />)}
          </div>
        </section>
      )}
    </div>
  )
}
