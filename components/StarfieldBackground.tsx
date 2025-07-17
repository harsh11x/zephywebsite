"use client"

import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'

export default function StarfieldBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-20 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} style={{ position: 'absolute', inset: 0 }}>
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0.5} fade speed={2} />
      </Canvas>
    </div>
  )
} 