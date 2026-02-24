"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
  maxLife: number
}

export function ParticleField({ count = 40, color = "199, 125, 146" }: { count?: number; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const mouseRef = useRef({ x: -1, y: -1 })
  const isVisibleRef = useRef(false)

  // Optimization: Pause animation when off-screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
      },
      { threshold: 0 }
    )

    if (canvasRef.current) {
      observer.observe(canvasRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let resizeTimeout: NodeJS.Timeout
    const resize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio
        canvas.height = canvas.offsetHeight * window.devicePixelRatio
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }, 100) // Debounce resize
    }
    resize() // Initial size
    window.addEventListener("resize", resize)

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect()
        mouseRef.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
      }
    }
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1, y: -1 }
    }
    canvas.addEventListener("mousemove", handleMouse)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("touchmove", handleTouch, { passive: true })
    canvas.addEventListener("touchend", handleMouseLeave)

    function createParticle(): Particle {
      const w = canvas!.offsetWidth
      const h = canvas!.offsetHeight
      const maxLife = 400 + Math.random() * 600
      return {
        x: Math.random() * w,
        y: h + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(0.15 + Math.random() * 0.35),
        size: 0.5 + Math.random() * 1.5,
        opacity: 0,
        life: 0,
        maxLife,
      }
    }

    particlesRef.current = Array.from({ length: count }, createParticle).map((p, i) => ({
      ...p,
      life: Math.random() * p.maxLife,
    }))

    function draw() {
      if (!ctx || !canvas) return

      // Only draw if visible
      if (isVisibleRef.current) {
        const w = canvas.offsetWidth
        const h = canvas.offsetHeight
        ctx.clearRect(0, 0, w, h)

        const mx = mouseRef.current.x
        const my = mouseRef.current.y

        for (const p of particlesRef.current) {
          p.life++
          if (p.life > p.maxLife) {
            Object.assign(p, createParticle())
            p.life = 0
          }

          // Fade in / fade out
          const progress = p.life / p.maxLife
          if (progress < 0.1) {
            p.opacity = progress / 0.1
          } else if (progress > 0.85) {
            p.opacity = (1 - progress) / 0.15
          } else {
            p.opacity = 1
          }

          // Mouse repulsion
          if (mx >= 0 && my >= 0) {
            const dx = p.x - mx
            const dy = p.y - my
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 100) {
              const force = (100 - dist) / 100
              p.vx += (dx / dist) * force * 0.08
              p.vy += (dy / dist) * force * 0.08
            }
          }

          p.x += p.vx
          p.y += p.vy
          // Dampen
          p.vx *= 0.998
          p.vy *= 0.999

          // Draw
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${color}, ${p.opacity * 0.5})`
          ctx.fill()

          // Glow
          if (p.size > 1) {
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${color}, ${p.opacity * 0.06})`
            ctx.fill()
          }
        }

        // Draw faint connection lines between close particles (limit comparisons for mobile perf)
        const maxConnCheck = Math.min(particlesRef.current.length, 30)
        for (let i = 0; i < maxConnCheck; i++) {
          for (let j = i + 1; j < maxConnCheck; j++) {
            const a = particlesRef.current[i]
            const b = particlesRef.current[j]
            const dx = a.x - b.x
            const dy = a.y - b.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 80) {
              const lineOpacity = (1 - dist / 80) * Math.min(a.opacity, b.opacity) * 0.12
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.strokeStyle = `rgba(${color}, ${lineOpacity})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationRef.current)
      clearTimeout(resizeTimeout)
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("mousemove", handleMouse)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("touchmove", handleTouch)
      canvas.removeEventListener("touchend", handleMouseLeave)
    }
  }, [count, color])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-[3]"
      aria-hidden="true"
    />
  )
}
