import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/common/ui/button'

export function HomePage() {
  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-12">
      <section className="glass relative overflow-hidden rounded-[2rem] p-10 md:p-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="mb-2 text-sm font-semibold text-blue-700">Vehicle Rental Management Platform</p>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-6xl">Move fast with premium fleet operations</h1>
          <p className="mb-8 text-base text-[var(--muted)] md:text-lg">
            One platform for customers, fleet teams, and admins with booking, payments, maintenance, reviews, and analytics.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/auth/login">
                Get Started <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/vehicles">Explore Vehicles</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
