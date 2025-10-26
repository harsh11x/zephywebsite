import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    const { username, mobileNumber, plan } = await request.json()
    
    // Get the authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    
    try {
      // Verify the Firebase token
      const decodedToken = await auth.verifyIdToken(token)
      const uid = decodedToken.uid

      // Update user profile in your database
      // For now, we'll just return success
      // In a real app, you'd update the user's profile in your database
      
      return NextResponse.json({ 
        success: true, 
        message: "Profile updated successfully" 
      })
    } catch (error) {
      console.error("Token verification error:", error)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
