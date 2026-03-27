import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarCheck2,
  Car,
  ChartNoAxesCombined,
  CreditCard,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  Star,
  Wrench,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ReactElement } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'
import type { Role } from '../../types/api'
import { Button } from './ui/button'
import { ThemeToggle } from './ThemeToggle'

interface NavItem {
  label: string
  to: string
  icon: ReactElement
  roles: Role[]
}

const navItems: NavItem[] = [
  { label: 'Vehicles', to: '/vehicles', icon: <Car size={16} />, roles: ['customer', 'fleet_manager', 'admin'] },
  { label: 'Bookings', to: '/bookings', icon: <CalendarCheck2 size={16} />, roles: ['customer', 'fleet_manager', 'admin'] },
  { label: 'Payments', to: '/payments/demo', icon: <CreditCard size={16} />, roles: ['customer', 'admin'] },
  { label: 'Maintenance', to: '/fleet/maintenance', icon: <Wrench size={16} />, roles: ['fleet_manager', 'admin'] },
  { label: 'Pricing', to: '/admin/pricing', icon: <ShieldCheck size={16} />, roles: ['admin'] },
  { label: 'Reviews', to: '/reviews', icon: <Star size={16} />, roles: ['customer', 'fleet_manager', 'admin'] },
  { label: 'Dashboard', to: '/admin/dashboard', icon: <LayoutDashboard size={16} />, roles: ['admin'] },
  { label: 'Analytics', to: '/admin/users', icon: <ChartNoAxesCombined size={16} />, roles: ['admin'] },
]

export function AppShell() {
  const { role, user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const filteredMenu = useMemo(
    () => navItems.filter((item) => (role ? item.roles.includes(role) : false)),
    [role],
  )

  if (!role) {
    return <Outlet />
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px] gap-4 p-3 md:p-4">
      <aside className="glass hidden w-70 rounded-3xl p-4 md:block">
        <Link to="/" className="mb-6 block text-xl font-bold">
          Velocity Rentals
        </Link>
        <nav className="space-y-1">
          {filteredMenu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition ${
                  isActive ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-100' : 'hover:bg-white/50 dark:hover:bg-slate-900/40'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-[96vh] flex-1 flex-col gap-4">
        <header className="glass sticky top-2 z-20 flex items-center justify-between rounded-3xl px-4 py-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setOpen((v) => !v)}>
              <Menu size={18} /> Menu
            </Button>
            <p className="text-sm text-[var(--muted)]">Welcome, {user?.name || 'User'}</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="secondary" size="sm" asChild>
              <Link to="/profile">Profile</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </header>

        <AnimatePresence>
          {open ? (
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="glass rounded-3xl p-3 md:hidden"
            >
              {filteredMenu.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-3 py-2 text-sm hover:bg-white/60 dark:hover:bg-slate-900/50"
                >
                  {item.label}
                </NavLink>
              ))}
            </motion.nav>
          ) : null}
        </AnimatePresence>

        <main className="space-y-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
