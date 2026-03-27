export interface PricingRule {
  id: string
  name: string
  vehicleType: string
  ruleType?: 'seasonal' | 'weekend' | 'peak'
  categoryId?: number | null
  multiplier: number
  isActive: boolean
}

export interface CreatePricingRulePayload {
  name: string
  vehicleType: string
  ruleType?: 'seasonal' | 'weekend' | 'peak'
  categoryId?: number
  multiplier: number
}
