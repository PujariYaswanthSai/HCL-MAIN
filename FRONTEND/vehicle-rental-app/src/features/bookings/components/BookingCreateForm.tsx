import { useState } from 'react'
import { bookingService } from '../../../services/api/bookingService'
import { Button } from '../../../components/common/ui/button'
import { Input } from '../../../components/common/ui/input'
import { Card } from '../../../components/common/ui/card'

export function BookingCreateForm({ onCreated }: { onCreated: (id: string) => void }) {
  const [vehicleId, setVehicleId] = useState('')
  const [pickupAt, setPickupAt] = useState('')
  const [returnAt, setReturnAt] = useState('')
  const [pickupLocation, setPickupLocation] = useState('Main Hub')
  const [couponCode, setCouponCode] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')

  return (
    <Card>
      <h3 className="mb-3 text-lg font-bold">Booking Create Form</h3>
      <form
        className="grid gap-2 md:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault()
          const response = await bookingService.create({
            vehicleId,
            pickupAt,
            returnAt,
            pickupLocation,
            paymentMethod,
            couponCode,
          })
          onCreated(response.data.id)
        }}
      >
        <Input placeholder="Vehicle ID" value={vehicleId} onChange={(event) => setVehicleId(event.target.value)} />
        <Input placeholder="Pickup location" value={pickupLocation} onChange={(event) => setPickupLocation(event.target.value)} />
        <select
          className="h-11 rounded-2xl border bg-white/80 px-3 text-sm dark:bg-slate-950/40"
          value={paymentMethod}
          onChange={(event) => setPaymentMethod(event.target.value)}
        >
          <option value="card">Card</option>
          <option value="upi">UPI</option>
          <option value="cash">Cash</option>
        </select>
        <Input type="datetime-local" value={pickupAt} onChange={(event) => setPickupAt(event.target.value)} />
        <Input type="datetime-local" value={returnAt} onChange={(event) => setReturnAt(event.target.value)} />
        <Input placeholder="Coupon code (optional)" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} />
        <Button className="md:col-span-2" type="submit">Create Booking</Button>
      </form>
    </Card>
  )
}
