import { useEffect, useState } from 'react'
import { bookingService } from '../../../services/api/bookingService'
import type { Booking } from '../../../types/booking'
import { MyBookingsTable } from '../components/MyBookingsTable'

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])

  const load = async () => {
    const response = await bookingService.list({ page: 1, limit: 20 })
    setBookings(response.data)
  }

  useEffect(() => {
    void load()
  }, [])

  return <MyBookingsTable bookings={bookings} onRefresh={() => void load()} />
}
