"use client"

import { useEffect, useRef, useCallback } from "react"
import { useHaptic } from "@/hooks/use-haptic"
import { siteConfig } from "@/config/site"

interface Tear {
  x: number
  y: number
  vy: number       // vertical velocity
  vx: number       // slight horizontal drift
  size: number
  opacity: number
  phase: "forming" | "falling" | "splash"
  formProgress: number  // 0..1 for the swelling phase
  splashFrame: number
  delay: number     // initial delay before this tear begins forming
  elapsed: number
}

interface Ripple {
  x: number
  y: number
  radius: number
  maxRadius: number
  opacity: number
}

interface TearDropsProps {
  /** Number of tears in the cycle */
  count?: number
  /** Rose or a custom color in r,g,b format */
  color?: string
  /** Intensity: affects frequency and size */
  intensity?: "gentle" | "steady" | "heavy"
  /** Whether the animation is active */
  active?: boolean
  /** Class name for positioning */
  className?: string
}

const INTENSITY_CONFIG = {
  gentle: { sizeMin: 2.5, sizeMax: 4, formSpeed: 0.008, fallAccel: 0.12, spawnDelay: 3000 },
  steady: { sizeMin: 3, sizeMax: 5, formSpeed: 0.012, fallAccel: 0.16, spawnDelay: 1800 },
  heavy: { sizeMin: 3.5, sizeMax: 6, formSpeed: 0.016, fallAccel: 0.2, spawnDelay: 900 },
}

export function TearDrops({
  count = 6,
  color = siteConfig.theme.colors.rose,
  intensity = "gentle",
  active = true,
  className = "",
}: TearDropsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const tearsRef = useRef<Tear[]>([])
  const ripplesRef = useRef<Ripple[]>([])
  const { trigger } = useHaptic()
  const lastHapticRef = useRef(0)
  const isVisibleRef = useRef(false)

  const config = INTENSITY_CONFIG[intensity]

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

  const createTear = useCallback((w: number, h: number, delay: number): Tear => {
    return {
      x: w * 0.15 + Math.random() * w * 0.7,
      y: -5,
      vy: 0,
      vx: (Math.random() - 0.5) * 0.15,
      size: config.sizeMin + Math.random() * (config.sizeMax - config.sizeMin),
      opacity: 0,
      phase: "forming",
      formProgress: 0,
      splashFrame: 0,
      delay,
      elapsed: 0,
    }
  }, [config])

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    // Initialize tears with staggered delays
    tearsRef.current = Array.from({ length: count }, (_, i) =>
      createTear(w, h, i * config.spawnDelay * (0.5 + Math.random() * 0.8))
    )
    ripplesRef.current = []

    function drawTearShape(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      alpha: number
    ) {
      // Teardrop shape: rounded bottom, pointed top
      ctx.save()
      ctx.translate(x, y)

      // Main body
      ctx.beginPath()
      // Bottom circle
      ctx.arc(0, size * 0.3, size, 0, Math.PI, false)
      // Left curve up to tip
      ctx.bezierCurveTo(
        -size, size * 0.3 - size * 0.6,
        -size * 0.15, -size * 1.8,
        0, -size * 2.2
      )
      // Right curve down from tip
      ctx.bezierCurveTo(
        size * 0.15, -size * 1.8,
        size, size * 0.3 - size * 0.6,
        size, size * 0.3
      )
      ctx.closePath()

      // Fill with gradient for refraction
      const grad = ctx.createRadialGradient(
        -size * 0.2, -size * 0.3, 0,
        0, size * 0.2, size * 1.5
      )
      grad.addColorStop(0, `rgba(${color}, ${alpha * 0.6})`)
      grad.addColorStop(0.5, `rgba(${color}, ${alpha * 0.35})`)
      grad.addColorStop(1, `rgba(${color}, ${alpha * 0.1})`)
      ctx.fillStyle = grad
      ctx.fill()

      // Refraction highlight (small white shine)
      ctx.beginPath()
      ctx.ellipse(-size * 0.25, -size * 0.5, size * 0.2, size * 0.35, -0.3, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.25})`
      ctx.fill()

      ctx.restore()
    }

    function drawRipple(ctx: CanvasRenderingContext2D, ripple: Ripple) {
      const progress = ripple.radius / ripple.maxRadius
      const alpha = ripple.opacity * (1 - progress)

      ctx.beginPath()
      ctx.ellipse(ripple.x, ripple.y, ripple.radius, ripple.radius * 0.35, 0, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${color}, ${alpha})`
      ctx.lineWidth = Math.max(0.3, 1 - progress * 0.7)
      ctx.stroke()
    }

    function animate() {
      if (!ctx || !canvas) return

      // Only draw if visible
      if (isVisibleRef.current) {
        ctx.clearRect(0, 0, w, h)

        const now = Date.now()

        // Update and draw tears
        for (const tear of tearsRef.current) {
          tear.elapsed += 16.67 // ~60fps

          // Skip until delay is met
          if (tear.elapsed < tear.delay) continue

          switch (tear.phase) {
            case "forming":
              tear.formProgress += config.formSpeed
              tear.opacity = Math.min(tear.formProgress * 1.2, 0.8)
              tear.y = 2 + tear.formProgress * 6 // slight droop while forming

              if (tear.formProgress >= 1) {
                tear.phase = "falling"
                tear.vy = 0.3
              }

              drawTearShape(ctx, tear.x, tear.y, tear.size * tear.formProgress, tear.opacity)
              break

            case "falling":
              // Gravity acceleration
              tear.vy += config.fallAccel
              // Terminal velocity cap
              tear.vy = Math.min(tear.vy, 6)
              tear.y += tear.vy
              tear.x += tear.vx
              // Slight elongation during fall
              tear.opacity = Math.min(0.75, tear.opacity + 0.01)

              drawTearShape(ctx, tear.x, tear.y, tear.size, tear.opacity)

              // Hit bottom
              if (tear.y >= h - 4) {
                tear.phase = "splash"
                tear.splashFrame = 0

                // Create ripples
                ripplesRef.current.push(
                  { x: tear.x, y: h - 2, radius: 0, maxRadius: tear.size * 5, opacity: 0.3 },
                  { x: tear.x, y: h - 2, radius: 0, maxRadius: tear.size * 3, opacity: 0.2 }
                )

                // Haptic on splash (throttled)
                if (now - lastHapticRef.current > 600) {
                  lastHapticRef.current = now
                  trigger("tear")
                }
              }
              break

            case "splash":
              tear.splashFrame++
              if (tear.splashFrame > 30) {
                // Respawn after splash fades
                Object.assign(tear, createTear(w, h, config.spawnDelay * (0.4 + Math.random() * 0.6)))
                tear.elapsed = tear.delay // start immediately
              }
              break
          }
        }

        // Update and draw ripples
        ripplesRef.current = ripplesRef.current.filter((ripple) => {
          ripple.radius += 0.5
          drawRipple(ctx, ripple)
          return ripple.radius < ripple.maxRadius
        })
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animRef.current)
    }
  }, [active, count, color, intensity, config, createTear, trigger])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ width: "100%", height: "100%" }}
    />
  )
}
