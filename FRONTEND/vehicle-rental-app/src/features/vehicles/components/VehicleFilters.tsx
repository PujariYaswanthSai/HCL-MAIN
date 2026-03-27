import { Input } from '../../../components/common/ui/input'

interface VehicleFiltersProps {
  query: string
  type: string
  fuelType: string
  seats: string
  minPrice: string
  maxPrice: string
  onQueryChange: (query: string) => void
  onTypeChange: (type: string) => void
  onFuelTypeChange: (fuelType: string) => void
  onSeatsChange: (seats: string) => void
  onMinPriceChange: (minPrice: string) => void
  onMaxPriceChange: (maxPrice: string) => void
}

export function VehicleFilters({
  query,
  type,
  fuelType,
  seats,
  minPrice,
  maxPrice,
  onQueryChange,
  onTypeChange,
  onFuelTypeChange,
  onSeatsChange,
  onMinPriceChange,
  onMaxPriceChange,
}: VehicleFiltersProps) {
  return (
    <div className="glass grid gap-3 rounded-3xl p-4 md:grid-cols-3 xl:grid-cols-6">
      <Input placeholder="Search by name or location" value={query} onChange={(event) => onQueryChange(event.target.value)} />
      <select
        className="h-11 rounded-2xl border bg-white/80 px-3 text-sm dark:bg-slate-950/40"
        value={type}
        onChange={(event) => onTypeChange(event.target.value)}
      >
        <option value="">All Types</option>
        <option value="economy">Economy</option>
        <option value="comfort">Comfort</option>
        <option value="premium">Premium</option>
        <option value="suv">SUV</option>
      </select>
      <select
        className="h-11 rounded-2xl border bg-white/80 px-3 text-sm dark:bg-slate-950/40"
        value={fuelType}
        onChange={(event) => onFuelTypeChange(event.target.value)}
      >
        <option value="">Any Fuel</option>
        <option value="gas">Gas</option>
        <option value="diesel">Diesel</option>
        <option value="electric">Electric</option>
        <option value="hybrid">Hybrid</option>
      </select>
      <Input placeholder="Seats" type="number" min={1} value={seats} onChange={(event) => onSeatsChange(event.target.value)} />
      <Input placeholder="Min price/day" type="number" min={0} value={minPrice} onChange={(event) => onMinPriceChange(event.target.value)} />
      <Input placeholder="Max price/day" type="number" min={0} value={maxPrice} onChange={(event) => onMaxPriceChange(event.target.value)} />
    </div>
  )
}
