import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Payment } from '../../../types/payment'
import { PaymentActionPanel } from '../components/PaymentActionPanel'
import { PaymentStatusCard } from '../components/PaymentStatusCard'
import { RefundActionPanel } from '../components/RefundActionPanel'

export function PaymentPage() {
  const { id: bookingId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [payment, setPayment] = useState<Payment | null>(null)

  if (!bookingId) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <PaymentActionPanel
        bookingId={bookingId}
        onPaid={(createdPayment) => {
          setPayment(createdPayment)
          navigate(`/invoice/${bookingId}`)
        }}
      />
      {payment ? (
        <div className="space-y-3">
          <PaymentStatusCard payment={payment} />
          <RefundActionPanel paymentId={payment.id} onRefunded={() => navigate('/admin/dashboard')} />
        </div>
      ) : null}
    </div>
  )
}
