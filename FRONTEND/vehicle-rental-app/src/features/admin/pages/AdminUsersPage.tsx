import { useEffect, useState } from 'react'
import type { AdminUser } from '../../../types/admin'
import { adminService } from '../../../services/api/adminService'
import { AdminUsersTable } from '../components/AdminUsersTable'

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])

  useEffect(() => {
    const load = async () => {
      const response = await adminService.users({ page: 1, limit: 25 })
      setUsers(response.data)
    }
    void load()
  }, [])

  return <AdminUsersTable users={users} />
}
