import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import type { Booking } from '../../../types/booking'
import { bookingService } from '../../../services/api/bookingService'
import { BookingDetailDrawer } from '../components/BookingDetailDrawer'

export function BookingDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [booking, setBooking] = useState<Booking | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!id) {
        return
      }
      const response = await bookingService.getById(id)
      setBooking(response.data)
    }
    void load()
  }, [id])

  return booking ? (
    <BookingDetailDrawer
      booking={booking}
      onExtend={async (returnAt, couponCode) => {
        if (!id) {
          return
        }
        const response = await bookingService.extend(id, { returnAt, couponCode })
        setBooking(response.data)
        toast.success('Booking extended')
      }}
    />
  ) : null
}
