import { paymentService } from '../../../services/api/paymentService'
import { Button } from '../../../components/common/ui/button'

export function RefundActionPanel({ paymentId, onRefunded }: { paymentId: string; onRefunded: () => void }) {
  return (
    <Button
      variant="danger"
      onClick={async () => {
        await paymentService.refund(paymentId)
        onRefunded()
      }}
    >
      Trigger Refund
    </Button>
  )
}
