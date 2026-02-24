"use client"

import { useEffect, useRef, useState } from "react"

interface TypewriterProps {
  text: string
  className?: string
  speed?: number
  startDelay?: number
  cursor?: boolean
}

export function Typewriter({ text, className = "", speed = 50, startDelay = 0, cursor = true }: TypewriterProps) {
  const [mounted, setMounted] = useState(false)
  const [displayed, setDisplayed] = useState("")
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [mounted])

  useEffect(() => {
    if (!started) return
    let i = 0
    let interval: ReturnType<typeof setInterval>
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1))
        i++
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
    }, startDelay)
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [started, text, speed, startDelay])

  return (
    <span ref={ref} className={className}>
      {displayed}
      {cursor && mounted && !done && (
        <span
          className="inline-block w-[2px] h-[1em] bg-rose/70 ml-0.5 align-middle"
          style={{ animation: "rose-pulse 1s ease-in-out infinite" }}
        />
      )}
    </span>
  )
}
