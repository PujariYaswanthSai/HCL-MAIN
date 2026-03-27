import type { Payment } from '../../../types/payment'
import { Card } from '../../../components/common/ui/card'

export function PaymentStatusCard({ payment }: { payment: Payment }) {
  return (
    <Card>
      <h3 className="mb-2 text-lg font-bold">Payment Status</h3>
      <p className="text-sm">Transaction: {payment.id}</p>
      <p className="text-sm">Method: {payment.method}</p>
      <p className="text-sm">Status: {payment.status}</p>
      <p className="mt-2 text-xl font-bold text-blue-700">${payment.amount}</p>
    </Card>
  )
}
