import { useEffect, useState } from 'react'
import { maintenanceService } from '../../../services/api/maintenanceService'
import type { MaintenanceLog } from '../../../types/maintenance'
import { CompleteMaintenanceButton } from '../components/CompleteMaintenanceButton'
import { MaintenanceCreateForm } from '../components/MaintenanceCreateForm'
import { MaintenanceLogsTable } from '../components/MaintenanceLogsTable'
import { UpcomingMaintenanceWidget } from '../components/UpcomingMaintenanceWidget'
import { VehicleMaintenanceTimeline } from '../components/VehicleMaintenanceTimeline'

export function FleetMaintenancePage() {
  const [logs, setLogs] = useState<MaintenanceLog[]>([])
  const [upcoming, setUpcoming] = useState<MaintenanceLog[]>([])

  const load = async () => {
    const [logsResponse, upcomingResponse] = await Promise.all([
      maintenanceService.list({ page: 1, limit: 20 }),
      maintenanceService.upcoming(),
    ])
    setLogs(logsResponse.data)
    setUpcoming(upcomingResponse.data)
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <div className="space-y-4">
      <MaintenanceCreateForm onCreated={() => void load()} />
      <div className="grid gap-4 md:grid-cols-2">
        <MaintenanceLogsTable logs={logs} />
        <UpcomingMaintenanceWidget items={upcoming} />
      </div>
      <VehicleMaintenanceTimeline logs={logs} />
      <div className="glass rounded-3xl p-3">
        <h3 className="mb-2 text-lg font-bold">Quick Complete</h3>
        <div className="flex flex-wrap gap-2">
          {logs
            .filter((log) => log.status !== 'completed')
            .map((log) => (
              <CompleteMaintenanceButton key={log.id} id={log.id} onDone={() => void load()} />
            ))}
        </div>
      </div>
    </div>
  )
}
