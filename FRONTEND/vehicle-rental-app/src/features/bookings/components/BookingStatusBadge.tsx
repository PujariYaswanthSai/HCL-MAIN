import type { BookingStatus } from '../../../types/booking'
import { Badge } from '../../../components/common/ui/badge'

const statusColors: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-100',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-100',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-100',
  canceled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-100',
  picked_up: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-100',
  returned: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-100',
  active: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-100',
  completed: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-100',
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <Badge className={statusColors[status]}>{status.replace('_', ' ')}</Badge>
}
