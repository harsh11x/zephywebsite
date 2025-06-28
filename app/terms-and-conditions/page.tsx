"use client"

import React from "react";

export default function TermsAndConditionsPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 sm:px-8 lg:px-0 animate-fade-in-up font-sans text-zinc-100">
      <h1 className="text-4xl md:text-5xl font-black mb-6 text-center tracking-tight">Terms & Conditions</h1>
      <div className="bg-zinc-900/95 rounded-2xl shadow-xl border border-zinc-700/80 p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-2">1. Introduction</h2>
          <p>
            Welcome to Zephyrn Securities. These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using our platform, you agree to comply with and be bound by these Terms. If you do not agree, please do not use our services.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-2">2. Acceptance of Terms</h2>
          <p>
            By accessing, browsing, or registering with Zephyrn Securities, you acknowledge that you have read, understood, and agree to be bound by these Terms and all applicable laws and regulations.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-2">3. Services</h2>
          <p>
            Zephyrn Securities provides cybersecurity solutions, including but not limited to encryption, threat detection, and breach response. We reserve the right to modify, suspend, or discontinue any part of our services at any time without notice.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-2">4. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate and complete information during registration and use of our services.</li>
            <li>Maintain the confidentiality of your account credentials.</li>
            <li>Comply with all applicable laws and regulations.</li>
            <li>Do not use our services for any unlawful or unauthorized purpose.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-2">5. Data Security & Privacy</h2>
          <p>
            We are committed to protecting your data. Please review our Privacy Policy to understand how we collect, use, and safeguard your information. While we employ advanced security measures, we cannot guarantee absolute security of your data transmitted through our platform.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-2">6. Intellectual Property</h2>
          <p>
            All content, trademarks, logos, and intellectual property on this site are the property of Zephyrn Securities or its licensors. You may not reproduce, distribute, or create derivative works without our express written permission.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-2">7. Limitation of Liability</h2>
          <p>
            Zephyrn Securities is not liable for any direct, indirect, incidental, or consequential damages arising from your use of our services. Our platform is provided "as is" and "as available" without warranties of any kind.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-2">8. Changes to Terms</h2>
          <p>
            We reserve the right to update or modify these Terms at any time. Changes will be effective upon posting on this page. Continued use of our services after changes constitutes acceptance of the new Terms.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-2">9. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:costumercare@zephyrnsecurities.com" className="underline">costumercare@zephyrnsecurities.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
} 