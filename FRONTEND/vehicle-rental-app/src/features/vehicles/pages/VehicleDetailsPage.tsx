import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ApiErrorBanner } from '../../../components/common/ApiErrorBanner'
import { LoadingState } from '../../../components/common/LoadingState'
import { vehicleService } from '../../../services/api/vehicleService'
import type { NormalizedApiError } from '../../../types/api'
import type { Vehicle } from '../../../types/vehicle'
import { AvailabilityChecker } from '../components/AvailabilityChecker'
import { VehicleDetailPanel } from '../components/VehicleDetailPanel'

export function VehicleDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [error, setError] = useState<NormalizedApiError | null>(null)

  useEffect(() => {
    const loadVehicle = async () => {
      if (!id) {
        return
      }
      try {
        const response = await vehicleService.getById(id)
        setVehicle(response.data)
      } catch (err) {
        setError(err as NormalizedApiError)
      }
    }
    void loadVehicle()
  }, [id])

  if (error) {
    return <ApiErrorBanner error={error} />
  }

  if (!vehicle) {
    return <LoadingState label="Loading vehicle details..." />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <VehicleDetailPanel vehicle={vehicle} />
      <AvailabilityChecker vehicleId={vehicle.id} />
    </div>
  )
}
