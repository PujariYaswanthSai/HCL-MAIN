import { httpClient } from '../http/client'
import type { SuccessResponse } from '../../types/api'
import type { Booking, BookingEstimatePayload, CreateBookingPayload, ExtendBookingPayload } from '../../types/booking'

type BackendBooking = {
  id: number
  user_id: number
  vehicle_id: number
  pickup_time: string
  return_time: string
  total_price: number
  status: string
}

function normalizeStatus(status: string): Booking['status'] {
  if (status === 'canceled') return 'cancelled'
  if (status === 'active') return 'picked_up'
  if (status === 'completed') return 'returned'
  return status as Booking['status']
}

function mapBooking(booking: BackendBooking): Booking {
  return {
    id: String(booking.id),
    vehicleId: String(booking.vehicle_id),
    userId: String(booking.user_id),
    pickupAt: booking.pickup_time,
    returnAt: booking.return_time,
    status: normalizeStatus(booking.status),
    totalAmount: Number(booking.total_price),
  }
}

function toBackendStatus(status: string): string {
  if (status === 'cancelled') return 'canceled'
  if (status === 'picked_up') return 'active'
  if (status === 'returned') return 'completed'
  return status
}

export const bookingService = {
  async estimate(payload: BookingEstimatePayload) {
    const response = await httpClient.post<SuccessResponse<{ total_price: number }>>('/api/bookings/estimate', {
      vehicle_id: Number(payload.vehicleId),
      pickup_time: payload.pickupAt,
      return_time: payload.returnAt,
      coupon_code: payload.couponCode,
    })

    return {
      data: { estimatedAmount: Number(response.data.data.total_price) },
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async create(payload: CreateBookingPayload) {
    const response = await httpClient.post<SuccessResponse<{ booking: BackendBooking }>>('/api/bookings', {
      vehicle_id: Number(payload.vehicleId),
      pickup_time: payload.pickupAt,
      return_time: payload.returnAt,
      pickup_location: payload.pickupLocation || 'Main Hub',
      coupon_code: payload.couponCode,
    })

    return {
      data: mapBooking(response.data.data.booking),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async list(params?: { page?: number; limit?: number }) {
    const response = await httpClient.get<SuccessResponse<{ items: BackendBooking[] }>>('/api/bookings', {
      params: { page: params?.page, per_page: params?.limit },
    })

    const perPage = response.data.meta?.per_page ?? params?.limit ?? 20
    const total = response.data.meta?.total ?? response.data.data.items.length

    return {
      data: response.data.data.items.map(mapBooking),
      meta: {
        page: response.data.meta?.page ?? 1,
        limit: perPage,
        per_page: perPage,
        total,
        totalPages: Math.max(1, Math.ceil(total / perPage)),
      },
      request_id: response.data.request_id,
    }
  },
  async getById(id: string) {
    const response = await httpClient.get<SuccessResponse<{ booking: BackendBooking }>>(`/api/bookings/${id}`)
    return {
      data: mapBooking(response.data.data.booking),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async cancel(id: string) {
    const response = await httpClient.put<SuccessResponse<{ booking: BackendBooking }>>(`/api/bookings/${id}/cancel`)
    return {
      data: mapBooking(response.data.data.booking),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async pickup(id: string) {
    const response = await httpClient.put<SuccessResponse<{ booking: BackendBooking }>>(`/api/bookings/${id}/pickup`)
    return {
      data: mapBooking(response.data.data.booking),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async returnVehicle(id: string) {
    const response = await httpClient.put<SuccessResponse<{ booking: BackendBooking }>>(`/api/bookings/${id}/return`)
    return {
      data: mapBooking(response.data.data.booking),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async updateStatus(id: string, status: string) {
    const response = await httpClient.put<SuccessResponse<{ booking: BackendBooking }>>(`/api/bookings/${id}/status`, {
      status: toBackendStatus(status),
    })
    return {
      data: mapBooking(response.data.data.booking),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async extend(id: string, payload: ExtendBookingPayload) {
    const response = await httpClient.put<SuccessResponse<{ booking: BackendBooking }>>(`/api/bookings/${id}/extend`, {
      return_time: payload.returnAt,
      coupon_code: payload.couponCode,
    })
    return {
      data: mapBooking(response.data.data.booking),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
}
