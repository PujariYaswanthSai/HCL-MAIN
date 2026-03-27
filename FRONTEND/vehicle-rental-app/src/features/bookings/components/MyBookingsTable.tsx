import { Link } from 'react-router-dom'
import type { Booking } from '../../../types/booking'
import { Button } from '../../../components/common/ui/button'
import { Card } from '../../../components/common/ui/card'
import { BookingStatusBadge } from './BookingStatusBadge'
import { CancelBookingButton } from './CancelBookingButton'

interface MyBookingsTableProps {
  bookings: Booking[]
  onRefresh: () => void
}

export function MyBookingsTable({ bookings, onRefresh }: MyBookingsTableProps) {
  return (
    <Card>
      <h3 className="mb-4 text-lg font-bold">My Bookings</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2">Booking</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b last:border-b-0">
                <td className="p-2">{booking.id}</td>
                <td className="p-2">${booking.totalAmount}</td>
                <td className="p-2"><BookingStatusBadge status={booking.status} /></td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" asChild>
                      <Link to={`/bookings/${booking.id}`}>View</Link>
                    </Button>
                    <CancelBookingButton bookingId={booking.id} onDone={onRefresh} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
