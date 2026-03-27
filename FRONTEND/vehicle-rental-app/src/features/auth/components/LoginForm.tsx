import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiErrorBanner } from '../../../components/common/ApiErrorBanner'
import { Button } from '../../../components/common/ui/button'
import { Card } from '../../../components/common/ui/card'
import { Input } from '../../../components/common/ui/input'
import { useAuth } from '../../../app/providers/AuthProvider'
import type { NormalizedApiError } from '../../../types/api'

export function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<NormalizedApiError | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!email || !password) {
      setError({ code: 'VALIDATION', message: 'Email and password are required' })
      return
    }

    try {
      setLoading(true)
      setError(null)
      await login({ email, password })
      navigate('/vehicles')
    } catch (err) {
      setError(err as NormalizedApiError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md p-8">
      <h1 className="mb-2 text-3xl font-bold">Welcome Back</h1>
      <p className="mb-6 text-sm text-[var(--muted)]">Log in to manage rentals and bookings.</p>
      {error ? <ApiErrorBanner error={error} /> : null}
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <Input placeholder="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </Card>
  )
}
