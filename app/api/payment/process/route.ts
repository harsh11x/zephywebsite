import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { plan, email, amount } = await request.json()

    // Redirect to Razorpay flow
    // This endpoint is kept for backward compatibility
    // New payments should use /api/payment/razorpay/create-order

    return NextResponse.json(
      {
        success: false,
        message: "Please use the new Razorpay payment flow",
        redirect: `/payment?plan=${plan}&email=${email}`,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Payment processing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Payment processing failed",
      },
      { status: 500 },
    )
  }
}
