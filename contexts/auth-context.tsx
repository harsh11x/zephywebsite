"use client"

import { createContext, useContext, useState, useEffect } from "react"
import {
  User,
  UserCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"

// Define the auth context type
type AuthContextType = {
  user: User | null
  loading: boolean
  userPlan: string
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<UserCredential>
  logout: () => Promise<void>
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null)

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userPlan, setUserPlan] = useState<string>("free")

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      if (user) {
        // Get user plan from localStorage or set default
        const savedPlan = localStorage.getItem(`userPlan_${user.uid}`)
        setUserPlan(savedPlan || "free")
      } else {
        setUserPlan("free")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Auth functions
  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return result
    } catch (error) {
      console.error("Error signing in with Google:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        userPlan,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
