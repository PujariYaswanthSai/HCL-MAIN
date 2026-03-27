import { httpClient } from '../http/client'
import type { SuccessResponse } from '../../types/api'
import type { InitiatePaymentPayload, Payment } from '../../types/payment'

type BackendPayment = {
  id: number
  booking_id: number
  amount: number
  payment_method?: string
  status: 'pending' | 'success' | 'failed' | 'refunded'
  transaction_id?: string
  created_at: string
}

function mapPayment(payment: BackendPayment): Payment {
  return {
    id: String(payment.id),
    bookingId: String(payment.booking_id),
    amount: Number(payment.amount),
    method: payment.payment_method || 'card',
    transactionId: payment.transaction_id,
    status: payment.status,
    createdAt: payment.created_at,
  }
}

export const paymentService = {
  async initiate(payload: InitiatePaymentPayload) {
    const response = await httpClient.post<SuccessResponse<{ payment: BackendPayment }>>('/api/payments/initiate', {
      booking_id: Number(payload.bookingId),
      amount: 0,
      payment_method: payload.method,
    })

    return {
      data: mapPayment(response.data.data.payment),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async getById(id: string) {
    const response = await httpClient.get<SuccessResponse<{ payment: BackendPayment }>>(`/api/payments/${id}`)
    return {
      data: mapPayment(response.data.data.payment),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async refund(id: string, reason = 'Customer request') {
    const response = await httpClient.post<SuccessResponse<{ payment: BackendPayment }>>(`/api/payments/refund/${id}`, {
      reason,
    })
    return {
      data: mapPayment(response.data.data.payment),
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async getInvoice(id: string) {
    const response = await httpClient.get<SuccessResponse<{ invoice: Record<string, unknown> }>>(`/api/payments/invoice/${id}`)
    return {
      data: response.data.data,
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
}
