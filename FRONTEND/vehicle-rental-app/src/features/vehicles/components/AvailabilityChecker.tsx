import { useState } from 'react'
import { vehicleService } from '../../../services/api/vehicleService'
import { Button } from '../../../components/common/ui/button'
import { Input } from '../../../components/common/ui/input'
import { Card } from '../../../components/common/ui/card'

export function AvailabilityChecker({ vehicleId }: { vehicleId: string }) {
  const [pickupAt, setPickupAt] = useState('')
  const [returnAt, setReturnAt] = useState('')
  const [result, setResult] = useState<boolean | null>(null)

  const check = async () => {
    if (!pickupAt || !returnAt) {
      return
    }
    const response = await vehicleService.checkAvailability(vehicleId, { pickupAt, returnAt })
    setResult(response.data.available)
  }

  return (
    <Card>
      <h3 className="mb-3 text-lg font-bold">Availability Checker</h3>
      <div className="grid gap-2 md:grid-cols-3">
        <Input type="datetime-local" value={pickupAt} onChange={(event) => setPickupAt(event.target.value)} />
        <Input type="datetime-local" value={returnAt} onChange={(event) => setReturnAt(event.target.value)} />
        <Button onClick={check}>Check</Button>
      </div>
      {result !== null ? <p className="mt-3 text-sm font-semibold">{result ? 'Vehicle is available' : 'Vehicle is unavailable'}</p> : null}
    </Card>
  )
}
