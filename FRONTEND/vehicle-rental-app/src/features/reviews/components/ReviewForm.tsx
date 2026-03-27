import { useState } from 'react'
import { reviewService } from '../../../services/api/reviewService'
import { Button } from '../../../components/common/ui/button'
import { Input } from '../../../components/common/ui/input'
import { Card } from '../../../components/common/ui/card'

export function ReviewForm({ onDone }: { onDone: () => void }) {
  const [bookingId, setBookingId] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  return (
    <Card>
      <h3 className="mb-3 text-lg font-bold">Write Review</h3>
      <form
        className="grid gap-2 md:grid-cols-3"
        onSubmit={async (event) => {
          event.preventDefault()
          await reviewService.create({ bookingId, rating, comment })
          onDone()
        }}
      >
        <Input placeholder="Booking ID" value={bookingId} onChange={(event) => setBookingId(event.target.value)} />
        <Input type="number" max={5} min={1} value={rating} onChange={(event) => setRating(Number(event.target.value))} />
        <Input placeholder="Comment" value={comment} onChange={(event) => setComment(event.target.value)} />
        <Button className="md:col-span-3" type="submit">Submit Review</Button>
      </form>
    </Card>
  )
}
