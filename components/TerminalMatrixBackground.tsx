"use client"
import { useEffect, useRef } from "react"

const CHARACTERS = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトホモヨョロヲゴゾドボポヴabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("")

export default function TerminalMatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    let width = window.innerWidth
    let height = window.innerHeight
    let fontSize = 16 // denser, less vertical gap
    let columns = Math.floor(width / fontSize)
    let drops = Array(columns).fill(1)
    let frame = 0
    const streamLength = 24 // longer streams for more overlap

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      columns = Math.floor(width / fontSize)
      drops = Array(columns).fill(1)
    }
    window.addEventListener("resize", resize)
    resize()

    function handleMouse(e: MouseEvent) {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }
    window.addEventListener("mousemove", handleMouse)

    function draw() {
      ctx.fillStyle = "rgba(0,0,0,0.3)"
      ctx.fillRect(0, 0, width, height)
      ctx.font = `${fontSize}px monospace`
      for (let i = 0; i < columns; i++) {
        const x = i * fontSize
        for (let j = 0; j < streamLength; j++) {
          const y = (drops[i] - j) * fontSize
          if (y < 0) continue
          const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
          // Distance from mouse
          const dx = x - mouseRef.current.x
          const dy = y - mouseRef.current.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          // Fade tail
          let alpha = 1 - j / streamLength
          ctx.save()
          if (dist < 80) {
            ctx.fillStyle = `rgba(0,255,102,0.7)`
            ctx.shadowColor = "#00ff66"
            ctx.shadowBlur = 32
          } else {
            ctx.fillStyle = `rgba(68,68,68,${alpha})`
            ctx.shadowBlur = 0
          }
          ctx.fillText(char, x, y)
          ctx.restore()
        }
        if ((drops[i] - streamLength) * fontSize > height && Math.random() > 0.98) {
          drops[i] = -Math.floor(Math.random() * (height / fontSize))
        }
        // Slow down: only update drop every 8th frame for smoothness
        if (frame % 8 === 0) {
          drops[i]++
        }
      }
      frame++
    }
    let animationId: number
    function animate() {
      draw()
      animationId = requestAnimationFrame(animate)
    }
    animate()
    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouse)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      style={{ display: "block" }}
    />
  )
} 