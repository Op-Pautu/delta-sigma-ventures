import { type UserFormData } from "../config/fieldSchema"
import { mockApi } from "./mockData"

const API_URL = import.meta.env.VITE_API_URL || "/api"
const USE_MOCK = import.meta.env.DEV && !import.meta.env.VITE_API_URL

export interface User extends UserFormData {
  id?: string
  [key: string]: string | undefined
}

export const api = {
  async getUsers(): Promise<User[]> {
    if (USE_MOCK) return mockApi.getUsers()

    const response = await fetch(`${API_URL}/users`)
    if (!response.ok) throw new Error("Failed to fetch users")
    return response.json()
  },

  async createUser(user: User): Promise<User> {
    if (USE_MOCK) return mockApi.createUser(user)

    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
    if (!response.ok) throw new Error("Failed to create user")
    return response.json()
  },

  async updateUser(id: string, user: User): Promise<User> {
    if (USE_MOCK) return mockApi.updateUser(id, user)

    const response = await fetch(`${API_URL}/users?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
    if (!response.ok) throw new Error("Failed to update user")
    return response.json()
  },

  async deleteUser(id: string): Promise<void> {
    if (USE_MOCK) return mockApi.deleteUser(id)

    const response = await fetch(`${API_URL}/users?id=${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete user")
  },
}
