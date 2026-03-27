import { httpClient } from '../http/client'
import type { LoginPayload, RegisterPayload, UpdateProfilePayload, User, AuthTokens } from '../../types/auth'
import type { SuccessResponse } from '../../types/api'

export const authService = {
  async login(payload: LoginPayload) {
    const response = await httpClient.post<
      SuccessResponse<{ user: User; access_token: string; refresh_token: string }>
    >('/api/auth/login', payload)

    return {
      data: {
        user: response.data.data.user,
        tokens: {
          accessToken: response.data.data.access_token,
          refreshToken: response.data.data.refresh_token,
        },
      },
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async register(payload: RegisterPayload) {
    await httpClient.post<SuccessResponse<{ user: User }>>('/api/auth/register', payload)
    return this.login({ email: payload.email, password: payload.password })
  },
  async refresh(refreshToken: string) {
    const response = await httpClient.post<SuccessResponse<{ access_token: string }>>(
      '/api/auth/refresh',
      {},
      { headers: { Authorization: `Bearer ${refreshToken}` } },
    )

    return {
      data: {
        accessToken: response.data.data.access_token,
        refreshToken,
      } as AuthTokens,
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async me() {
    const response = await httpClient.get<SuccessResponse<{ user: User }>>('/api/auth/me')
    return {
      data: response.data.data.user,
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
  async updateMe(payload: UpdateProfilePayload) {
    const response = await httpClient.put<SuccessResponse<{ user: User }>>('/api/auth/me', payload)
    return {
      data: response.data.data.user,
      meta: response.data.meta,
      request_id: response.data.request_id,
    }
  },
}
