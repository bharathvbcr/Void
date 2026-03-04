"use client"

import { useCallback } from "react"
import { useWebHaptics } from "web-haptics/react"
import type { HapticInput } from "web-haptics"

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

// Mapping custom patterns to web-haptics patterns
const VIBRATION_PATTERNS: Record<HapticPattern, HapticInput> = {
  light: "light",
  medium: "medium",
  heavy: "heavy",
  success: "success",
  heartbeat: [30, 60, 20, 60, 45],
  reveal: [10, 25, 10],
  error: "error",
  flatline: [100],
  tear: [8, 40, 8, 40, 8],
  sectionSnap: [15, 30, 10],
  ecgBeat: [20, 40, 10, 40, 30],
  hold: [30, 10, 30, 10, 50],
  release: [10, 20, 8],
}

export function useHaptic() {
  const { trigger: webTrigger } = useWebHaptics()

  const trigger = useCallback(
    (pattern: HapticPattern = "light") => {
      const input = VIBRATION_PATTERNS[pattern] || pattern
      webTrigger(input)?.catch(() => { })
    },
    [webTrigger]
  )

  const sequence = useCallback(
    (steps: { pattern: HapticPattern; delay: number }[]) => {
      steps.forEach(({ pattern, delay }) => {
        setTimeout(() => trigger(pattern), delay)
      })
    },
    [trigger]
  )

  return { trigger, sequence }
}

