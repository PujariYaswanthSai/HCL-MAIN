import type { MaintenanceLog } from '../../../types/maintenance'
import { Card } from '../../../components/common/ui/card'

export function MaintenanceLogsTable({ logs }: { logs: MaintenanceLog[] }) {
  return (
    <Card>
      <h3 className="mb-3 text-lg font-bold">Maintenance Logs</h3>
      <div className="space-y-2 text-sm">
        {logs.map((log) => (
          <div key={log.id} className="glass rounded-2xl p-3">
            <p className="font-semibold">{log.title}</p>
            <p className="text-[var(--muted)]">{log.vehicleId} • {log.status}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
