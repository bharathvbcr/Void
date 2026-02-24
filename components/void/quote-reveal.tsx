"use client"

import React, { useEffect, useRef, useState } from "react"

interface QuoteRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  key?: React.Key
}

export function QuoteReveal({
  children,
  delay = 0,
  className = "",
}: QuoteRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`will-animate transition-all duration-[1800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-12"
        } ${className}`}
      style={{
        filter: isVisible ? "blur(0px)" : "blur(6px)",
        transitionProperty: "opacity, transform, filter",
      }}
    >
      {children}
    </div>
  )
}
