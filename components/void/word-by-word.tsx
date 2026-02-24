"use client"

import { useEffect, useRef, useState } from "react"

interface WordByWordProps {
  text: string
  className?: string
  wordDelay?: number
  startDelay?: number
}

export function WordByWord({ text, className = "", wordDelay = 80, startDelay = 0 }: WordByWordProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const words = text.split(" ")

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block transition-all"
          suppressHydrationWarning
          style={{
            opacity: triggered ? 1 : 0,
            transform: triggered ? "translateY(0)" : "translateY(8px)",
            filter: triggered ? "blur(0)" : "blur(4px)",
            transitionDuration: "600ms",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: triggered ? `${startDelay + i * wordDelay}ms` : "0ms",
          }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  )
}
