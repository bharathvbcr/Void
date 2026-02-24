"use client"

import { useEffect, useRef, useState } from "react"
import { QuoteReveal } from "./quote-reveal"
import { Typewriter } from "./typewriter"
import { useHaptic } from "@/hooks/use-haptic"
import { siteConfig } from "@/config/site"

export function PhaseTransition() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const { trigger } = useHaptic()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          trigger("sectionSnap")
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [trigger])

  return (
    <section
      ref={ref}
      className="relative w-full bg-void-deep py-32 flex flex-col items-center justify-center overflow-hidden"
      id="closure"
    >
      {/* Expanding ink circle */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-[3000ms] ease-out ${
          inView ? "w-[600px] h-[600px] opacity-100" : "w-0 h-0 opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(circle, hsl(40 30% 55% / 0.03) 0%, hsl(344 30% 63% / 0.02) 40%, transparent 70%)",
        }}
      />

      {/* Color transition: rose to warm gold */}
      <div
        className={`absolute inset-0 transition-opacity duration-[4000ms] ${
          inView ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(40 20% 15% / 0.15) 0%, transparent 60%)",
        }}
      />

      {/* Horizontal breath line */}
      <div className="relative w-full max-w-xs mx-auto mb-12">
        <div
          className={`h-px mx-auto transition-all duration-[2500ms] ease-out ${
            inView
              ? "w-full bg-gradient-to-r from-transparent via-rose/30 to-transparent"
              : "w-0 bg-transparent"
          }`}
        />
      </div>

      <QuoteReveal>
        <div className="relative z-10 text-center px-6 max-w-sm mx-auto">
          {/* Phase label with ornament */}
          <div className="mb-8 flex justify-center gap-3 items-center">
            <span className="inline-block w-2 h-px bg-gold/30" />
            <span className="inline-block w-1 h-1 rounded-full bg-gold/25" />
            <span className="text-[10px] tracking-[0.5em] uppercase text-gold/50 font-sans">
              {siteConfig.phaseTransition.label}
            </span>
            <span className="inline-block w-1 h-1 rounded-full bg-gold/25" />
            <span className="inline-block w-2 h-px bg-gold/30" />
          </div>

          <p className="font-serif text-base text-muted-foreground/50 leading-relaxed italic">
            <Typewriter
              text={siteConfig.phaseTransition.text}
              speed={60}
              startDelay={800}
            />
          </p>

          {/* Arrow pointing down */}
          <div
            className={`mt-12 flex flex-col items-center gap-1 transition-all duration-[2000ms] delay-[3000ms] ${
              inView ? "opacity-40" : "opacity-0"
            }`}
          >
            <span className="inline-block w-px h-10 bg-gradient-to-b from-transparent via-gold/20 to-gold/40" />
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold/30" />
          </div>
        </div>
      </QuoteReveal>

      {/* Bottom horizontal line */}
      <div className="relative w-full max-w-xs mx-auto mt-12">
        <div
          className={`h-px mx-auto transition-all duration-[2500ms] delay-500 ease-out ${
            inView
              ? "w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent"
              : "w-0 bg-transparent"
          }`}
        />
      </div>
    </section>
  )
}
