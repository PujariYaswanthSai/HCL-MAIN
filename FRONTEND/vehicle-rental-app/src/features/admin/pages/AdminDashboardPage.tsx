import { useEffect, useState } from 'react'
import { adminService } from '../../../services/api/adminService'
import type { AdminAnalytics } from '../../../types/admin'
import { AnalyticsDashboardCards } from '../components/AnalyticsDashboardCards'
import { RevenueSummaryWidget } from '../components/RevenueSummaryWidget'

const emptyAnalytics: AdminAnalytics = {
  totalBookings: 0,
  totalRevenue: 0,
  activeVehicles: 0,
  maintenanceAlerts: 0,
  dailyRevenue: [],
}

export function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics>(emptyAnalytics)

  useEffect(() => {
    const load = async () => {
      const response = await adminService.analytics()
      setAnalytics(response.data)
    }
    void load()
  }, [])

  return (
    <div className="space-y-4">
      <AnalyticsDashboardCards analytics={analytics} />
      <RevenueSummaryWidget analytics={analytics} />
    </div>
  )
}
