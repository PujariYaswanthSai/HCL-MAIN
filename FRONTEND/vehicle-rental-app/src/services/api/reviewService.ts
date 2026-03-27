import { httpClient } from '../http/client'
import type { SuccessResponse } from '../../types/api'
import type { CreateReviewPayload, Review } from '../../types/review'

type BackendReview = {
  id: number
  booking_id: number
  user_id: number
  vehicle_id: number
  rating: number
  comment?: string
  created_at: string
}

function mapReview(review: BackendReview): Review {
  return {
    id: String(review.id),
    vehicleId: String(review.vehicle_id),
    userId: String(review.user_id),
    rating: review.rating,
    comment: review.comment || '',
    createdAt: review.created_at,
  }
}

export const reviewService = {
  async list(params?: { page?: number; limit?: number }) {
    const response = await httpClient.get<SuccessResponse<{ reviews: BackendReview[] }>>('/api/reviews', { params })
    return {
      data: response.data.data.reviews.map(mapReview),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async create(payload: CreateReviewPayload) {
    const response = await httpClient.post<SuccessResponse<{ review: BackendReview }>>('/api/reviews', {
      booking_id: Number(payload.bookingId),
      rating: payload.rating,
      comment: payload.comment,
    })
    return {
      data: mapReview(response.data.data.review),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async byVehicle(vehicleId: string) {
    const response = await httpClient.get<SuccessResponse<{ reviews: BackendReview[] }>>(`/api/reviews/vehicle/${vehicleId}`)
    return {
      data: response.data.data.reviews.map(mapReview),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
}
