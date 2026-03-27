import { Link } from 'react-router-dom'
import { RegisterForm } from '../components/RegisterForm'

export function RegisterPage() {
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
        <p className="mt-4 text-center text-sm text-[var(--muted)]">
          Already have an account? <Link to="/auth/login" className="text-blue-600">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
