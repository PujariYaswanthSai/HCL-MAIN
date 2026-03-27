import type { AdminUser } from '../../../types/admin'
import { Card } from '../../../components/common/ui/card'

export function AdminUsersTable({ users }: { users: AdminUser[] }) {
  return (
    <Card>
      <h3 className="mb-3 text-lg font-bold">Platform Users</h3>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b last:border-b-0">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
