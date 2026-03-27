import { useState } from 'react'
import { Button } from '../../../components/common/ui/button'
import { Input } from '../../../components/common/ui/input'
import { Card } from '../../../components/common/ui/card'

export function PricingRuleForm({ onSubmit }: { onSubmit: (payload: { name: string; vehicleType: string; multiplier: number }) => Promise<void> }) {
  const [name, setName] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [multiplier, setMultiplier] = useState(1)

  return (
    <Card>
      <h3 className="mb-3 text-lg font-bold">Create Pricing Rule</h3>
      <form
        className="grid gap-2 md:grid-cols-3"
        onSubmit={async (event) => {
          event.preventDefault()
          await onSubmit({ name, vehicleType, multiplier })
          setName('')
          setVehicleType('')
          setMultiplier(1)
        }}
      >
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Rule name" />
        <Input value={vehicleType} onChange={(event) => setVehicleType(event.target.value)} placeholder="Vehicle type" />
        <Input type="number" step="0.1" value={multiplier} onChange={(event) => setMultiplier(Number(event.target.value))} />
        <Button className="md:col-span-3" type="submit">Save Rule</Button>
      </form>
    </Card>
  )
}
