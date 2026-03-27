import { Navigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import type { Role } from '../../types/api'
import type { ReactElement } from 'react'

interface RoleGuardProps {
  roles: Role[]
  children: ReactElement
}

export function RoleGuard({ roles, children }: RoleGuardProps) {
  const { role } = useAuth()

  if (!role || !roles.includes(role)) {
    return <Navigate to="/vehicles" replace />
  }

  return children
}
