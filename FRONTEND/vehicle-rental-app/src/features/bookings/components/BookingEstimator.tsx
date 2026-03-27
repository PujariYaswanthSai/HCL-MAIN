import { useState } from 'react'
import { bookingService } from '../../../services/api/bookingService'
import { Button } from '../../../components/common/ui/button'
import { Input } from '../../../components/common/ui/input'
import { Card } from '../../../components/common/ui/card'

interface BookingEstimatorProps {
  onEstimated: (amount: number) => void
}

export function BookingEstimator({ onEstimated }: BookingEstimatorProps) {
  const [vehicleId, setVehicleId] = useState('')
  const [pickupAt, setPickupAt] = useState('')
  const [returnAt, setReturnAt] = useState('')
  const [couponCode, setCouponCode] = useState('')

  return (
    <Card>
      <h3 className="mb-3 text-lg font-bold">Booking Estimator</h3>
      <div className="grid gap-2 md:grid-cols-5">
        <Input placeholder="Vehicle ID" value={vehicleId} onChange={(event) => setVehicleId(event.target.value)} />
        <Input type="datetime-local" value={pickupAt} onChange={(event) => setPickupAt(event.target.value)} />
        <Input type="datetime-local" value={returnAt} onChange={(event) => setReturnAt(event.target.value)} />
        <Input placeholder="Coupon code (optional)" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} />
        <Button
          onClick={async () => {
            const response = await bookingService.estimate({ vehicleId, pickupAt, returnAt, couponCode })
            onEstimated(response.data.estimatedAmount)
          }}
        >
          Estimate
        </Button>
      </div>
    </Card>
  )
}
