import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Card } from '../../../components/common/ui/card'
import { vehicleService } from '../../../services/api/vehicleService'
import type { Vehicle } from '../../../types/vehicle'
import { VehicleForm } from '../components/VehicleForm'
import { VehicleManagementTable } from '../components/VehicleManagementTable'

export function FleetVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  const load = async () => {
    const response = await vehicleService.list({ limit: 20 })
    setVehicles(response.data)
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-4 text-xl font-bold">Add / Edit Vehicle</h2>
        <VehicleForm
          onSubmit={async (payload) => {
            await vehicleService.create(payload)
            toast.success('Vehicle saved')
            await load()
          }}
        />
      </Card>
      <VehicleManagementTable
        vehicles={vehicles}
        onDelete={async (id) => {
          await vehicleService.remove(id)
          toast.success('Vehicle removed')
          await load()
        }}
      />
    </div>
  )
}
