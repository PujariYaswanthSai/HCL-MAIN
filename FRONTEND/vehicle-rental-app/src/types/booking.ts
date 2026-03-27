export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'canceled'
  | 'picked_up'
  | 'returned'
  | 'active'
  | 'completed'

export interface Booking {
  id: string
  vehicleId: string
  userId: string
  pickupAt: string
  returnAt: string
  status: BookingStatus
  totalAmount: number
}

export interface BookingEstimatePayload {
  vehicleId: string
  pickupAt: string
  returnAt: string
  couponCode?: string
}

export interface CreateBookingPayload extends BookingEstimatePayload {
  paymentMethod?: string
  pickupLocation?: string
}

export interface ExtendBookingPayload {
  returnAt: string
  couponCode?: string
}
