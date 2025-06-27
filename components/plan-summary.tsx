"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Crown } from "lucide-react"

interface PlanSummaryProps {
  planId: string
  className?: string
}

const planDetails = {
  free: {
    name: "Starter",
    price: "$0",
    period: "forever",
    icon: Shield,
    features: [
      "File upload limit: 100 MB per file",
      "Daily encryption limit: 3 files",
      "Daily decryption limit: 3 files",
      "Basic support"
    ],
  },
  standard: {
    name: "Professional",
    price: "$19.99",
    period: "per month",
    icon: Zap,
    features: [
      "File upload limit: 1 GB per file",
      "Daily encryption limit: 50 files",
      "Daily decryption limit: 50 files",
      "Priority support",
      "Analytics"
    ],
  },
  professional: {
    name: "Enterprise",
    price: "$89.99",
    period: "per month",
    icon: Crown,
    features: [
      "File upload limit: 10 GB per file",
      "Daily encryption limit: Unlimited",
      "Daily decryption limit: Unlimited",
      "24/7 support",
      "Custom integrations"
    ],
  },
}

export default function PlanSummary({ planId, className }: PlanSummaryProps) {
  const plan = planDetails[planId as keyof typeof planDetails]

  if (!plan) return null

  const IconComponent = plan.icon

  return (
    <Card className={`bg-white/5 border-white/10 ${className}`}>
      <CardHeader className="text-center p-6">
        <div className="p-3 bg-white/10 w-fit mx-auto mb-4 rounded-lg">
          <IconComponent className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-white text-lg">{plan.name} Plan</CardTitle>
        <div className="text-center">
          <span className="text-2xl font-light text-white">{plan.price}</span>
          <span className="text-white/60 ml-1 text-sm">/{plan.period}</span>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-white/80">
              <div className="w-1 h-1 bg-white/60 rounded-full mr-3 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        {planId !== "free" && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <Badge variant="secondary" className="bg-blue-900/30 text-blue-300 text-xs">
              Payment required after signup
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 