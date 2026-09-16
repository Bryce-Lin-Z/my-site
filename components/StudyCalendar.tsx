import { getAllPosts } from '@/lib/mdx'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function StudyCalendar({ tag }: { tag: string }) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const studiedDays = new Set(
    getAllPosts()
      .filter(post => post.tags.includes(tag))
      .map(post => new Date(post.date))
      .filter(d => d.getFullYear() === year && d.getMonth() === month)
      .map(d => d.getDate())
  )

  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="glass mb-12 rounded-2xl p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-200">{monthName}</h2>
        <p className="text-xs text-stone-400">{studiedDays.size} day{studiedDays.size === 1 ? '' : 's'} studied</p>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="text-xs font-medium text-stone-400 dark:text-stone-500">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />
          const done = studiedDays.has(day)
          const isToday = day === today.getDate()
          return (
            <div
              key={day}
              className={`flex aspect-square items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                done
                  ? 'bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-sm'
                  : isToday
                    ? 'ring-1 ring-violet-400 text-stone-500 dark:text-stone-400'
                    : 'text-stone-400 dark:text-stone-500'
              }`}
            >
              {done ? '✓' : day}
            </div>
          )
        })}
      </div>
    </div>
  )
}
