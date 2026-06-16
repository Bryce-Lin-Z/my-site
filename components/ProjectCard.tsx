interface Project {
  title: string
  description: string
  tags: string[]
  github?: string
  demo?: string
}

export default function ProjectCard({ title, description, tags, github, demo }: Project) {
  return (
    <div className="glass group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <h3 className="mb-2 text-lg font-semibold text-stone-900 dark:text-stone-100">{title}</h3>
      <p className="mb-5 text-sm leading-relaxed text-stone-500 dark:text-stone-400">{description}</p>
      <div className="mb-5 flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="rounded-full bg-gradient-to-r from-violet-100 to-pink-100 px-3 py-0.5 text-xs font-medium text-violet-700 dark:from-violet-950/70 dark:to-pink-950/70 dark:text-violet-300">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex gap-4">
        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-stone-400 transition-colors hover:text-stone-800 dark:hover:text-stone-100">
            GitHub →
          </a>
        )}
        {demo && (
          <a href={demo} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-violet-600 transition-colors hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300">
            Live Demo →
          </a>
        )}
      </div>
    </div>
  )
}
