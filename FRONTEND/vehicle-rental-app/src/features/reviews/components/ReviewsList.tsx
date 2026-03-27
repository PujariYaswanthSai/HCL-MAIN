import type { Review } from '../../../types/review'
import { Card } from '../../../components/common/ui/card'

export function ReviewsList({ reviews }: { reviews: Review[] }) {
  return (
    <Card>
      <h3 className="mb-3 text-lg font-bold">Reviews</h3>
      <div className="space-y-2">
        {reviews.map((review) => (
          <div key={review.id} className="glass rounded-2xl p-3">
            <p className="text-sm font-semibold">Rating: {review.rating}/5</p>
            <p className="text-sm text-[var(--muted)]">{review.comment}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
