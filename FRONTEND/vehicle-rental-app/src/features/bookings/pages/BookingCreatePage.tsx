import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { BookingCreateForm } from '../components/BookingCreateForm'
import { BookingEstimator } from '../components/BookingEstimator'
import { Card } from '../../../components/common/ui/card'

export function BookingCreatePage() {
  const navigate = useNavigate()
  const [estimate, setEstimate] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      <BookingEstimator onEstimated={setEstimate} />
      {estimate !== null ? (
        <Card>
          <p className="text-sm text-[var(--muted)]">Estimated amount</p>
          <p className="text-2xl font-bold">${estimate}</p>
        </Card>
      ) : null}
      <BookingCreateForm onCreated={(id) => navigate(`/payments/${id}`)} />
    </div>
  )
}
