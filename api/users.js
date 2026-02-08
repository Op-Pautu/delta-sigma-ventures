// Simple in-memory storage (resets on each deployment)
let users = [
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

export default function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  )
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  const { id } = req.query

  // GET all users
  if (req.method === "GET" && !id) {
    return res.status(200).json(users)
  }

  // GET single user
  if (req.method === "GET" && id) {
    const user = users.find((u) => u.id === id)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    return res.status(200).json(user)
  }

  // POST - Create user
  if (req.method === "POST") {
    const newUser = {
      ...req.body,
      id: String(nextId++),
    }
    users.push(newUser)
    return res.status(201).json(newUser)
  }

  // PUT - Update user
  if (req.method === "PUT" && id) {
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) {
      return res.status(404).json({ error: "User not found" })
    }
    users[index] = { ...req.body, id }
    return res.status(200).json(users[index])
  }

  // DELETE - Delete user
  if (req.method === "DELETE" && id) {
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) {
      return res.status(404).json({ error: "User not found" })
    }
    users.splice(index, 1)
    return res.status(200).json({ message: "User deleted" })
  }

  return res.status(405).json({ error: "Method not allowed" })
}
