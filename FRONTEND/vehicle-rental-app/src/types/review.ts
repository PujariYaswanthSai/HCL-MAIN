export interface Review {
  id: string
  vehicleId: string
  userId: string
  rating: number
  comment: string
  createdAt: string
}

export interface CreateReviewPayload {
  bookingId: string
  rating: number
  comment: string
}
