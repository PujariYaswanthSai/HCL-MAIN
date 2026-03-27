import { httpClient } from '../http/client'
import type { SuccessResponse } from '../../types/api'
import type { AdminAnalytics, AdminUser } from '../../types/admin'

type BackendAdminUser = {
  id: number
  name: string
  email: string
  role: 'customer' | 'fleet_manager' | 'admin'
  phone?: string
}

type BackendAnalytics = {
  total_users: number
  total_vehicles: number
  total_bookings: number
  active_bookings: number
  completed_bookings: number
  total_revenue: number
}

export const adminService = {
  async users(params?: { page?: number; limit?: number }) {
    const response = await httpClient.get<SuccessResponse<{ users: BackendAdminUser[] }>>('/api/admin/users', { params })
    return {
      data: response.data.data.users.map(
        (user): AdminUser => ({
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
          status: 'active',
          phone: user.phone,
        }),
      ),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async analytics() {
    const response = await httpClient.get<SuccessResponse<{ analytics: BackendAnalytics }>>('/api/admin/analytics')
    const data = response.data.data.analytics
    const mapped: AdminAnalytics = {
      totalBookings: data.total_bookings,
      totalRevenue: data.total_revenue,
      activeVehicles: data.total_vehicles,
      maintenanceAlerts: Math.max(0, data.active_bookings - data.completed_bookings),
      dailyRevenue: [],
      totalUsers: data.total_users,
      completedBookings: data.completed_bookings,
    }

    return {
      data: mapped,
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
}
