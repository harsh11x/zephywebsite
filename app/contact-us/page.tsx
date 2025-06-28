"use client"

import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("All fields are required.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-4 sm:px-8 lg:px-12 animate-fade-in-up font-sans">
      <h1 className="text-4xl md:text-5xl font-black mb-3 text-center text-zinc-100 tracking-tight drop-shadow-lg">Contact Us</h1>
      <p className="mb-12 text-center text-zinc-400 text-lg font-medium">We'd love to hear from you! Reach out using the form or our contact details below.</p>
      <div className="flex flex-col md:flex-row gap-10 bg-zinc-900/95 rounded-2xl shadow-2xl p-0 md:p-10 overflow-hidden border border-zinc-700/80">
        {/* Contact Info */}
        <div className="md:w-1/2 bg-gradient-to-br from-zinc-900/95 to-zinc-800/90 p-8 flex flex-col justify-center items-start gap-7 text-zinc-100 border-r border-zinc-700/80 md:rounded-l-2xl">
          <h2 className="text-2xl font-bold mb-1 text-zinc-100 tracking-tight">Get in Touch</h2>
          <div className="flex items-center gap-3 text-base font-medium">
            <Mail className="text-zinc-400" />
            <a href="mailto:costumercare@zephyrnsecurities.com" className="hover:underline text-zinc-200">costumercare@zephyrnsecurities.com</a>
          </div>
          <div className="flex items-center gap-3 text-base font-medium">
            <Phone className="text-zinc-400" />
            <a href="tel:+919888322293" className="hover:underline text-zinc-200">+91 9888322293</a>
          </div>
          <div className="flex items-center gap-3 text-base font-medium">
            <MapPin className="text-zinc-400" />
            <span className="text-zinc-200">123 Zephyrn Securities Lane, Mumbai, India</span>
          </div>
          <div className="mt-8 text-xs text-zinc-500 font-normal">Our team typically responds within 24 hours.</div>
        </div>
        {/* Contact Form */}
        <div className="md:w-1/2 bg-zinc-950 p-8 flex flex-col justify-center md:rounded-r-2xl shadow-xl border-t md:border-t-0 border-zinc-700/80">
          {submitted ? (
            <div className="text-zinc-300 text-center text-lg font-semibold animate-fade-in-up">Thank you for reaching out! We'll get back to you soon.</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7" noValidate>
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-zinc-300 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-zinc-700/80 shadow-sm focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400 bg-zinc-900 text-zinc-100 placeholder-zinc-500 transition-all duration-200 px-4 py-2 text-base font-medium outline-none"
                  autoComplete="name"
                  aria-required="true"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-zinc-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-zinc-700/80 shadow-sm focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400 bg-zinc-900 text-zinc-100 placeholder-zinc-500 transition-all duration-200 px-4 py-2 text-base font-medium outline-none"
                  autoComplete="email"
                  aria-required="true"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-zinc-300 mb-1">Message</label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-zinc-700/80 shadow-sm focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400 bg-zinc-900 text-zinc-100 placeholder-zinc-500 transition-all duration-200 px-4 py-2 text-base font-medium outline-none"
                  aria-required="true"
                  placeholder="How can we help you?"
                />
              </div>
              {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-zinc-800 text-zinc-100 font-bold rounded-lg shadow hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all duration-200 text-base tracking-wide"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 