import type { Role } from './api'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  phone?: string
  license_number?: string
  licenseNumber?: string
  created_at?: string
  updated_at?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  role?: Role
}

export interface UpdateProfilePayload {
  name?: string
  phone?: string
  license_number?: string
}
