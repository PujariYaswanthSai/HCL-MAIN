import type { MaintenanceLog } from '../../../types/maintenance'
import { Card } from '../../../components/common/ui/card'

export function VehicleMaintenanceTimeline({ logs }: { logs: MaintenanceLog[] }) {
  return (
    <Card>
      <h3 className="mb-3 text-lg font-bold">Vehicle Timeline</h3>
      <div className="space-y-3 border-l pl-3">
        {logs.map((log) => (
          <div key={log.id}>
            <p className="text-sm font-semibold">{log.title}</p>
            <p className="text-xs text-[var(--muted)]">{new Date(log.scheduledAt).toLocaleDateString()} • {log.status}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
