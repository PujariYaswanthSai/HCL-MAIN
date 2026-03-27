import { useState } from 'react'
import type { VehicleUpsertPayload } from '../../../types/vehicle'
import { Button } from '../../../components/common/ui/button'
import { Input } from '../../../components/common/ui/input'

interface VehicleFormProps {
  initial?: Partial<VehicleUpsertPayload>
  onSubmit: (payload: VehicleUpsertPayload) => Promise<void>
}

export function VehicleForm({ initial, onSubmit }: VehicleFormProps) {
  const [categoryId, setCategoryId] = useState(initial?.categoryId || 1)
  const [registrationNumber, setRegistrationNumber] = useState(initial?.registrationNumber || '')
  const [make, setMake] = useState(initial?.make || '')
  const [model, setModel] = useState(initial?.model || '')
  const [year, setYear] = useState(initial?.year || new Date().getFullYear())
  const [fuelType, setFuelType] = useState(initial?.fuelType || '')
  const [seatingCapacity, setSeatingCapacity] = useState(initial?.seatingCapacity || 4)
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || '')

  return (
    <form
      className="grid gap-3 md:grid-cols-2"
      onSubmit={async (event) => {
        event.preventDefault()
        await onSubmit({
          categoryId,
          registrationNumber,
          make,
          model,
          year,
          fuelType,
          seatingCapacity,
          imageUrl,
        })
      }}
    >
      <Input type="number" value={categoryId} onChange={(event) => setCategoryId(Number(event.target.value))} placeholder="Category ID" />
      <Input value={registrationNumber} onChange={(event) => setRegistrationNumber(event.target.value)} placeholder="Registration Number" />
      <Input value={make} onChange={(event) => setMake(event.target.value)} placeholder="Make" />
      <Input value={model} onChange={(event) => setModel(event.target.value)} placeholder="Model" />
      <Input
        type="number"
        value={year}
        onChange={(event) => setYear(Number(event.target.value))}
        placeholder="Year"
      />
      <Input value={fuelType} onChange={(event) => setFuelType(event.target.value)} placeholder="Fuel Type" />
      <Input type="number" value={seatingCapacity} onChange={(event) => setSeatingCapacity(Number(event.target.value))} placeholder="Seating Capacity" />
      <Input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="Image URL" />
      <Button className="md:col-span-2" type="submit">Save Vehicle</Button>
    </form>
  )
}
