import { httpClient } from '../http/client'
import type { SuccessResponse } from '../../types/api'
import type { CreateMaintenancePayload, MaintenanceLog } from '../../types/maintenance'

type BackendMaintenance = {
  id: number
  vehicle_id: number
  description: string
  scheduled_date?: string
  completion_date?: string
  status: 'scheduled' | 'in_progress' | 'completed'
}

function mapLog(log: BackendMaintenance): MaintenanceLog {
  return {
    id: String(log.id),
    vehicleId: String(log.vehicle_id),
    title: log.description,
    description: log.description,
    status: log.status,
    scheduledAt: log.scheduled_date || new Date().toISOString(),
    completedAt: log.completion_date,
  }
}

export const maintenanceService = {
  async list(params?: { page?: number; limit?: number }) {
    const response = await httpClient.get<SuccessResponse<{ maintenance_records: BackendMaintenance[] }>>('/api/maintenance', { params })
    return {
      data: response.data.data.maintenance_records.map(mapLog),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async create(payload: CreateMaintenancePayload) {
    const response = await httpClient.post<SuccessResponse<{ maintenance: BackendMaintenance }>>('/api/maintenance', {
      vehicle_id: Number(payload.vehicleId),
      description: payload.description || payload.title,
      scheduled_date: payload.scheduledAt || undefined,
      cost: payload.cost,
    })

    return {
      data: mapLog(response.data.data.maintenance),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async byVehicle(vehicleId: string) {
    const response = await httpClient.get<SuccessResponse<{ maintenance_records: BackendMaintenance[] }>>(`/api/maintenance/vehicle/${vehicleId}`)
    return {
      data: response.data.data.maintenance_records.map(mapLog),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async upcoming() {
    const response = await httpClient.get<SuccessResponse<{ upcoming_maintenance: BackendMaintenance[] }>>('/api/maintenance/upcoming')
    return {
      data: response.data.data.upcoming_maintenance.map(mapLog),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async complete(id: string) {
    const response = await httpClient.patch<SuccessResponse<{ maintenance: BackendMaintenance }>>(`/api/maintenance/${id}/complete`)
    return {
      data: mapLog(response.data.data.maintenance),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
}
