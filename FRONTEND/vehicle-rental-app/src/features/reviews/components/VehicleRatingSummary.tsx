import type { Review } from '../../../types/review'
import { Card } from '../../../components/common/ui/card'

export function VehicleRatingSummary({ reviews }: { reviews: Review[] }) {
  const avg = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  return (
    <Card>
      <h3 className="mb-2 text-lg font-bold">Average Rating</h3>
      <p className="text-3xl font-extrabold text-blue-700">{avg.toFixed(1)}</p>
      <p className="text-sm text-[var(--muted)]">Based on {reviews.length} reviews</p>
    </Card>
  )
}
