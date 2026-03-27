import axios from 'axios'
import type { ErrorEnvelope, NormalizedApiError } from '../../types/api'

export function parseApiError(error: unknown): NormalizedApiError {
  if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
    const normalized = error as NormalizedApiError
    return {
      code: normalized.code || 'UNKNOWN_ERROR',
      message: normalized.message || 'Unexpected error occurred',
      details: normalized.details,
      request_id: normalized.request_id,
      status: normalized.status,
    }
  }

  if (error instanceof Error) {
    if (error.message.toLowerCase().includes('refresh token')) {
      return {
        code: 'AUTH_REQUIRED',
        message: 'Session expired. Please login again.',
      }
    }

    return {
      code: 'UNEXPECTED_ERROR',
      message: error.message || 'Unexpected error occurred',
    }
  }

  if (!axios.isAxiosError(error)) {
    return {
      code: 'UNKNOWN_ERROR',
      message: 'Unexpected error occurred',
    }
  }

  const data = error.response?.data as ErrorEnvelope | undefined
  const status = error.response?.status

  if (data?.error) {
    return {
      code: data.error.code,
      message: data.error.message,
      details: data.error.details,
      request_id: data.error.request_id,
      status,
    }
  }

  return {
    code: 'HTTP_ERROR',
    message: error.message,
    request_id: error.response?.headers?.['x-request-id'],
    status,
  }
}
