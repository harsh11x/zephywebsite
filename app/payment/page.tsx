"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, CreditCard, Lock, CheckCircle, ArrowLeft, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

declare global {
  interface Window {
    Razorpay: any
  }
}

const BASE_AMOUNT = 1000; // Example INR amount, replace with your dynamic amount

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: 'USD',
  GB: 'GBP',
  AU: 'AUD',
  CA: 'CAD',
  SG: 'SGD',
  IN: 'INR',
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  // Add more as needed
};

export default function PaymentPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedPlan = searchParams.get("plan")
  const email = searchParams.get("email")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [userCountry, setUserCountry] = useState<string>('IN')
  const [currency, setCurrency] = useState<string>('INR')
  const [convertedAmount, setConvertedAmount] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!selectedPlan || selectedPlan === "free") {
      router.push("/pricing")
    }
  }, [selectedPlan, router])

  useEffect(() => {
    async function detectLocationAndConvert() {
      try {
        // Get user country by IP
        const geoRes = await fetch('https://ipapi.co/json/')
        const geoData = await geoRes.json()
        const countryCode = geoData.country_code || 'IN'
        setUserCountry(countryCode)
        const targetCurrency = COUNTRY_TO_CURRENCY[countryCode] || 'INR'
        setCurrency(targetCurrency)
        // Call backend to get converted amount
        const res = await fetch('/api/currency-convert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ countryCode, amount: BASE_AMOUNT }),
        })
        const data = await res.json()
        setConvertedAmount(data.convertedAmount)
      } catch (e) {
        setCurrency('INR')
        setConvertedAmount(BASE_AMOUNT.toString())
      } finally {
        setLoading(false)
      }
    }
    detectLocationAndConvert()
  }, [])

  const planDetails = {
    standard: {
      name: "Professional",
      price: 19.99,
      priceInr: 19.99 * 83, // Convert to INR
      period: "month",
      features: [
        "File upload limit: 1 GB per file",
        "Daily encryption limit: 50 files",
        "Daily decryption limit: 50 files",
        "Priority support",
        "Encryption analytics",
        "API access"
      ],
    },
    professional: {
      name: "Enterprise",
      price: 89.99,
      priceInr: 89.99 * 83, // Convert to INR
      period: "month",
      features: [
        "File upload limit: 10 GB per file",
        "Daily encryption limit: Unlimited",
        "Daily decryption limit: Unlimited",
        "24/7 support",
        "Advanced analytics",
        "Custom integrations",
        "Compliance reporting"
      ],
    },
  }

  const currentPlan = selectedPlan ? planDetails[selectedPlan as keyof typeof planDetails] : null

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(window.Razorpay)
        return
      }
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(window.Razorpay)
      script.onerror = () => reject(new Error("Failed to load Razorpay"))
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    setIsLoading(true)
    setError("")

    try {
      console.log("Starting payment process for plan:", selectedPlan)
      
      // Load Razorpay script
      await loadRazorpayScript()

      // Create order on server
      const orderResponse = await fetch("/api/payment/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: selectedPlan,
          email: email || user?.email,
          amount: currentPlan?.price,
        }),
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        console.error("Order creation failed:", errorData)
        throw new Error(errorData.error || "Failed to create payment order")
      }

      const orderData = await orderResponse.json()
      console.log("Order created successfully:", orderData)

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_d3VIQj77iWUG8r",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Zephyrn Securities",
        description: `${currentPlan?.name} Plan - ${currentPlan?.period} (₹${currentPlan?.priceInr.toLocaleString()})`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            console.log("Payment completed, verifying...")
            // Verify payment on server
            const verifyResponse = await fetch("/api/payment/razorpay/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            if (verifyResponse.ok) {
              console.log("Payment verified successfully")
              setPaymentSuccess(true)
              setTimeout(() => {
                router.push("/dashboard")
              }, 3000)
            } else {
              throw new Error("Payment verification failed")
            }
          } catch (err: any) {
            console.error("Payment verification error:", err)
            setError(err.message || "Payment verification failed")
          }
        },
        prefill: {
          email: email || user?.email,
        },
        theme: {
          color: "#000000",
          backdrop_color: "#000000",
          hide_topbar: false,
        },
        modal: {
          ondismiss: function() {
            console.log("Payment modal dismissed")
            setIsLoading(false)
          }
        }
      }

      console.log("Opening Razorpay checkout with options:", options)
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (err: any) {
      console.error("Payment error:", err)
      setError(err.message || "Payment failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <Card className="bg-black/20 border-white/10 backdrop-blur-sm max-w-md">
          <CardHeader>
            <CardTitle className="text-white">Invalid Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/60 mb-4">Please select a valid plan to continue.</p>
            <Link href="/pricing">
              <Button className="w-full bg-white text-black hover:bg-white/90">View Pricing Plans</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm max-w-md text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/10 rounded-full">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-white text-2xl">Payment Successful!</CardTitle>
              <CardDescription className="text-white/60">
                Welcome to Zephyrn Securities {currentPlan.name} plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white font-medium">{currentPlan.name} Plan</p>
                  <p className="text-white/60">
                    ${currentPlan.price}/{currentPlan.period}
                  </p>
                </div>
                <p className="text-white/60 text-sm">Redirecting to your dashboard in a few seconds...</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back button */}
          <div className="mb-6">
            <Link href="/auth">
              <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign Up
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plan Summary */}
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{currentPlan.name} Plan</span>
                    <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                      Monthly
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">
                    ${currentPlan.price}/{currentPlan.period}
                  </div>
                  <div className="text-sm text-white/60 mb-3">
                    ≈ ₹{currentPlan.priceInr.toLocaleString()}
                  </div>
                  {!loading && currency !== 'INR' && (
                    <div className="text-sm text-white/60 mb-3">
                      (~{convertedAmount} {currency})
                    </div>
                  )}
                  {loading && <div className="text-sm text-white/60 text-gray-400">Detecting your location and currency...</div>}
                  <ul className="space-y-2">
                    {currentPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-white/60">
                        <CheckCircle className="w-3 h-3 mr-2 text-white/40" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Subtotal (USD)</span>
                    <span className="text-white">${currentPlan.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-white/60">Subtotal (INR)</span>
                    <span className="text-white">₹{currentPlan.priceInr.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-white/60">Tax</span>
                    <span className="text-white">$0.00</span>
                  </div>
                  <div className="border-t border-white/10 mt-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Total (INR)</span>
                      <span className="text-white font-bold text-lg">₹{currentPlan.priceInr.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                      Payment will be processed in Indian Rupees (INR)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Secure Payment
                </CardTitle>
                <CardDescription className="text-white/60">
                  Complete your purchase with Razorpay
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2 text-sm text-white/60">
                  <Lock className="w-4 h-4" />
                  <span>Your payment is secured with SSL encryption</span>
                </div>

                {error && (
                  <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-300">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full bg-white text-black hover:bg-white/90 font-medium py-3"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay ₹{currentPlan.priceInr.toLocaleString()}
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-white/40">
                    By completing this purchase, you agree to our{" "}
                    <Link href="/terms" className="text-white/60 hover:text-white underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-white/60 hover:text-white underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
