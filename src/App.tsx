import { useState, useEffect } from "react"
import { UserForm } from "./components/UserForm"
import { UserList } from "./components/UserList"
import { api, type User } from "./services/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { AlertCircle, Users } from "lucide-react"

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
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch users"
      setError(errorMsg)
      toast.error("Failed to load users", {
        description: errorMsg,
      })
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
      toast.success("User created successfully", {
        description: `${user.firstName} ${user.lastName} has been added.`,
      })
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to create user"
      setError(errorMsg)
      toast.error("Failed to create user", {
        description: errorMsg,
      })
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
        toast.success("User updated successfully", {
          description: `${user.firstName} ${user.lastName} has been updated.`,
        })
      } else {
        setError("Cannot update user without ID")
        toast.error("Update failed", {
          description: "User ID is missing",
        })
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update user"
      setError(errorMessage)
      toast.error("Failed to update user", {
        description: errorMessage,
      })
      // If user doesn't exist anymore, clear editing state
      if (errorMessage.includes("404") || errorMessage.includes("Not Found")) {
        setEditingUser(null)
      }
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
      // Clear editing state if we're deleting the user being edited
      if (editingUser?.id === id) {
        setEditingUser(null)
      }
      await fetchUsers()
      toast.success("User deleted successfully", {
        description: "The user has been removed from the system.",
      })
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to delete user"
      setError(errorMsg)
      toast.error("Failed to delete user", {
        description: errorMsg,
      })
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your users with ease • Schema-driven CRUD application
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <main className="space-y-8">
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

      {/* Footer */}
      <footer className="mt-16 py-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>Built with React, TypeScript, Tailwind CSS, and shadcn/ui</p>
          <p className="mt-1">
            Schema-driven architecture for easy extensibility
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
