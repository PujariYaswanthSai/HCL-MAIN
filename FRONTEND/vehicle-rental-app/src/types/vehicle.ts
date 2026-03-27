export interface Vehicle {
  id: string
  name: string
  type: string
  make?: string
  model?: string
  categoryId?: number
  registrationNumber?: string
  imageUrl?: string
  location: string
  pricePerDay: number
  rating?: number
  isAvailable: boolean
  transmission?: string
  fuelType?: string
}

export interface VehicleFilters {
  page?: number
  limit?: number
  per_page?: number
  query?: string
  type?: string
  minPrice?: number
  maxPrice?: number
  availableOnly?: boolean
  category_id?: number
  fuel_type?: string
  seats?: number
  status?: string
}

export interface AvailabilityPayload {
  pickupAt: string
  returnAt: string
}

export interface VehicleUpsertPayload {
  categoryId: number
  registrationNumber: string
  make: string
  model: string
  year?: number
  fuelType?: string
  seatingCapacity?: number
  imageUrl?: string
  status?: 'available' | 'booked' | 'maintenance'
}
