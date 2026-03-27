import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import type { AdminAnalytics } from '../../../types/admin'
import { Card } from '../../../components/common/ui/card'

export function RevenueSummaryWidget({ analytics }: { analytics: AdminAnalytics }) {
  return (
    <Card>
      <h3 className="mb-3 text-lg font-bold">Revenue Trend</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={analytics.dailyRevenue}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#2563eb" fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
