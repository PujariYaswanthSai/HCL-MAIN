import { bookingService } from '../../../services/api/bookingService'

export function StatusUpdateMenu({ bookingId, onDone }: { bookingId: string; onDone: () => void }) {
  return (
    <select
      className="h-9 rounded-xl border bg-white/80 px-2 text-xs dark:bg-slate-900/40"
      defaultValue=""
      onChange={async (event) => {
        if (!event.target.value) {
          return
        }
        await bookingService.updateStatus(bookingId, event.target.value)
        onDone()
      }}
    >
      <option value="">Update status</option>
      <option value="confirmed">Confirmed</option>
      <option value="cancelled">Cancelled</option>
      <option value="active">Active</option>
      <option value="completed">Completed</option>
    </select>
  )
}
