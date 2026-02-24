"use client"

import { useCallback, useRef } from "react"

export type HapticPattern =
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "heartbeat"
  | "reveal"
  | "error"
  | "flatline"
  | "tear"
  | "sectionSnap"
  | "ecgBeat"
  | "hold"
  | "release"

const VIBRATION_PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 45,
  success: [15, 40, 15],
  heartbeat: [30, 60, 20, 60, 45],
  reveal: [10, 25, 10],
  error: [50, 30, 50],
  flatline: [100],
  tear: [8, 40, 8, 40, 8],
  sectionSnap: [15, 30, 10],
  ecgBeat: [20, 40, 10, 40, 30],
  hold: [30, 10, 30, 10, 50],
  release: [10, 20, 8],
}

const MIN_INTERVAL_MS: Partial<Record<HapticPattern, number>> = {
  light: 40,
  sectionSnap: 150,
  ecgBeat: 300,
  tear: 200,
}

// Improved audio haptics tuning for iOS (frequencies around 170Hz trigger the taptic engine best)
const AUDIO_TAP_GAIN: Partial<Record<HapticPattern, number>> = {
  light: 0.015,
  medium: 0.02,
  heavy: 0.03,
  success: 0.02,
  heartbeat: 0.02,
  reveal: 0.015,
  error: 0.025,
  flatline: 0.025,
  tear: 0.015,
  sectionSnap: 0.015,
  ecgBeat: 0.015,
  hold: 0.02,
  release: 0.015,
}

class HapticEngine {
  private audioCtx: AudioContext | null = null
  private lastFire: Partial<Record<HapticPattern, number>> = {}

  private isLikelyIOS(): boolean {
    if (typeof navigator === "undefined") return false
    const ua = navigator.userAgent || ""
    return /iPad|iPhone|iPod/.test(ua) || (ua.includes("Mac") && typeof document !== "undefined" && "ontouchend" in document)
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) this.audioCtx = new AudioCtx()
    }
    return this.audioCtx
  }

  private triggerAudioTap(pattern: HapticPattern) {
    const ctx = this.getAudioContext()
    if (!ctx) return
    void ctx.resume().catch(() => {})

    const sequence = VIBRATION_PATTERNS[pattern]
    const pulses = Array.isArray(sequence) ? sequence : [sequence]
    const baseTime = ctx.currentTime + 0.005
    const gainValue = AUDIO_TAP_GAIN[pattern] ?? 0.015
    let cursorMs = 0

    pulses.forEach((segment, index) => {
      const durationMs = Math.max(8, segment)
      const isPulse = index % 2 === 0
      
      if (isPulse) {
        const start = baseTime + cursorMs / 1000
        const end = start + Math.min(durationMs, 100) / 1000
        
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = "sine" // Sine wave around 170Hz feels punchier on iOS devices
        osc.frequency.setValueAtTime(170, start)
        osc.frequency.exponentialRampToValueAtTime(120, end) // slight drop in frequency
        
        gain.gain.setValueAtTime(0.0001, start)
        gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.005)
        gain.gain.exponentialRampToValueAtTime(0.0001, end)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(start)
        osc.stop(end)
      }
      cursorMs += durationMs
    })
  }

  public trigger(pattern: HapticPattern = "light") {
    if (typeof window === "undefined" || typeof navigator === "undefined") return

    if (typeof window.matchMedia === "function") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
      if (mq.matches) return
    }

    const now = Date.now()
    const minInterval = MIN_INTERVAL_MS[pattern] ?? 0
    const lastTime = this.lastFire[pattern] ?? 0
    if (now - lastTime < minInterval) return
    this.lastFire[pattern] = now

    try {
      if ("vibrate" in navigator && typeof navigator.vibrate === "function") {
        navigator.vibrate(VIBRATION_PATTERNS[pattern])
        return
      }

      if (this.isLikelyIOS()) {
        this.triggerAudioTap(pattern)
      }
    } catch {
      // Silently ignore
    }
  }
}

let engineInstance: HapticEngine | null = null

export function useHaptic() {
  if (!engineInstance && typeof window !== "undefined") {
    engineInstance = new HapticEngine()
  }

  const trigger = useCallback((pattern: HapticPattern = "light") => {
    engineInstance?.trigger(pattern)
  }, [])

  const sequence = useCallback((steps: { pattern: HapticPattern; delay: number }[]) => {
    steps.forEach(({ pattern, delay }) => {
      setTimeout(() => trigger(pattern), delay)
    })
  }, [trigger])

  return { trigger, sequence }
}
