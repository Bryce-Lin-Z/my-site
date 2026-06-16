import Link from 'next/link'
import type { PostMeta } from '@/lib/mdx'

export default function PostCard({ slug, title, date, excerpt, tags }: PostMeta) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group glass block rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <time className="text-xs text-stone-400 dark:text-stone-500">
          {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </time>
        {tags.map(tag => (
          <span key={tag} className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-600 dark:bg-violet-950/60 dark:text-violet-300">
            {tag}
          </span>
        ))}
      </div>
      <h2 className="mb-2 text-lg font-semibold text-stone-900 transition-colors group-hover:text-violet-600 dark:text-stone-100 dark:group-hover:text-violet-400">
        {title}
      </h2>
      <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">{excerpt}</p>
    </Link>
  )
}
