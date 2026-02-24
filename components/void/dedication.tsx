"use client"

import React, { useEffect, useRef, useState } from "react"
import { TearDrops } from "./tear-drops"
import { useHaptic } from "@/hooks/use-haptic"
import { siteConfig } from "@/config/site"

export function Dedication() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const { trigger } = useHaptic()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          trigger("reveal")
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [trigger])

  const { dedication } = siteConfig

  return (
    <section ref={ref} className="relative w-full py-20 bg-void-deep overflow-hidden">
      {/* Gentle tears during the dedication */}
      {inView && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <TearDrops count={3} intensity="gentle" color={siteConfig.theme.colors.gold} />
        </div>
      )}

      {/* Ambient warm shift */}
      <div
        className={`absolute inset-0 transition-opacity duration-[4000ms] pointer-events-none ${
          inView ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(40 20% 12% / 0.1) 0%, transparent 60%)",
        }}
      />

      <div
        className={`relative z-10 text-center px-6 max-w-sm mx-auto transition-all duration-[3000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
        style={{ filter: inView ? "blur(0)" : "blur(8px)", transitionProperty: "all" }}
      >
        {/* Ornamental top */}
        <div className="mb-8 flex justify-center items-center gap-2">
          <span className="inline-block w-8 h-px bg-gold/15" />
          <span className="inline-block w-1.5 h-1.5 rounded-full border border-gold/15" />
          <span className="inline-block w-8 h-px bg-gold/15" />
        </div>

        <p className="font-sans text-[9px] tracking-[0.6em] uppercase text-gold/30 mb-6">
          {dedication.heading}
        </p>

        <p className="font-serif text-base text-muted-foreground/50 italic leading-relaxed mb-4">
          {dedication.text1}
          <span className="text-gold/60 animate-text-glow">
            {dedication.text1Highlight}
          </span>
        </p>

        <p className="font-serif text-sm text-muted-foreground/30 leading-relaxed">
          {dedication.text2}
          <span className="text-foreground/50">
            {dedication.text2Highlight}
          </span>
        </p>

        {/* Ornamental bottom */}
        <div className="mt-10 flex justify-center items-center gap-2">
          <span className="inline-block w-12 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
        </div>
      </div>
    </section>
  )
}

