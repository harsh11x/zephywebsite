import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl) {
      return NextResponse.json(
        {
          error:
            "NEXT_PUBLIC_SUPABASE_URL environment variable is not set. Please configure your Supabase project URL.",
          setupUrl: "/setup",
        },
        { status: 500 },
      )
    }

    if (!supabaseServiceKey) {
      return NextResponse.json(
        {
          error:
            "SUPABASE_SERVICE_ROLE_KEY environment variable is not set. This key is required for admin operations.",
          setupUrl: "/setup",
        },
        { status: 500 },
      )
    }

    // Validate URL format
    if (!supabaseUrl.startsWith("https://") || !supabaseUrl.includes(".supabase.co")) {
      return NextResponse.json(
        {
          error: "Invalid Supabase URL format. Expected format: https://your-project.supabase.co",
          setupUrl: "/setup",
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Test the connection first
    const { data: testData, error: testError } = await supabase.auth.admin.listUsers()
    if (testError) {
      return NextResponse.json(
        {
          error: `Supabase connection failed: ${testError.message}. Please check your service role key.`,
          setupUrl: "/setup",
        },
        { status: 500 },
      )
    }

    // Create user with email and password
    const { data, error } = await supabase.auth.admin.createUser({
      email: "harshdevsingh2004@gmail.com",
      password: "Admin@123",
      email_confirm: true,
    })

    if (error) {
      return NextResponse.json(
        {
          error: `Failed to create user: ${error.message}`,
          setupUrl: "/setup",
        },
        { status: 400 },
      )
    }

    // Add user metadata
    if (data.user) {
      await supabase.auth.admin.updateUserById(data.user.id, {
        user_metadata: { role: "admin", full_name: "Admin User" },
      })
    }

    return NextResponse.json(
      {
        message: "Test user created successfully",
        userId: data.user?.id,
        email: "harshdevsingh2004@gmail.com",
        password: "Admin@123",
      },
      { status: 201 },
    )
  } catch (err) {
    console.error("Error creating test user:", err)
    return NextResponse.json(
      {
        error: "An unexpected error occurred while creating the test user. Please check your Supabase configuration.",
        setupUrl: "/setup",
      },
      { status: 500 },
    )
  }
}
