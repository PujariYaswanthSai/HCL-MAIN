import type { Vehicle } from '../../../types/vehicle'
import { Button } from '../../../components/common/ui/button'
import { Card } from '../../../components/common/ui/card'

interface VehicleManagementTableProps {
  vehicles: Vehicle[]
  onDelete: (id: string) => Promise<void>
}

export function VehicleManagementTable({ vehicles, onDelete }: VehicleManagementTableProps) {
  return (
    <Card>
      <h3 className="mb-4 text-lg font-bold">Vehicle Management</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Type</th>
              <th className="p-2">Price/Day</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b last:border-b-0 hover:bg-slate-100/50 dark:hover:bg-slate-900/30">
                <td className="p-2">{vehicle.name}</td>
                <td className="p-2">{vehicle.type}</td>
                <td className="p-2">${vehicle.pricePerDay}</td>
                <td className="p-2">
                  <Button size="sm" variant="danger" onClick={() => void onDelete(vehicle.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
