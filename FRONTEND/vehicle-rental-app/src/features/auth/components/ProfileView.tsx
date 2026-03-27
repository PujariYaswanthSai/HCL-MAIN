import { Mail, Phone, Shield } from 'lucide-react'
import type { User } from '../../../types/auth'
import { Card } from '../../../components/common/ui/card'

export function ProfileView({ user }: { user: User }) {
  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-sm text-[var(--muted)]">Manage your identity and contact details.</p>
      </div>
      <div className="grid gap-2 text-sm">
        <p className="flex items-center gap-2">
          <Mail size={14} /> {user.email}
        </p>
        <p className="flex items-center gap-2">
          <Phone size={14} /> {user.phone || 'Not added'}
        </p>
        <p className="flex items-center gap-2">
          <Shield size={14} /> Role: {user.role}
        </p>
      </div>
    </Card>
  )
}
