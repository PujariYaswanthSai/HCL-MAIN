import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiErrorBanner } from '../../../components/common/ApiErrorBanner'
import { LoadingState } from '../../../components/common/LoadingState'
import { PaginationControls } from '../../../components/common/PaginationControls'
import { vehicleService } from '../../../services/api/vehicleService'
import type { NormalizedApiError } from '../../../types/api'
import type { Vehicle } from '../../../types/vehicle'
import { VehicleFilters } from '../components/VehicleFilters'
import { VehicleGrid } from '../components/VehicleGrid'

export function VehiclesPage() {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<NormalizedApiError | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const [fuelType, setFuelType] = useState('')
  const [seats, setSeats] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        const response = await vehicleService.list({
          page,
          limit: 9,
          query,
          type,
          fuel_type: fuelType || undefined,
          seats: seats ? Number(seats) : undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
        })
        setVehicles(response.data)
        setTotalPages(response.meta?.totalPages || 1)
      } catch (err) {
        setError(err as NormalizedApiError)
      } finally {
        setLoading(false)
      }
    }
    void fetchVehicles()
  }, [page, query, type, fuelType, seats, minPrice, maxPrice])

  return (
    <div className="space-y-4">
      <VehicleFilters
        query={query}
        type={type}
        fuelType={fuelType}
        seats={seats}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onQueryChange={setQuery}
        onTypeChange={setType}
        onFuelTypeChange={setFuelType}
        onSeatsChange={setSeats}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
      />
      {error ? <ApiErrorBanner error={error} /> : null}
      {loading ? <LoadingState label="Loading vehicles..." /> : <VehicleGrid vehicles={vehicles} onView={(id) => navigate(`/vehicles/${id}`)} />}
      <PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  )
}
