"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestPaymentPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string>("")

  const testPlans = [
    { id: "free", name: "Free", price: 0 },
    { id: "standard", name: "Professional", price: 19.99 },
    { id: "professional", name: "Enterprise", price: 89.99 },
  ]

  const planDetails = {
    standard: {
      name: "Professional",
      price: 19.99,
      priceInr: 19.99 * 83,
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
      priceInr: 89.99 * 83,
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

  const handleTestPlan = (planId: string) => {
    setSelectedPlan(planId)
    router.push(`/auth?plan=${planId}`)
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="bg-black/20 border-white/10 max-w-md">
        <CardHeader>
          <CardTitle className="text-white">Test Payment Flow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-white/60">Select a plan to test the payment flow:</p>
          {testPlans.map((plan) => (
            <Button
              key={plan.id}
              onClick={() => handleTestPlan(plan.id)}
              className="w-full"
              variant={selectedPlan === plan.id ? "default" : "outline"}
            >
              {plan.name} - ${plan.price}
            </Button>
          ))}
          <div className="mt-4 p-4 bg-white/5 rounded">
            <p className="text-sm text-white/60">
              <strong>Instructions:</strong>
            </p>
            <ol className="text-sm text-white/60 mt-2 space-y-1">
              <li>1. Select a plan above</li>
              <li>2. You'll be redirected to auth page</li>
              <li>3. Try Google sign-in</li>
              <li>4. Check console for debugging info</li>
              <li>5. Should redirect to payment for paid plans</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 