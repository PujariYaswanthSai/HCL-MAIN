import { useEffect, useState } from 'react'
import type { PricingRule } from '../../../types/pricing'
import { pricingService } from '../../../services/api/pricingService'
import { PricingRuleForm } from '../components/PricingRuleForm'
import { PricingRulesTable } from '../components/PricingRulesTable'

export function AdminPricingPage() {
  const [rules, setRules] = useState<PricingRule[]>([])

  const load = async () => {
    const response = await pricingService.listRules()
    setRules(response.data)
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <div className="space-y-4">
      <PricingRuleForm
        onSubmit={async (payload) => {
          await pricingService.createRule(payload)
          await load()
        }}
      />
      <PricingRulesTable
        rules={rules}
        onDeactivate={(id) => {
          void pricingService.deleteRule(id).then(load)
        }}
      />
    </div>
  )
}
