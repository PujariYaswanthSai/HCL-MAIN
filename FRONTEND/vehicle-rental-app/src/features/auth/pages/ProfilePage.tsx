import { ProfileEditForm } from '../components/ProfileEditForm'
import { ProfileView } from '../components/ProfileView'
import { useAuth } from '../../../app/providers/AuthProvider'

export function ProfilePage() {
  const { user } = useAuth()
  if (!user) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ProfileView user={user} />
      <ProfileEditForm user={user} />
    </div>
  )
}
