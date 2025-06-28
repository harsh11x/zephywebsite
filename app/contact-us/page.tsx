import React, { useState } from 'react';

export default function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to an API endpoint
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-4 text-center">Contact Us</h1>
      <p className="mb-8 text-center text-gray-600">We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.</p>
      <div className="bg-white shadow-lg rounded-lg p-8">
        {submitted ? (
          <div className="text-green-600 text-center text-lg font-semibold">Thank you for reaching out! We'll get back to you soon.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={form.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send Message
            </button>
          </form>
        )}
        <div className="mt-10 border-t pt-6 text-gray-700">
          <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
          <p>Email: <a href="mailto:support@zephyrnsecurities.com" className="text-blue-600 hover:underline">support@zephyrnsecurities.com</a></p>
          <p>Phone: <a href="tel:+911234567890" className="text-blue-600 hover:underline">+91 12345 67890</a></p>
          <p>Address: 123 Zephyrn Securities Lane, Mumbai, India</p>
        </div>
      </div>
    </div>
  );
} 