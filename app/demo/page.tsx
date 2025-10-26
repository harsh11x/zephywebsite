"use client"

import { motion } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"
import VoiceCallDemo from "@/components/VoiceCallDemo"

export default function DemoPage() {
  return (
    <div className="min-h-screen text-white relative z-10 overflow-hidden">
      <Header />

      <section className="py-20 sm:py-28 md:py-32 lg:py-40">
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight mb-6 sm:mb-8"
            >
              <span className="block text-white">Encrypted Call</span>
              <span className="block text-white/60">Demo</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-white/60 max-w-4xl mx-auto mb-8 sm:mb-10 md:mb-12 font-light px-2 sm:px-0"
            >
              Experience end-to-end encrypted voice and video calls using only email addresses.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 border-t border-white/10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-light tracking-tight text-white text-center mb-10">Try It Live</h2>
            <p className="text-white/60 text-center mb-10">Experience end-to-end encrypted voice and video calls using only email addresses.</p>
            <VoiceCallDemo />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
