import { useState } from 'react'
import { maintenanceService } from '../../../services/api/maintenanceService'
import { Button } from '../../../components/common/ui/button'
import { Input } from '../../../components/common/ui/input'
import { Card } from '../../../components/common/ui/card'

export function MaintenanceCreateForm({ onCreated }: { onCreated: () => void }) {
  const [vehicleId, setVehicleId] = useState('')
  const [title, setTitle] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')

  return (
    <Card>
      <h3 className="mb-3 text-lg font-bold">Schedule Maintenance</h3>
      <form
        className="grid gap-2 md:grid-cols-3"
        onSubmit={async (event) => {
          event.preventDefault()
          await maintenanceService.create({ vehicleId, title, scheduledAt })
          onCreated()
        }}
      >
        <Input placeholder="Vehicle ID" value={vehicleId} onChange={(event) => setVehicleId(event.target.value)} />
        <Input placeholder="Task title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <Input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} />
        <Button className="md:col-span-3" type="submit">Create Task</Button>
      </form>
    </Card>
  )
}
