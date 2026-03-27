import type { ReactNode } from 'react'
import { Notifier } from '../../components/common/Notifier'
import { AuthProvider } from './AuthProvider'
import { ThemeProvider } from './ThemeProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Notifier />
      </AuthProvider>
    </ThemeProvider>
  )
}
