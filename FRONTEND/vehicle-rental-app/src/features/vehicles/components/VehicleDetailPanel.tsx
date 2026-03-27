import { Link } from 'react-router-dom'
import type { Vehicle } from '../../../types/vehicle'
import { Badge } from '../../../components/common/ui/badge'
import { Button } from '../../../components/common/ui/button'
import { Card } from '../../../components/common/ui/card'

export function VehicleDetailPanel({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card>
      <h2 className="text-2xl font-bold">{vehicle.name}</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">{vehicle.type} • {vehicle.transmission || 'Automatic'} • {vehicle.fuelType || 'Petrol'}</p>
      <div className="my-4 flex items-center gap-2">
        <Badge>{vehicle.isAvailable ? 'Available now' : 'Unavailable'}</Badge>
        <Badge>${vehicle.pricePerDay}/day</Badge>
      </div>
      <p className="mb-4 text-sm text-[var(--muted)]">Pickup location: {vehicle.location}</p>
      <Button asChild>
        <Link to="/bookings/new">Book this vehicle</Link>
      </Button>
    </Card>
  )
}
