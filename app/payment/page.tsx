"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, CreditCard, Lock, CheckCircle, ArrowLeft, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function PaymentPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedPlan = searchParams.get("plan")
  const email = searchParams.get("email")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    if (!selectedPlan || selectedPlan === "free") {
      router.push("/pricing")
    }
  }, [selectedPlan, router])

  const planDetails = {
    standard: {
      name: "Standard",
      price: 9.99,
      period: "month",
      features: ["1 GB upload limit", "20 encryptions/day", "Priority support", "Encryption history"],
    },
    professional: {
      name: "Professional",
      price: 29.99,
      period: "month",
      features: ["3 GB upload limit", "50 encryptions/day", "24/7 support", "Advanced analytics", "API access"],
    },
  }

  const currentPlan = selectedPlan ? planDetails[selectedPlan as keyof typeof planDetails] : null

  const handlePayment = async (formData: FormData) => {
    setIsLoading(true)
    setError("")

    try {
      const cardNumber = formData.get("cardNumber") as string
      const expiryDate = formData.get("expiryDate") as string
      const cvv = formData.get("cvv") as string
      const cardName = formData.get("cardName") as string

      if (!cardNumber || !expiryDate || !cvv || !cardName) {
        setError("Please fill in all payment details")
        return
      }

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real implementation, you would integrate with Stripe, PayPal, etc.
      // For now, we'll simulate a successful payment
      const response = await fetch("/api/payment/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: selectedPlan,
          email: email,
          amount: currentPlan?.price,
          cardNumber: cardNumber.slice(-4), // Only send last 4 digits
        }),
      })

      if (response.ok) {
        setPaymentSuccess(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
      } else {
        throw new Error("Payment processing failed")
      }
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-black/20 border-slate-700 backdrop-blur-sm max-w-md">
          <CardHeader>
            <CardTitle className="text-white">Invalid Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">Please select a valid plan to continue.</p>
            <Link href="/pricing">
              <Button className="w-full">View Pricing Plans</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-black/20 border-slate-700 backdrop-blur-sm max-w-md text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-900/30 rounded-full">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                </div>
              </div>
              <CardTitle className="text-white text-2xl">Payment Successful!</CardTitle>
              <CardDescription className="text-slate-300">
                Welcome to Zephyrn Securities {currentPlan.name} plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-white font-medium">{currentPlan.name} Plan</p>
                  <p className="text-slate-300">
                    ${currentPlan.price}/{currentPlan.period}
                  </p>
                </div>
                <p className="text-slate-300 text-sm">Redirecting to your dashboard in a few seconds...</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Back button */}
        <div className="mb-6">
          <Link href="/auth">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign Up
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <Card className="bg-black/20 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{currentPlan.name} Plan</span>
                  <Badge variant="secondary" className="bg-blue-900/30 text-blue-300">
                    Monthly
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-white mb-3">
                  ${currentPlan.price}/{currentPlan.period}
                </div>
                <ul className="space-y-2">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-slate-300">
                      <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-slate-600 pt-4">
                <div className="flex items-center justify-between text-lg font-bold text-white">
                  <span>Total</span>
                  <span>${currentPlan.price}</span>
                </div>
                <p className="text-slate-400 text-sm mt-1">Billed monthly • Cancel anytime</p>
              </div>

              <div className="flex items-center space-x-2 text-slate-300 text-sm">
                <Lock className="w-4 h-4" />
                <span>Secured by 256-bit SSL encryption</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="bg-black/20 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Details
              </CardTitle>
              <CardDescription className="text-slate-300">
                Enter your payment information to complete your subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handlePayment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName" className="text-white">
                    Cardholder Name
                  </Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    type="text"
                    placeholder="John Doe"
                    required
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="text-white">
                    Card Number
                  </Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                    className="bg-slate-800 border-slate-600 text-white"
                    onChange={(e) => {
                      // Format card number with spaces
                      let value = e.target.value.replace(/\s/g, "").replace(/\D/g, "")
                      value = value.replace(/(\d{4})(?=\d)/g, "$1 ")
                      e.target.value = value
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate" className="text-white">
                      Expiry Date
                    </Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                      className="bg-slate-800 border-slate-600 text-white"
                      onChange={(e) => {
                        // Format expiry date
                        let value = e.target.value.replace(/\D/g, "")
                        if (value.length >= 2) {
                          value = value.substring(0, 2) + "/" + value.substring(2, 4)
                        }
                        e.target.value = value
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="text-white">
                      CVV
                    </Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      type="text"
                      placeholder="123"
                      maxLength={4}
                      required
                      className="bg-slate-800 border-slate-600 text-white"
                      onChange={(e) => {
                        // Only allow numbers
                        e.target.value = e.target.value.replace(/\D/g, "")
                      }}
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-200">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Processing Payment..."
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Pay ${currentPlan.price}
                    </>
                  )}
                </Button>

                <p className="text-slate-400 text-xs text-center">
                  By completing this purchase, you agree to our Terms of Service and Privacy Policy. Your subscription
                  will automatically renew monthly.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
