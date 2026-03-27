import { CircleOff } from 'lucide-react'

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="glass flex flex-col items-center rounded-3xl p-8 text-center">
      <CircleOff className="mb-3 h-8 w-8 text-[var(--muted)]" />
      <h3 className="mb-1 text-lg font-bold">{title}</h3>
      <p className="text-sm text-[var(--muted)]">{description}</p>
    </div>
  )
}
