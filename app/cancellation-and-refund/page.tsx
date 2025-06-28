"use client"

import React from "react";

export default function CancellationAndRefundPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 sm:px-8 lg:px-0 animate-fade-in-up font-sans text-zinc-100">
      <h1 className="text-4xl md:text-5xl font-black mb-6 text-center tracking-tight">Cancellation & Refund Policy</h1>
      <div className="bg-zinc-900/95 rounded-2xl shadow-xl border border-zinc-700/80 p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-2">1. Introduction</h2>
          <p>
            At Zephyrn Securities, we strive to provide the highest quality cybersecurity solutions. If you are not satisfied with your purchase, please review our cancellation and refund policy below.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-2">2. Cancellation Policy</h2>
          <p>
            You may request a cancellation of your subscription or service within <span className="font-semibold">7 days</span> of purchase. After this period, cancellations will not be accepted.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-2">3. Refund Process</h2>
          <p>
            If your cancellation request is approved, your refund will be processed within <span className="font-semibold">3-7 business days</span> to the original payment method. Please note that processing times may vary depending on your bank or payment provider.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-2">4. Contact Us</h2>
          <p>
            For any questions or to initiate a cancellation or refund, please contact our support team at <a href="mailto:costumercare@zephyrnsecurities.com" className="underline">costumercare@zephyrnsecurities.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
} 