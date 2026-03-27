import { useState } from 'react'
import { paymentService } from '../../../services/api/paymentService'
import { Button } from '../../../components/common/ui/button'
import { Card } from '../../../components/common/ui/card'
import { PaymentMethodSelector } from './PaymentMethodSelector'
import type { Payment } from '../../../types/payment'

interface PaymentActionPanelProps {
  bookingId: string
  onPaid: (payment: Payment) => void
}

export function PaymentActionPanel({ bookingId, onPaid }: PaymentActionPanelProps) {
  const [method, setMethod] = useState('card')
  const [loading, setLoading] = useState(false)

  return (
    <Card>
      <h3 className="mb-3 text-lg font-bold">Payment</h3>
      <PaymentMethodSelector method={method} onChange={setMethod} />
      <Button
        className="mt-3 w-full"
        onClick={async () => {
          setLoading(true)
          try {
            const response = await paymentService.initiate({ bookingId, method })
            onPaid(response.data)
          } finally {
            setLoading(false)
          }
        }}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Pay Securely'}
      </Button>
    </Card>
  )
}
