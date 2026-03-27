export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded'

export interface Payment {
  id: string
  bookingId: string
  amount: number
  method: string
  transactionId?: string
  status: PaymentStatus
  createdAt: string
}

export interface InitiatePaymentPayload {
  bookingId: string
  method: string
}
