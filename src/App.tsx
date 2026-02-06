import { useState, useEffect } from "react"
import { UserForm } from "./components/UserForm"
import { UserList } from "./components/UserList"
import { api, type User } from "./services/api"

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch users on mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getUsers()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (user: User) => {
    try {
      setLoading(true)
      setError(null)
      await api.createUser(user)
      await fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (user: User) => {
    try {
      setLoading(true)
      setError(null)
      if (user.id) {
        await api.updateUser(user.id, user)
        await fetchUsers()
        setEditingUser(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await api.deleteUser(id)
      await fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCancel = () => {
    setEditingUser(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">
            Simple CRUD application with extensible schema
          </p>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        )}

        <main>
          <UserForm
            key={editingUser?.id || "new"}
            onSubmit={editingUser ? handleUpdate : handleCreate}
            initialUser={editingUser}
            loading={loading}
            onCancel={handleCancel}
          />

          <UserList
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </main>
      </div>
    </div>
  )
}

export default App
