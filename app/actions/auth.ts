"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createUser, validateUser } from "@/lib/auth"

export async function signup(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const mobile = formData.get("mobile") as string

  if (!name || !email || !password) {
    return { error: "All fields are required" }
  }

  try {
    const user = await createUser(email, password, name, mobile)
    const cookieStore = await cookies()
    cookieStore.set("user", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    redirect("/dashboard")
  } catch (error) {
    return { error: "Failed to create account" }
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const user = await validateUser(email, password)
  if (!user) {
    return { error: "Invalid email or password" }
  }

  const cookieStore = await cookies()
  cookieStore.set("user", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  redirect("/dashboard")
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("user")
  redirect("/")
}
