import { useState } from 'react'
import type { Booking } from '../../../types/booking'
import { Card } from '../../../components/common/ui/card'
import { Button } from '../../../components/common/ui/button'
import { Input } from '../../../components/common/ui/input'
import { BookingStatusBadge } from './BookingStatusBadge'

interface BookingDetailDrawerProps {
  booking: Booking
  onExtend?: (returnAt: string, couponCode?: string) => Promise<void>
}

export function BookingDetailDrawer({ booking, onExtend }: BookingDetailDrawerProps) {
  const [newReturnAt, setNewReturnAt] = useState('')
  const [couponCode, setCouponCode] = useState('')

  const canExtend = ['pending', 'confirmed', 'picked_up', 'active'].includes(booking.status)

  return (
    <Card>
      <h3 className="mb-3 text-lg font-bold">Booking Details</h3>
      <div className="grid gap-2 text-sm">
        <p>ID: {booking.id}</p>
        <p>Vehicle: {booking.vehicleId}</p>
        <p>Pickup: {new Date(booking.pickupAt).toLocaleString()}</p>
        <p>Return: {new Date(booking.returnAt).toLocaleString()}</p>
        <p>Total: ${booking.totalAmount}</p>
        <BookingStatusBadge status={booking.status} />
      </div>

      {canExtend && onExtend ? (
        <form
          className="mt-4 grid gap-2 md:grid-cols-3"
          onSubmit={async (event) => {
            event.preventDefault()
            await onExtend(newReturnAt, couponCode || undefined)
            setCouponCode('')
          }}
        >
          <Input type="datetime-local" value={newReturnAt} onChange={(event) => setNewReturnAt(event.target.value)} required />
          <Input placeholder="Coupon code (optional)" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} />
          <Button type="submit">Extend Booking</Button>
        </form>
      ) : null}
    </Card>
  )
}
