import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { authService } from '../../services/api/authService'
import { tokenStorage } from '../../services/http/storage'
import type { LoginPayload, RegisterPayload, UpdateProfilePayload, User } from '../../types/auth'
import type { Role } from '../../types/api'

interface AuthContextValue {
  user: User | null
  role: Role | null
  accessToken: string | null
  refreshTokenValue: string | null
  isAuthenticated: boolean
  isInitializing: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  getCurrentUser: () => Promise<void>
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(tokenStorage.getAccessToken())
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(tokenStorage.getRefreshToken())
  const [isInitializing, setIsInitializing] = useState(true)

  const getCurrentUser = useCallback(async () => {
    const response = await authService.me()
    setUser(response.data)
  }, [])

  const refreshToken = useCallback(async () => {
    const currentRefresh = tokenStorage.getRefreshToken()
    if (!currentRefresh) {
      throw new Error('No refresh token found')
    }
    const response = await authService.refresh(currentRefresh)
    tokenStorage.setTokens(response.data.accessToken, response.data.refreshToken)
    setAccessToken(response.data.accessToken)
    setRefreshTokenValue(response.data.refreshToken)
  }, [])

  useEffect(() => {
    const bootstrap = async () => {
      try {
        if (!tokenStorage.getRefreshToken()) {
          setIsInitializing(false)
          return
        }

        if (!tokenStorage.getAccessToken()) {
          await refreshToken()
        }
        await getCurrentUser()
      } catch {
        tokenStorage.clear()
        setUser(null)
        setAccessToken(null)
        setRefreshTokenValue(null)
      } finally {
        setIsInitializing(false)
      }
    }
    void bootstrap()
  }, [getCurrentUser, refreshToken])

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authService.login(payload)
    tokenStorage.setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken)
    setAccessToken(response.data.tokens.accessToken)
    setRefreshTokenValue(response.data.tokens.refreshToken)
    setUser(response.data.user)
    toast.success('Welcome back!')
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await authService.register(payload)
    tokenStorage.setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken)
    setAccessToken(response.data.tokens.accessToken)
    setRefreshTokenValue(response.data.tokens.refreshToken)
    setUser(response.data.user)
    toast.success('Account created successfully')
  }, [])

  const logout = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
    setAccessToken(null)
    setRefreshTokenValue(null)
    toast.info('Logged out')
  }, [])

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      const response = await authService.updateMe(payload)
      setUser(response.data)
      toast.success('Profile updated')
    },
    [],
  )

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      accessToken,
      refreshTokenValue,
      isAuthenticated: Boolean(user && accessToken),
      isInitializing,
      login,
      register,
      logout,
      refreshToken,
      getCurrentUser,
      updateProfile,
    }),
    [user, accessToken, refreshTokenValue, isInitializing, login, register, logout, refreshToken, getCurrentUser, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
