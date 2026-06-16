import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPost } from '@/lib/mdx'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/blog" className="mb-8 inline-flex items-center gap-1 text-sm text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors">
        ← Back to blog
      </Link>
      <header className="mb-10 mt-4">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <time className="text-xs text-stone-400">
            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
          {post.tags.map(tag => (
            <span key={tag} className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-600 dark:bg-violet-950/60 dark:text-violet-300">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="grad-text text-3xl font-bold tracking-tight">{post.title}</h1>
      </header>
      <div className="glass rounded-2xl p-8">
        <article className="prose text-stone-700 dark:text-stone-300">
          <MDXRemote source={post.content} />
        </article>
      </div>
    </div>
  )
}
