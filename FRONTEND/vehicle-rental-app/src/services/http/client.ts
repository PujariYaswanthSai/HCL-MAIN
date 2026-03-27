import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'
import { parseApiError } from './error'
import { tokenStorage } from './storage'
import type { SuccessResponse } from '../../types/api'

const baseURL = 'http://localhost:5000'

type RetriableConfig = AxiosRequestConfig & { _retry?: boolean }

const refreshClient = axios.create({ baseURL })

let isRefreshing = false
let pendingRequests: Array<(token: string | null) => void> = []

function onRefreshed(token: string | null) {
  pendingRequests.forEach((callback) => callback(token))
  pendingRequests = []
}

async function refreshAccessToken() {
  const refreshToken = tokenStorage.getRefreshToken()
  if (!refreshToken) {
    throw new Error('Missing refresh token')
  }

  const response = await refreshClient.post<SuccessResponse<{ access_token: string }>>(
    '/api/auth/refresh',
    {},
    { headers: { Authorization: `Bearer ${refreshToken}` } },
  )

  const accessToken = response.data.data.access_token
  tokenStorage.setTokens(accessToken, refreshToken)
  return accessToken
}

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status
    const originalRequest = error.config as RetriableConfig

    if (status === 401 && originalRequest && !originalRequest._retry) {
      const availableRefreshToken = tokenStorage.getRefreshToken()
      if (!availableRefreshToken) {
        tokenStorage.clear()
        throw parseApiError({
          code: 'AUTH_REQUIRED',
          message: 'Session expired. Please login again.',
          status: 401,
        })
      }

      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push((token) => {
            if (!token) {
              reject(parseApiError(error))
              return
            }

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            resolve(httpClient(originalRequest))
          })
        })
      }

      isRefreshing = true
      try {
        const newToken = await refreshAccessToken()
        onRefreshed(newToken)
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }
        return httpClient(originalRequest)
      } catch (refreshError) {
        onRefreshed(null)
        tokenStorage.clear()
        throw parseApiError(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    throw parseApiError(error)
  },
)
