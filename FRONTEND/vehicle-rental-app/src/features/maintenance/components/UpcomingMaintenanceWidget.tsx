import type { MaintenanceLog } from '../../../types/maintenance'
import { Card } from '../../../components/common/ui/card'

export function UpcomingMaintenanceWidget({ items }: { items: MaintenanceLog[] }) {
  return (
    <Card>
      <h3 className="mb-3 text-lg font-bold">Upcoming Alerts</h3>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id} className="glass rounded-2xl p-2">
            {item.vehicleId}: {item.title}
          </li>
        ))}
      </ul>
    </Card>
  )
}
