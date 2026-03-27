import type { AdminAnalytics } from '../../../types/admin'
import { Card } from '../../../components/common/ui/card'

export function AnalyticsDashboardCards({ analytics }: { analytics: AdminAnalytics }) {
  const cards = [
    { label: 'Total Bookings', value: analytics.totalBookings },
    { label: 'Total Revenue', value: `$${analytics.totalRevenue}` },
    { label: 'Active Vehicles', value: analytics.activeVehicles },
    { label: 'Maintenance Alerts', value: analytics.maintenanceAlerts },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="p-4">
          <p className="text-sm text-[var(--muted)]">{card.label}</p>
          <p className="mt-1 text-2xl font-bold">{card.value}</p>
        </Card>
      ))}
    </div>
  )
}
