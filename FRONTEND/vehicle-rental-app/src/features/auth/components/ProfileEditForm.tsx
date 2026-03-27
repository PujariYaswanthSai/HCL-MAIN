import { useState } from 'react'
import { Button } from '../../../components/common/ui/button'
import { Card } from '../../../components/common/ui/card'
import { Input } from '../../../components/common/ui/input'
import { useAuth } from '../../../app/providers/AuthProvider'
import type { User } from '../../../types/auth'

export function ProfileEditForm({ user }: { user: User }) {
  const { updateProfile } = useAuth()
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone || '')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      await updateProfile({ name, phone })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <h3 className="mb-3 text-lg font-bold">Edit Profile</h3>
      <form className="space-y-3" onSubmit={onSubmit}>
        <Input value={name} onChange={(event) => setName(event.target.value)} />
        <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone" />
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Card>
  )
}
