"use client"

import Link from "next/link"
import { Shield } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { useCurrency, SUPPORTED_CURRENCIES } from "@/contexts/currency-context"
import { ChevronDown } from "lucide-react"

export default function Footer() {
  const solutions = ["Enterprise Security", "Cloud Protection", "Threat Intelligence", "Compliance Management"]
  const company = [
    { name: "About", href: "/solutions" },
    { name: "Leadership", href: "/leadership" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Investors", href: "/investors" },
  ]
  const resources = [
    { name: "Documentation", href: "/resources/documentation" },
    { name: "API Reference", href: "/resources/api-reference" },
    { name: "Security Center", href: "/resources/security-center" },
    { name: "Support", href: "/contact-us" },
  ]
  const legal = [
      { name: "Terms & Conditions", href: "/terms-and-conditions" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Cancellation & Refund", href: "/cancellation-and-refund" },
  ]

  return (
    <footer className="border-t-[0.5px] border-white/10 bg-black">
      <div className="container py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        {/* Currency Selector */}
        <div className="flex justify-end mb-8">
          <CurrencySelector />
        </div>
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="p-2 bg-white/10">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-light text-xl text-white tracking-wide">ZEPHYRN</span>
                <span className="text-white/40 text-xs font-light tracking-[0.2em]">SECURITIES</span>
              </div>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed font-light max-w-sm">
              Quantum-resistant encryption and AI-powered threat intelligence for critical digital infrastructure.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/80 tracking-wider uppercase mb-4">Solutions</h3>
            <ul className="space-y-3">
              {solutions.map((item) => (
                <li key={item}>
                  <Link href={`/solutions/${item.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm font-light text-white/60 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/80 tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm font-light text-white/60 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/80 tracking-wider uppercase mb-4">Resources</h3>
            <ul className="space-y-3">
              {resources.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm font-light text-white/60 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
              <li key="legal">
                <h3 className="text-sm font-semibold text-white/80 tracking-wider uppercase pt-4">Legal</h3>
              </li>
              {legal.map((item) => (
                  <li key={item.name}>
                      <Link href={item.href} className="text-sm font-light text-white/60 hover:text-white transition-colors">
                          {item.name}
                      </Link>
                  </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:hidden">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="solutions">
              <AccordionTrigger className="text-sm font-semibold text-white/80 tracking-wider uppercase">Solutions</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 pt-2">
                  {solutions.map((item) => (
                    <li key={item}>
                      <Link href={`/solutions/${item.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm font-light text-white/60 hover:text-white transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="company">
              <AccordionTrigger className="text-sm font-semibold text-white/80 tracking-wider uppercase">Company</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 pt-2">
                  {company.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm font-light text-white/60 hover:text-white transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="resources">
              <AccordionTrigger className="text-sm font-semibold text-white/80 tracking-wider uppercase">Resources</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 pt-2">
                  {resources.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm font-light text-white/60 hover:text-white transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="legal">
              <AccordionTrigger className="text-sm font-semibold text-white/80 tracking-wider uppercase">Legal</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 pt-2">
                  {legal.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm font-light text-white/60 hover:text-white transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mt-12 border-t-[0.5px] border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-xs text-white/40 font-light text-center sm:text-left">
            © {new Date().getFullYear()} Zephyrn Securities Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-xs text-white/30 font-light">
            <span>Enterprise Grade</span>
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <span>Quantum-Ready</span>
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <span>Global Scale</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function CurrencySelector() {
  const { currency, setCurrency, loading } = useCurrency()
  const current = SUPPORTED_CURRENCIES.find(c => c.code === currency)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500">
          <span className="mr-2 font-medium">{current ? current.label : currency}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2 bg-black border-white/10">
        <div className="font-semibold text-white mb-2">Select Currency</div>
        <ul className="space-y-1">
          {SUPPORTED_CURRENCIES.map((c) => (
            <li key={c.code}>
              <button
                className={`w-full text-left px-3 py-2 rounded hover:bg-white/10 text-white/80 ${currency === c.code ? "bg-white/10 font-bold" : ""}`}
                onClick={() => setCurrency(c.code)}
                disabled={loading}
              >
                {c.label}
                {currency === c.code && <span className="ml-2 text-xs text-blue-400">(Selected)</span>}
              </button>
            </li>
          ))}
        </ul>
        {loading && <div className="text-xs text-white/60 mt-2">Updating rates...</div>}
      </PopoverContent>
    </Popover>
  )
}
