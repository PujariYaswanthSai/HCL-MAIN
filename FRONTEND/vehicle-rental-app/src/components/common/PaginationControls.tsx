import { Button } from './ui/button'

interface PaginationControlsProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export function PaginationControls({ page, totalPages, onChange }: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="mt-4 flex items-center justify-end gap-2">
      <Button variant="secondary" size="sm" onClick={() => onChange(Math.max(page - 1, 1))} disabled={page === 1}>
        Previous
      </Button>
      <span className="text-sm text-[var(--muted)]">
        Page {page} / {totalPages}
      </span>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChange(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
      >
        Next
      </Button>
    </div>
  )
}
