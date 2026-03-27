import { httpClient } from '../http/client'
import type { SuccessResponse } from '../../types/api'
import type { CreatePricingRulePayload, PricingRule } from '../../types/pricing'

type BackendPricingRule = {
  id: number
  name: string
  rule_type: 'seasonal' | 'weekend' | 'peak'
  category_id?: number | null
  multiplier: number
  is_active: boolean
}

function mapRule(rule: BackendPricingRule): PricingRule {
  return {
    id: String(rule.id),
    name: rule.name,
    vehicleType: rule.category_id ? `Category ${rule.category_id}` : 'All Categories',
    ruleType: rule.rule_type,
    categoryId: rule.category_id,
    multiplier: Number(rule.multiplier),
    isActive: rule.is_active,
  }
}

export const pricingService = {
  async listRules() {
    const response = await httpClient.get<SuccessResponse<{ rules: BackendPricingRule[] }>>('/api/pricing/rules')
    return {
      data: response.data.data.rules.map(mapRule),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async createRule(payload: CreatePricingRulePayload) {
    const response = await httpClient.post<SuccessResponse<{ rule: BackendPricingRule }>>('/api/pricing/rules', {
      name: payload.name,
      rule_type: payload.ruleType || 'seasonal',
      multiplier: payload.multiplier,
      category_id: payload.categoryId,
      description: payload.vehicleType,
    })
    return {
      data: mapRule(response.data.data.rule),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async updateRule(id: string, payload: Partial<CreatePricingRulePayload>) {
    const response = await httpClient.put<SuccessResponse<{ rule: BackendPricingRule }>>(`/api/pricing/rules/${id}`, {
      name: payload.name,
      rule_type: payload.ruleType,
      multiplier: payload.multiplier,
      category_id: payload.categoryId,
      description: payload.vehicleType,
    })
    return {
      data: mapRule(response.data.data.rule),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async deleteRule(id: string) {
    const response = await httpClient.delete<SuccessResponse<{ rule: BackendPricingRule }>>(`/api/pricing/rules/${id}`)
    return {
      data: { id: String(response.data.data.rule.id) },
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
}
