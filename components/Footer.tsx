export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/40 dark:border-white/8">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6 text-sm text-stone-400 dark:text-stone-500">
        <span>
          © {new Date().getFullYear()} <span className="grad-text font-semibold">Zelinjin</span>
        </span>
        <div className="flex gap-5">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-stone-700 dark:hover:text-stone-200">GitHub</a>
          <a href="mailto:zj199807@gmail.com" className="transition-colors hover:text-stone-700 dark:hover:text-stone-200">Email</a>
        </div>
      </div>
    </footer>
  )
}
