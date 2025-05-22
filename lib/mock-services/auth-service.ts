import type { User } from "@/context/auth-context"

// Mock users database
const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@example.com",
    role: "user",
  },
]

// Mock credentials database (in a real app, passwords would be hashed)
const credentials: Record<string, string> = {
  "admin@example.com": "password123",
  "user@example.com": "password123",
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockAuthService = {
  async login(email: string, password: string): Promise<User> {
    await delay(800) // Simulate network delay

    // Check if user exists and password matches
    if (!credentials[email]) {
      throw new Error("User not found")
    }

    if (credentials[email] !== password) {
      throw new Error("Invalid password")
    }

    const user = users.find((u) => u.email === email)
    if (!user) {
      throw new Error("User not found")
    }

    // Store user in localStorage to persist session
    localStorage.setItem("currentUser", JSON.stringify(user))

    return user
  },

  async signup(name: string, email: string, password: string): Promise<User> {
    await delay(800) // Simulate network delay

    // Check if user already exists
    if (credentials[email]) {
      throw new Error("User already exists")
    }

    // Create new user
    const newUser: User = {
      id: `${users.length + 1}`,
      name,
      email,
      role: "user", // Default role is user
    }

    // Add user to mock database
    users.push(newUser)
    credentials[email] = password

    // Store user in localStorage to persist session
    localStorage.setItem("currentUser", JSON.stringify(newUser))

    return newUser
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(300) // Simulate network delay

    const userJson = localStorage.getItem("currentUser")
    if (!userJson) {
      return null
    }

    return JSON.parse(userJson)
  },

  logout(): void {
    localStorage.removeItem("currentUser")
  },

  async getAllUsers(): Promise<User[]> {
    await delay(500) // Simulate network delay
    return [...users]
  },

  async updateUserRole(userId: string, role: "admin" | "user"): Promise<User> {
    await delay(500) // Simulate network delay

    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) {
      throw new Error("User not found")
    }

    users[userIndex] = {
      ...users[userIndex],
      role,
    }

    // Update current user if it's the same user
    const currentUserJson = localStorage.getItem("currentUser")
    if (currentUserJson) {
      const currentUser = JSON.parse(currentUserJson)
      if (currentUser.id === userId) {
        localStorage.setItem("currentUser", JSON.stringify(users[userIndex]))
      }
    }

    return users[userIndex]
  },
}
