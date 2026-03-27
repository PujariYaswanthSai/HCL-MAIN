import { useEffect, useState } from 'react'
import type { Review } from '../../../types/review'
import { reviewService } from '../../../services/api/reviewService'
import { ReviewForm } from '../components/ReviewForm'
import { ReviewsList } from '../components/ReviewsList'
import { VehicleRatingSummary } from '../components/VehicleRatingSummary'

export function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])

  const load = async () => {
    const response = await reviewService.list({ page: 1, limit: 20 })
    setReviews(response.data)
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <div className="space-y-4">
      <ReviewForm onDone={() => void load()} />
      <div className="grid gap-4 md:grid-cols-3">
        <VehicleRatingSummary reviews={reviews} />
        <div className="md:col-span-2">
          <ReviewsList reviews={reviews} />
        </div>
      </div>
    </div>
  )
}
