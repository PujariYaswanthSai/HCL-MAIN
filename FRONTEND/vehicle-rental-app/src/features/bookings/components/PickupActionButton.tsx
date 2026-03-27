import { bookingService } from '../../../services/api/bookingService'
import { Button } from '../../../components/common/ui/button'

export function PickupActionButton({ bookingId, onDone }: { bookingId: string; onDone: () => void }) {
  return (
    <Button size="sm" onClick={async () => { await bookingService.pickup(bookingId); onDone() }}>
      Mark Pickup
    </Button>
  )
}
