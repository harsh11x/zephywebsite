import { motion } from 'framer-motion'
import React from 'react'

interface GlassPanelProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function GlassPanel({ children, className = '', style }: GlassPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      style={style}
    >
      <div className={`relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl ${className}`}>
        {/* Liquid glass background with animated gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl">
          {/* Animated liquid border */}
          <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-r from-cyan-400/30 via-blue-500/20 to-purple-500/30 opacity-60 animate-pulse" />
          <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-white/40 via-transparent to-white/20" />
          
          {/* Liquid flow animation */}
          <motion.div
            animate={{
              background: [
                "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)",
                "linear-gradient(45deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)",
                "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl" />
          </motion.div>
          
          {/* Liquid shine effect */}
          <motion.div
            animate={{
              background: [
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl" />
          </motion.div>
        </div>
        
        {/* Liquid border glow */}
        <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl border border-white/30 shadow-2xl">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(0, 255, 247, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)",
                "0 0 30px rgba(0, 255, 247, 0.5), inset 0 0 30px rgba(255, 255, 255, 0.2)",
                "0 0 20px rgba(0, 255, 247, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl" />
          </motion.div>
        </div>
        
        {/* Content with responsive padding */}
        <div className="relative z-10 p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </div>
    </motion.div>
  )
} 