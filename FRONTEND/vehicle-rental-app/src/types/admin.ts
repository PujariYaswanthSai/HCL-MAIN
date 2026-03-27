export interface AdminAnalytics {
  totalBookings: number
  totalRevenue: number
  activeVehicles: number
  maintenanceAlerts: number
  dailyRevenue: Array<{ date: string; value: number }>
  totalUsers?: number
  completedBookings?: number
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'customer' | 'fleet_manager' | 'admin'
  status: 'active' | 'inactive'
  phone?: string
}
