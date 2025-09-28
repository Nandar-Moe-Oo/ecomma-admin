"use client"

import React, { createContext, useContext, useReducer, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_ERROR" }
  | { type: "LOGOUT" }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true }
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }
    case "LOGIN_ERROR":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }
    default:
      return state
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    // Check if user is logged in on app load
    const checkAuthStatus = () => {
      const savedUser = localStorage.getItem("adminUser")
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser)
          dispatch({ type: "LOGIN_SUCCESS", payload: user })
        } catch (error) {
          dispatch({ type: "LOGIN_ERROR" })
        }
      } else {
        dispatch({ type: "LOGIN_ERROR" })
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock authentication - in a real app, this would be an API call
      if (email === "admin@example.com" && password === "password") {
        const user: User = {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        }
        
        localStorage.setItem("adminUser", JSON.stringify(user))
        dispatch({ type: "LOGIN_SUCCESS", payload: user })
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      dispatch({ type: "LOGIN_ERROR" })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("adminUser")
    dispatch({ type: "LOGOUT" })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}