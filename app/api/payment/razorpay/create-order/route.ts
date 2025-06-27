import { NextResponse } from "next/server"
import Razorpay from "razorpay"

// Check if environment variables are set
const keyId = process.env.RAZORPAY_KEY_ID
const keySecret = process.env.RAZORPAY_KEY_SECRET

if (!keyId || !keySecret) {
  console.error("Razorpay environment variables not set!")
  console.error("RAZORPAY_KEY_ID:", keyId ? "SET" : "NOT SET")
  console.error("RAZORPAY_KEY_SECRET:", keySecret ? "SET" : "NOT SET")
}

const razorpay = new Razorpay({
  key_id: keyId || "rzp_test_d3VIQj77iWUG8r",
  key_secret: keySecret || "c00xCMjrvbF9VprzIRNIps3I",
})

export async function POST(request: Request) {
  try {
    const { plan, email, amount } = await request.json()

    // Validate required fields
    if (!plan || !email || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    console.log("Creating Razorpay order for:", { plan, email, amount })

    // Convert USD to INR (1 USD = ~83 INR as of 2024)
    // You can update this rate or fetch from an API
    const usdToInrRate = 83
    const amountInInr = Math.round(amount * usdToInrRate * 100) // Convert to paise

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountInInr, // Amount in paise (INR)
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        plan: plan,
        email: email,
        original_amount_usd: amount,
        conversion_rate: usdToInrRate,
      },
    })

    console.log("Razorpay order created:", order.id)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      originalAmountUSD: amount,
      amountInINR: amountInInr / 100,
    })
  } catch (error) {
    console.error("Razorpay order creation error:", error)
    return NextResponse.json(
      { error: "Failed to create payment order", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 