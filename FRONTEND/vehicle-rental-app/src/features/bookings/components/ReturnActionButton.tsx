import { bookingService } from '../../../services/api/bookingService'
import { Button } from '../../../components/common/ui/button'

export function ReturnActionButton({ bookingId, onDone }: { bookingId: string; onDone: () => void }) {
  return (
    <Button size="sm" variant="secondary" onClick={async () => { await bookingService.returnVehicle(bookingId); onDone() }}>
      Mark Return
    </Button>
  )
}
