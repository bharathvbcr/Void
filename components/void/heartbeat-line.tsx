"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useHaptic } from "@/hooks/use-haptic"
import { siteConfig } from "@/config/site"

// --- Realistic PQRST waveform generator ---
// Returns y-offset for a given position within a single heartbeat cycle [0..1]
function pqrstWaveform(t: number, amplitude: number): number {
  // P wave: small atrial depolarization bump
  if (t >= 0.0 && t < 0.1) {
    const p = (t - 0.0) / 0.1
    return -amplitude * 0.12 * Math.sin(p * Math.PI)
  }
  // PR segment: flat baseline
  if (t >= 0.1 && t < 0.16) return 0
  // Q wave: small downward deflection
  if (t >= 0.16 && t < 0.2) {
    const q = (t - 0.16) / 0.04
    return amplitude * 0.08 * Math.sin(q * Math.PI)
  }
  // R wave: sharp upward spike (the main peak)
  if (t >= 0.2 && t < 0.3) {
    const r = (t - 0.2) / 0.1
    return -amplitude * Math.sin(r * Math.PI)
  }
  // S wave: sharp downward dip
  if (t >= 0.3 && t < 0.36) {
    const s = (t - 0.3) / 0.06
    return amplitude * 0.22 * Math.sin(s * Math.PI)
  }
  // ST segment: slight elevation returning to baseline
  if (t >= 0.36 && t < 0.5) {
    const st = (t - 0.36) / 0.14
    return -amplitude * 0.03 * (1 - st)
  }
  // T wave: repolarization bump
  if (t >= 0.5 && t < 0.7) {
    const tw = (t - 0.5) / 0.2
    return -amplitude * 0.25 * Math.sin(tw * Math.PI)
  }
  // Baseline rest
  return 0
}

// Degraded waveform (arrhythmia / weakening) with decreasing amplitude + noise
function degradedWaveform(t: number, amplitude: number, degradation: number): number {
  const weakened = amplitude * (1 - degradation * 0.85)
  const base = pqrstWaveform(t, weakened)
  // Add subtle noise that increases with degradation
  const noise = (Math.random() - 0.5) * degradation * amplitude * 0.15
  // Irregular timing stretch
  return base + noise
}

export function HeartbeatLine() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [showFlatlineText, setShowFlatlineText] = useState(false)
  const [showBpmLabel, setShowBpmLabel] = useState(false)
  const animRef = useRef<number>(0)
  const { trigger, sequence } = useHaptic()
  const hapticBeatRef = useRef(0)
  const flatlineHapticFired = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // ECG paper grid -- large squares with sub-divisions
    const majorSize = 20
    const minorSize = 4
    const roseColor = siteConfig.theme.colors.rose

    // Minor grid lines (thin, very faint)
    ctx.strokeStyle = `rgba(${roseColor}, 0.025)`
    ctx.lineWidth = 0.5
    for (let x = 0; x < w; x += minorSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }
    for (let y = 0; y < h; y += minorSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }

    // Major grid lines (slightly more visible)
    ctx.strokeStyle = `rgba(${roseColor}, 0.055)`
    ctx.lineWidth = 0.5
    for (let x = 0; x < w; x += majorSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }
    for (let y = 0; y < h; y += majorSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }
  }, [])

  useEffect(() => {
    if (!inView) return
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

    const midY = h / 2
    const amplitude = h * 0.32

    // Total width represents about 8 seconds of ECG
    // ~5 healthy beats, then degradation, then flatline
    const totalBeats = 5
    const healthyZone = 0.48        // first 48% = healthy heartbeats
    const degradationZone = 0.2     // 20% = arrhythmia / weakening
    const flatlineStart = 0.68      // last 32% = flatline

    // Generate the full ECG path as an array of y-values
    const points: number[] = []
    for (let x = 0; x < w; x++) {
      const pct = x / w

      if (pct < healthyZone) {
        // Healthy region: clean PQRST beats
        const beatPct = (pct / healthyZone) * totalBeats
        const t = beatPct % 1
        points.push(midY + pqrstWaveform(t, amplitude))
      } else if (pct < flatlineStart) {
        // Degradation: weakening beats with noise
        const degPct = (pct - healthyZone) / degradationZone
        const beatPct = degPct * 2 // ~2 weaker beats
        const t = beatPct % 1
        points.push(midY + degradedWaveform(t, amplitude, degPct))
      } else {
        // Flatline: nearly flat with tiny wandering baseline
        const flatPct = (pct - flatlineStart) / (1 - flatlineStart)
        const wander = Math.sin(x * 0.015) * 0.6 * (1 - flatPct * 0.5)
        points.push(midY + wander)
      }
    }

    // Animation state
    let drawX = 0
    const speed = 2.2 // pixels per frame
    let lastBeatIndex = -1

    // Show BPM label after a short delay
    const bpmTimeout = setTimeout(() => setShowBpmLabel(true), 800)

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, w, h)

      // Draw the ECG grid background
      drawGrid(ctx, w, h)

      drawX = Math.min(drawX + speed, w)
      const currentX = Math.floor(drawX)
      const pct = currentX / w

      // --- Detect heartbeat peaks for haptic ---
      if (pct < flatlineStart) {
        const beatCount = pct < healthyZone
          ? Math.floor((pct / healthyZone) * totalBeats)
          : totalBeats + Math.floor(((pct - healthyZone) / degradationZone) * 2)
        if (beatCount > lastBeatIndex) {
          lastBeatIndex = beatCount
          if (hapticBeatRef.current < 8) {
            hapticBeatRef.current++
            trigger("ecgBeat")
          }
        }
      }

      // --- Flatline haptic + text ---
      if (pct >= flatlineStart && !flatlineHapticFired.current) {
        flatlineHapticFired.current = true
        sequence([
          { pattern: "heavy", delay: 0 },
          { pattern: "flatline", delay: 200 },
        ])
        // Show flatline text shortly after
        setTimeout(() => setShowFlatlineText(true), 1200)
      }

      const roseColor = siteConfig.theme.colors.rose

      // --- Draw glow trail behind the trace ---
      if (currentX > 2) {
        ctx.beginPath()
        ctx.moveTo(0, points[0])
        for (let x = 1; x <= currentX; x++) {
          ctx.lineTo(x, points[x])
        }
        // Wider, diffuse glow
        const glowAlpha = pct >= flatlineStart
          ? Math.max(0.02, 0.08 * (1 - (pct - flatlineStart) / (1 - flatlineStart)))
          : 0.08
        ctx.strokeStyle = `rgba(${roseColor}, ${glowAlpha})`
        ctx.lineWidth = 8
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.stroke()
      }

      // --- Draw the main ECG trace ---
      if (currentX > 1) {
        ctx.beginPath()
        ctx.moveTo(0, points[0])
        for (let x = 1; x <= currentX; x++) {
          ctx.lineTo(x, points[x])
        }

        // Color shifts: rose -> dimmer rose -> gray flatline
        let alpha: number
        let r: number, g: number, b: number
        const baseRgb = roseColor.split(",").map(c => parseInt(c.trim()))

        if (pct < healthyZone) {
          alpha = 0.7
          r = baseRgb[0]; g = baseRgb[1]; b = baseRgb[2]
        } else if (pct < flatlineStart) {
          const deg = (pct - healthyZone) / degradationZone
          alpha = 0.7 - deg * 0.35
          r = Math.round(baseRgb[0] - deg * 60)
          g = Math.round(baseRgb[1] - deg * 40)
          b = Math.round(baseRgb[2] - deg * 50)
        } else {
          const flatProgress = (pct - flatlineStart) / (1 - flatlineStart)
          alpha = Math.max(0.12, 0.35 - flatProgress * 0.23)
          r = 120; g = 100; b = 100
        }

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.lineWidth = 1.8
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.stroke()
      }

      // --- Draw leading dot with glow ---
      if (currentX < w && currentX > 0) {
        const dotY = points[currentX] ?? midY
        const isFlat = pct >= flatlineStart
        const dotAlpha = isFlat ? 0.2 : 0.8

        // Outer glow
        const gradient = ctx.createRadialGradient(currentX, dotY, 0, currentX, dotY, isFlat ? 6 : 12)
        gradient.addColorStop(0, `rgba(${roseColor}, ${dotAlpha * 0.4})`)
        gradient.addColorStop(1, `rgba(${roseColor}, 0)`)
        ctx.beginPath()
        ctx.arc(currentX, dotY, isFlat ? 6 : 12, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Inner dot
        ctx.beginPath()
        ctx.arc(currentX, dotY, isFlat ? 1.5 : 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${roseColor}, ${dotAlpha})`
        ctx.fill()
      }

      // --- Draw BPM readout on the right side ---
      if (currentX > w * 0.08) {
        const bpm = pct < healthyZone
          ? "72"
          : pct < flatlineStart
            ? String(Math.max(20, Math.round(72 - ((pct - healthyZone) / degradationZone) * 52)))
            : "--"

        ctx.font = "600 10px var(--font-inter), system-ui, sans-serif"
        ctx.textAlign = "right"
        ctx.fillStyle = pct >= flatlineStart
          ? "rgba(120, 100, 100, 0.25)"
          : `rgba(${roseColor}, 0.3)`
        ctx.fillText(`${bpm} BPM`, w - 8, 14)
      }

      if (currentX < w) {
        animRef.current = requestAnimationFrame(draw)
      }
    }

    // Start after a brief pause
    const startTimeout = setTimeout(() => {
      draw()
    }, 700)

    return () => {
      clearTimeout(startTimeout)
      clearTimeout(bpmTimeout)
      cancelAnimationFrame(animRef.current)
    }
  }, [inView, drawGrid, trigger, sequence])

  return (
    <section ref={sectionRef} className="relative w-full py-16 bg-void-deep overflow-hidden gpu-layer">
      {/* Section label */}
      <div
        className={`text-center mb-4 transition-all duration-[2000ms] ${
          inView ? "opacity-100" : "opacity-0"
        }`}
        style={{ filter: inView ? "blur(0)" : "blur(4px)", transitionProperty: "all" }}
      >
        <p className="font-sans text-[9px] tracking-[0.6em] uppercase text-rose/25">
          {siteConfig.heartbeatLine.label}
        </p>
      </div>

      {/* BPM label above ECG */}
      <div
        className={`flex justify-between items-center max-w-md mx-auto px-6 mb-2 transition-all duration-1000 ${
          showBpmLabel && inView ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="font-sans text-[8px] tracking-[0.3em] uppercase text-rose/20">
          Lead II
        </span>
        <span className="font-sans text-[8px] tracking-[0.3em] uppercase text-muted-foreground/20">
          25mm/s
        </span>
      </div>

      {/* ECG Canvas */}
      <div className="relative max-w-md mx-auto px-6">
        <div className="relative rounded-lg overflow-hidden border border-rose/[0.04] bg-[hsl(0_0%_6%)]">
          <canvas
            ref={canvasRef}
            className="w-full h-28 sm:h-32"
            aria-label="Animated ECG heartbeat line that shows a healthy heart rhythm gradually weakening and flatlining, representing the fading of a friendship"
            role="img"
          />
          {/* Vignette edges */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, hsl(0 0% 6% / 0.8) 0%, transparent 8%, transparent 92%, hsl(0 0% 6% / 0.8) 100%)",
            }}
          />
        </div>
      </div>

      {/* Flatline text */}
      <div className="relative max-w-md mx-auto px-6">
        <div
          className={`text-center mt-6 transition-all duration-[2000ms] ${
            showFlatlineText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ filter: showFlatlineText ? "blur(0)" : "blur(4px)", transitionProperty: "all" }}
        >
          <p className="font-serif text-[11px] text-rose/30 italic leading-relaxed">
            {siteConfig.heartbeatLine.text}
          </p>
        </div>

        {/* Small flatline indicator */}
        <div
          className={`flex justify-center mt-4 transition-all duration-[1500ms] delay-500 ${
            showFlatlineText ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="inline-block w-8 h-px bg-muted-foreground/10" />
            <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/15" />
            <span className="inline-block w-8 h-px bg-muted-foreground/10" />
          </div>
        </div>
      </div>
    </section>
  )
}
