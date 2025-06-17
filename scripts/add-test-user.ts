import { createClient } from "@supabase/supabase-js"

// This script demonstrates how to add a test user to Supabase
// You would run this script once to create the test user

async function addTestUser() {
  // Initialize Supabase client with admin rights
  // In a real scenario, you would use service_role key from your Supabase dashboard
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase URL or service key")
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Create user with email and password
    const { data, error } = await supabase.auth.admin.createUser({
      email: "harshdevsingh2004@gmail.com",
      password: "Admin@123",
      email_confirm: true, // Auto-confirms the email
    })

    if (error) {
      console.error("Error creating user:", error.message)
      return
    }

    console.log("User created successfully:", data.user)

    // Optionally add user to a specific role or group
    if (data.user) {
      // Example: Add user metadata
      const { error: updateError } = await supabase.auth.admin.updateUserById(data.user.id, {
        user_metadata: { role: "admin" },
      })

      if (updateError) {
        console.error("Error updating user metadata:", updateError.message)
      } else {
        console.log("User metadata updated successfully")
      }
    }
  } catch (err) {
    console.error("Unexpected error:", err)
  }
}

// Execute the function
addTestUser()
