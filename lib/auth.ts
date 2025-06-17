"use client"

import { User as FirebaseUser } from "firebase/auth"
import { create } from "zustand"

interface AuthState {
  user: FirebaseUser | null
  plan: string
  loading: boolean
  setUser: (user: FirebaseUser | null) => void
  setPlan: (plan: string) => void
  setLoading: (loading: boolean) => void
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  plan: "Free",
  loading: true,
  setUser: (user) => set({ user }),
  setPlan: (plan) => set({ plan }),
  setLoading: (loading) => set({ loading }),
}))

export { useAuthStore as useAuth }

// Helper function to get user's current plan
export const getUserPlan = async (userId: string): Promise<string> => {
  // Here you would fetch the user's plan from your backend
  // For now, we'll return a mock value
  return "Free"
}
