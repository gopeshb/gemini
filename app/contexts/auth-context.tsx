"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, otp: string) => Promise<boolean>
  signup: (email: string, name: string, otp: string) => Promise<boolean>
  logout: () => void
  sendOTP: (email: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem("gemini-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const sendOTP = async (email: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, this would send an actual OTP
    console.log(`OTP sent to ${email}: 123456`)
    return true
  }

  const login = async (email: string, otp: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check dummy OTP
    if (otp !== "123456") {
      return false
    }

    const userData: User = {
      id: Date.now().toString(),
      email,
      name: email.split("@")[0],
      createdAt: new Date(),
    }

    setUser(userData)
    localStorage.setItem("gemini-user", JSON.stringify(userData))
    return true
  }

  const signup = async (email: string, name: string, otp: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check dummy OTP
    if (otp !== "123456") {
      return false
    }

    const userData: User = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date(),
    }

    setUser(userData)
    localStorage.setItem("gemini-user", JSON.stringify(userData))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("gemini-user")
    localStorage.removeItem("gemini-chats")
    localStorage.removeItem("gemini-settings")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, sendOTP }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
