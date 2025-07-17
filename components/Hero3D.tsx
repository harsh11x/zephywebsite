import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { motion } from 'framer-motion'

export default function Hero3D() {
  return (
    <div className="w-full h-[80vh] flex items-center justify-center relative z-0 mt-16 md:mt-20">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} className="rounded-xl">
        {/* Animated starfield background only */}
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0.5} fade speed={2} />
      </Canvas>
      {/* Animated overlay text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="text-5xl md:text-7xl font-extralight tracking-tight text-white drop-shadow-lg mb-4">
            Zephyryn Secure Platform
          </div>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
        >
          <div className="text-lg md:text-2xl text-white/70 font-light max-w-2xl text-center">
            Next-generation, AI-powered, end-to-end encrypted communication and data protection for the future.
          </div>
        </motion.p>
      </div>
    </div>
  )
} 