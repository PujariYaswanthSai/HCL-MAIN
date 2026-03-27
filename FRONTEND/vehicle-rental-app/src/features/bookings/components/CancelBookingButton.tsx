import { bookingService } from '../../../services/api/bookingService'
import { Button } from '../../../components/common/ui/button'

export function CancelBookingButton({ bookingId, onDone }: { bookingId: string; onDone: () => void }) {
  return (
    <Button
      size="sm"
      variant="danger"
      onClick={async () => {
        await bookingService.cancel(bookingId)
        onDone()
      }}
    >
      Cancel
    </Button>
  )
}
