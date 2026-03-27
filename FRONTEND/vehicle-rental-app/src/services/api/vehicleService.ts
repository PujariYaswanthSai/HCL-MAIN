import { httpClient } from '../http/client'
import type { SuccessResponse } from '../../types/api'
import type { AvailabilityPayload, Vehicle, VehicleFilters, VehicleUpsertPayload } from '../../types/vehicle'

type BackendVehicle = {
  id: number
  category_id: number
  registration_number: string
  make: string
  model: string
  year?: number
  fuel_type?: string
  seating_capacity?: number
  status: 'available' | 'booked' | 'maintenance'
  image_url?: string
  is_active: boolean
  category?: { id: number; name: string; base_price_per_hour: number }
}

function mapVehicle(vehicle: BackendVehicle): Vehicle {
  const baseHourly = vehicle.category?.base_price_per_hour ?? 2
  return {
    id: String(vehicle.id),
    name: `${vehicle.make} ${vehicle.model}`.trim(),
    make: vehicle.make,
    model: vehicle.model,
    categoryId: vehicle.category_id,
    registrationNumber: vehicle.registration_number,
    type: vehicle.category?.name ?? 'Vehicle',
    imageUrl: vehicle.image_url,
    location: 'Main Hub',
    pricePerDay: Math.round(baseHourly * 24),
    isAvailable: vehicle.status === 'available',
    transmission: 'Automatic',
    fuelType: vehicle.fuel_type,
  }
}

export const vehicleService = {
  async list(filters: VehicleFilters = {}) {
    const params = {
      page: filters.page,
      per_page: filters.limit ?? filters.per_page,
      status: filters.availableOnly ? 'available' : filters.status,
      query: filters.query,
      type: filters.type,
      category_id: filters.category_id,
      fuel_type: filters.fuel_type,
      seats: filters.seats,
      min_price: filters.minPrice,
      max_price: filters.maxPrice,
    }

    const response = await httpClient.get<SuccessResponse<{ items: BackendVehicle[] }>>('/api/vehicles', { params })

    const perPage = response.data.meta?.per_page ?? response.data.meta?.limit ?? filters.limit ?? 20
    const total = response.data.meta?.total ?? response.data.data.items.length

    return {
      data: response.data.data.items.map(mapVehicle),
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
    const response = await httpClient.get<SuccessResponse<{ vehicle: BackendVehicle }>>(`/api/vehicles/${id}`)
    return {
      data: mapVehicle(response.data.data.vehicle),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async checkAvailability(id: string, payload: AvailabilityPayload) {
    const response = await httpClient.get<SuccessResponse<{ is_available: boolean; status: string }>>(`/api/vehicles/${id}/availability`, {
      params: {
        pickup_time: payload.pickupAt,
        return_time: payload.returnAt,
      },
    })

    return {
      data: {
        available: response.data.data.is_available,
        status: response.data.data.status,
      },
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async create(payload: VehicleUpsertPayload) {
    const response = await httpClient.post<SuccessResponse<{ vehicle: BackendVehicle }>>('/api/vehicles', {
      category_id: payload.categoryId,
      registration_number: payload.registrationNumber,
      make: payload.make,
      model: payload.model,
      year: payload.year,
      fuel_type: payload.fuelType,
      seating_capacity: payload.seatingCapacity,
      image_url: payload.imageUrl,
    })

    return {
      data: mapVehicle(response.data.data.vehicle),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async update(id: string, payload: Partial<VehicleUpsertPayload>) {
    const response = await httpClient.put<SuccessResponse<{ vehicle: BackendVehicle }>>(`/api/vehicles/${id}`, {
      category_id: payload.categoryId,
      registration_number: payload.registrationNumber,
      make: payload.make,
      model: payload.model,
      year: payload.year,
      fuel_type: payload.fuelType,
      seating_capacity: payload.seatingCapacity,
      image_url: payload.imageUrl,
      status: payload.status,
    })

    return {
      data: mapVehicle(response.data.data.vehicle),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async updatePhoto(id: string, file?: File, imageUrl?: string) {
    if (file) {
      const formData = new FormData()
      formData.append('photo', file)

      const response = await httpClient.put<SuccessResponse<{ vehicle: BackendVehicle }>>(`/api/vehicles/${id}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      return {
        data: mapVehicle(response.data.data.vehicle),
        meta: response.data.meta,
        request_id: response.data.request_id,
      }
    }

    const response = await httpClient.put<SuccessResponse<{ vehicle: BackendVehicle }>>(`/api/vehicles/${id}/photo`, {
      image_url: imageUrl,
    })
    return {
      data: mapVehicle(response.data.data.vehicle),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async remove(id: string) {
    const response = await httpClient.delete<SuccessResponse<{ vehicle: BackendVehicle }>>(`/api/vehicles/${id}`)
    return {
      data: { id: String(response.data.data.vehicle.id) },
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
}
