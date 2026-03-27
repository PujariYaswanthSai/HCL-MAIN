import type { PricingRule } from '../../../types/pricing'
import { Card } from '../../../components/common/ui/card'

export function PricingRulesTable({ rules, onDeactivate }: { rules: PricingRule[]; onDeactivate: (id: string) => void }) {
  return (
    <Card>
      <h3 className="mb-3 text-lg font-bold">Pricing Rules</h3>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="p-2">Rule</th>
            <th className="p-2">Vehicle</th>
            <th className="p-2">Multiplier</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.id} className="border-b last:border-b-0">
              <td className="p-2">{rule.name}</td>
              <td className="p-2">{rule.vehicleType}</td>
              <td className="p-2">{rule.multiplier}</td>
              <td className="p-2">
                <button className="text-sm font-semibold text-red-600" onClick={() => onDeactivate(rule.id)}>
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
