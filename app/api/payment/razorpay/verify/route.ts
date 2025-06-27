import { NextResponse } from "next/server"
import crypto from "crypto"

// Check if environment variables are set
const keySecret = process.env.RAZORPAY_KEY_SECRET

if (!keySecret) {
  console.error("Razorpay key secret not set!")
}

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification details" },
        { status: 400 }
      )
    }

    console.log("Verifying payment:", { razorpay_order_id, razorpay_payment_id })

    // Verify the payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const signature = crypto
      .createHmac("sha256", keySecret || "c00xCMjrvbF9VprzIRNIps3I")
      .update(text)
      .digest("hex")

    if (signature !== razorpay_signature) {
      console.error("Invalid payment signature")
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      )
    }

    console.log("Payment verified successfully")

    // Payment is verified, update user's subscription in database
    // Here you would typically:
    // 1. Update user's plan in Supabase
    // 2. Create subscription record
    // 3. Send confirmation email

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      message: "Payment verified successfully",
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: "Payment verification failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 