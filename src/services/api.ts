import { type UserFormData } from "../config/fieldSchema"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

export interface User extends UserFormData {
  id?: string
  [key: string]: string | undefined
}

export const api = {
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/users`)
    if (!response.ok) throw new Error("Failed to fetch users")
    return response.json()
  },

  async createUser(user: User): Promise<User> {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
    if (!response.ok) throw new Error("Failed to create user")
    return response.json()
  },

  async updateUser(id: string, user: User): Promise<User> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
    if (!response.ok) throw new Error("Failed to update user")
    return response.json()
  },

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete user")
  },
}
