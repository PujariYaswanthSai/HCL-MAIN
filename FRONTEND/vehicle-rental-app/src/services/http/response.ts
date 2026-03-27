import type { PaginatedResult, SuccessResponse } from '../../types/api'

export function unwrapResponse<T>(payload: SuccessResponse<T>): PaginatedResult<T> {
  return {
    data: payload.data,
    meta: payload.meta,
    request_id: payload.request_id,
  }
}
