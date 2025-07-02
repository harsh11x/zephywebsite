"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"

const DEFAULT_CURRENCY = "USD"
const SUPPORTED_CURRENCIES = [
  { code: "USD", label: "US Dollar ($)" },
  { code: "INR", label: "Indian Rupee (₹)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "GBP", label: "British Pound (£)" },
  { code: "AUD", label: "Australian Dollar (A$)" },
  { code: "CAD", label: "Canadian Dollar (C$)" },
  { code: "SGD", label: "Singapore Dollar (S$)" },
  { code: "JPY", label: "Japanese Yen (¥)" },
  { code: "CNY", label: "Chinese Yuan (¥)" },
  { code: "CHF", label: "Swiss Franc (Fr)" },
  { code: "ZAR", label: "South African Rand (R)" },
  { code: "BRL", label: "Brazilian Real (R$)" },
  { code: "AED", label: "UAE Dirham (د.إ)" },
  { code: "HKD", label: "Hong Kong Dollar (HK$)" },
  { code: "KRW", label: "South Korean Won (₩)" },
]

interface CurrencyContextType {
  currency: string
  setCurrency: (currency: string) => void
  rates: Record<string, number>
  loading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<string>(DEFAULT_CURRENCY)
  // Static rates for USD to other currencies
  const staticRates: Record<string, number> = {
    USD: 1,
    INR: 84,
    EUR: 0.85,
    GBP: 0.75,
    AUD: 1.52,
    CAD: 1.36,
    SGD: 1.27,
    JPY: 157.5,
    CNY: 7.25,
    CHF: 0.91,
    ZAR: 18.2,
    BRL: 5.25,
    AED: 3.67,
    HKD: 7.85,
    KRW: 1370,
  }
  const [rates, setRates] = useState<Record<string, number>>(staticRates)
  const [loading, setLoading] = useState<boolean>(false)

  // Load currency from localStorage
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("currency") : null
    if (stored && SUPPORTED_CURRENCIES.some(c => c.code === stored)) {
      setCurrencyState(stored)
    }
  }, [])

  // Persist currency selection
  const setCurrency = (cur: string) => {
    setCurrencyState(cur)
    if (typeof window !== "undefined") {
      localStorage.setItem("currency", cur)
    }
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, loading }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider")
  return ctx
}

export { SUPPORTED_CURRENCIES } 