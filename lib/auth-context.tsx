"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { authApi, type UserProfile, type AuthTokens } from "./api"

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; message?: string }>
  googleLogin: (token: string) => Promise<{ success: boolean; message?: string }>
  githubLogin: (code: string) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function saveTokens(tokens: AuthTokens) {
  localStorage.setItem("accessToken", tokens.accessToken)
  localStorage.setItem("refreshToken", tokens.refreshToken)
  localStorage.setItem("tokenExpiry", String(Date.now() + tokens.expiresIn * 1000))
}

function clearTokens() {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("tokenExpiry")
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }

    const result = await authApi.getProfile()
    if (result.success && result.data) {
      setUser(result.data)
    } else {
      clearTokens()
      setUser(null)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    const result = await authApi.login(email, password)
    if (result.success && result.data) {
      saveTokens(result.data.tokens)
      setUser(result.data.user)
      return { success: true }
    }
    return { success: false, message: result.message }
  }

  const register = async (email: string, password: string, name: string) => {
    const result = await authApi.register(email, password, name)
    if (result.success && result.data) {
      saveTokens(result.data.tokens)
      setUser(result.data.user)
      return { success: true }
    }
    return { success: false, message: result.message }
  }

  const googleLogin = async (token: string) => {
    const result = await authApi.googleAuth(token)
    if (result.success && result.data) {
      saveTokens(result.data.tokens)
      setUser(result.data.user)
      return { success: true }
    }
    return { success: false, message: result.message }
  }

  const githubLogin = async (code: string) => {
    const result = await authApi.githubAuth(code)
    if (result.success && result.data) {
      saveTokens(result.data.tokens)
      setUser(result.data.user)
      return { success: true }
    }
    return { success: false, message: result.message }
  }

  const logout = async () => {
    await authApi.logout()
    clearTokens()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        googleLogin,
        githubLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
