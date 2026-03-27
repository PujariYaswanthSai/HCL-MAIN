export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed'

export interface MaintenanceLog {
  id: string
  vehicleId: string
  title: string
  description?: string
  status: MaintenanceStatus
  scheduledAt: string
  completedAt?: string
}

export interface CreateMaintenancePayload {
  vehicleId: string
  title: string
  description?: string
  scheduledAt: string
  cost?: number
}
