export type Role = 'customer' | 'fleet_manager' | 'admin'

export interface PaginationMeta {
  page: number
  limit: number
  per_page?: number
  total: number
  totalPages: number
}

export interface SuccessResponse<T> {
  success: boolean
  data: T
  meta?: PaginationMeta
  request_id: string
}

export interface ApiErrorDetail {
  field?: string
  issue?: string
  [key: string]: unknown
}

export interface ErrorEnvelope {
  error: {
    code: string
    message: string
    details?: ApiErrorDetail[] | Record<string, unknown>
    request_id: string
  }
}

export interface NormalizedApiError {
  code: string
  message: string
  details?: ApiErrorDetail[] | Record<string, unknown>
  request_id?: string
  status?: number
}

export interface PaginatedResult<T> {
  data: T
  meta?: PaginationMeta
  request_id?: string
}
