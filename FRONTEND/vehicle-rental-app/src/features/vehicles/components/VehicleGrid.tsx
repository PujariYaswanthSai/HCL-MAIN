import { EmptyState } from '../../../components/common/EmptyState'
import type { Vehicle } from '../../../types/vehicle'
import { VehicleCard } from './VehicleCard'

interface VehicleGridProps {
  vehicles: Vehicle[]
  onView: (id: string) => void
}

export function VehicleGrid({ vehicles, onView }: VehicleGridProps) {
  if (!vehicles.length) {
    return <EmptyState title="No vehicles found" description="Try changing filters or date range." />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} onView={() => onView(vehicle.id)} />
      ))}
    </div>
  )
}
