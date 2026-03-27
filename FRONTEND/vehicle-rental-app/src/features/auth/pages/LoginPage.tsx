import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 p-4 md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden rounded-3xl bg-gradient-to-br from-blue-700 to-sky-500 p-10 text-white md:flex md:flex-col md:justify-between"
      >
        <h2 className="text-3xl font-bold">Drive smarter with Velocity</h2>
        <p className="max-w-sm text-white/90">Premium vehicle rental operations for customers, fleet teams, and admins.</p>
      </motion.div>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md">
          <LoginForm />
          <p className="mt-4 text-center text-sm text-[var(--muted)]">
            New here? <Link to="/auth/register" className="text-blue-600">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
