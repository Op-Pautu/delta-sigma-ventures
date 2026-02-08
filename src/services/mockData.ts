import { type User } from "./api"

// Mock data for local development
export const mockUsers: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "+1-555-0100",
    email: "john.doe@example.com",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    phoneNumber: "+1-555-0101",
    email: "jane.smith@example.com",
  },
]

let nextId = 3

export const mockApi = {
  async getUsers(): Promise<User[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    return [...mockUsers]
  },

  async createUser(user: User): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const newUser = { ...user, id: String(nextId++) }
    mockUsers.push(newUser)
    return newUser
  },

  async updateUser(id: string, user: User): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = mockUsers.findIndex((u) => u.id === id)
    if (index === -1) {
      throw new Error("User not found")
    }
    mockUsers[index] = { ...user, id }
    return mockUsers[index]
  },

  async deleteUser(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = mockUsers.findIndex((u) => u.id === id)
    if (index === -1) {
      throw new Error("User not found")
    }
    mockUsers.splice(index, 1)
  },
}
