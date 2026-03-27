import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiErrorBanner } from '../../../components/common/ApiErrorBanner'
import { Button } from '../../../components/common/ui/button'
import { Card } from '../../../components/common/ui/card'
import { Input } from '../../../components/common/ui/input'
import { useAuth } from '../../../app/providers/AuthProvider'
import type { NormalizedApiError, Role } from '../../../types/api'

export function RegisterForm() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('customer')
  const [error, setError] = useState<NormalizedApiError | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      await register({ name, email, password, role })
      navigate('/vehicles')
    } catch (err) {
      setError(err as NormalizedApiError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md p-8">
      <h1 className="mb-2 text-3xl font-bold">Create Account</h1>
      <p className="mb-6 text-sm text-[var(--muted)]">Join the rental network in under a minute.</p>
      {error ? <ApiErrorBanner error={error} /> : null}
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <Input placeholder="Full name" value={name} onChange={(event) => setName(event.target.value)} />
        <Input placeholder="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <select
          className="h-11 w-full rounded-2xl border bg-white/80 px-3 text-sm dark:bg-slate-950/40"
          value={role}
          onChange={(event) => setRole(event.target.value as Role)}
        >
          <option value="customer">Customer</option>
          <option value="fleet_manager">Fleet Manager</option>
          <option value="admin">Admin</option>
        </select>
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
    </Card>
  )
}
