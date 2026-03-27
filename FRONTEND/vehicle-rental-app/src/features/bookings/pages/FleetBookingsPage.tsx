import { useEffect, useState } from 'react'
import { bookingService } from '../../../services/api/bookingService'
import type { Booking } from '../../../types/booking'
import { Card } from '../../../components/common/ui/card'
import { BookingStatusBadge } from '../components/BookingStatusBadge'
import { PickupActionButton } from '../components/PickupActionButton'
import { ReturnActionButton } from '../components/ReturnActionButton'
import { StatusUpdateMenu } from '../components/StatusUpdateMenu'

export function FleetBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])

  const load = async () => {
    const response = await bookingService.list({ page: 1, limit: 30 })
    setBookings(response.data)
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <Card>
      <h2 className="mb-4 text-xl font-bold">Fleet Booking Operations</h2>
      <div className="space-y-3">
        {bookings.map((booking) => (
          <div key={booking.id} className="glass flex flex-wrap items-center justify-between rounded-2xl p-3">
            <div>
              <p className="font-semibold">{booking.id}</p>
              <BookingStatusBadge status={booking.status} />
            </div>
            <div className="flex flex-wrap gap-2">
              <PickupActionButton bookingId={booking.id} onDone={() => void load()} />
              <ReturnActionButton bookingId={booking.id} onDone={() => void load()} />
              <StatusUpdateMenu bookingId={booking.id} onDone={() => void load()} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
