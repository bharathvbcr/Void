"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { InteractiveImage } from "./interactive-image"
import { useHaptic } from "@/hooks/use-haptic"
import { siteConfig } from "@/config/site"

export function TouchToRemember() {
  const { trigger } = useHaptic()
  const [holding, setHolding] = useState(false)
  const [blurAmount, setBlurAmount] = useState(20)
  const [revealed, setRevealed] = useState(false)
  const [inView, setInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

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

  const startHold = useCallback(() => {
    setHolding(true)
    setRevealed(true)
    trigger("hold")
    intervalRef.current = setInterval(() => {
      setBlurAmount((prev) => Math.max(prev - 0.5, 0))
    }, 30)
  }, [trigger])

  const endHold = useCallback(() => {
    setHolding(false)
    trigger("release")
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setBlurAmount((prev) => {
        if (prev >= 20) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          return 20
        }
        return prev + 0.8
      })
    }, 30)
  }, [trigger])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="weight"
      className="relative w-full py-20 bg-void-deep overflow-hidden"
    >
      <div
        className={`transition-all duration-[2000ms] ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        style={{ filter: inView ? "blur(0)" : "blur(4px)", transitionProperty: "all" }}
      >
        {/* Instruction */}
        <div className="text-center mb-8 px-6">
          <p className="font-sans text-[9px] tracking-[0.6em] uppercase text-rose/25 mb-4">
            {siteConfig.touchToRemember.label}
          </p>
          <p className="font-serif text-sm text-muted-foreground/40 italic">
            {siteConfig.touchToRemember.instruction}
          </p>
        </div>

        {/* Interactive image */}
        <div className="relative max-w-[300px] mx-auto px-6">
          <div
            className={`relative aspect-[3/4] rounded-xl overflow-hidden border transition-all duration-300 ${holding
                ? "border-rose/20 shadow-[0_0_40px_-10px_hsl(344_30%_63%_/_0.15)]"
                : "border-rose/[0.06]"
              }`}
            role="img"
            aria-label="Press and hold to slowly reveal a memory photograph of friends together. Release to let the memory fade back."
          >
            <InteractiveImage
              onHoldStart={startHold}
              onHoldEnd={endHold}
              src={siteConfig.hero.image.src}
              alt={siteConfig.hero.image.alt}
              fill
              sizes="(max-width: 768px) 88vw, 300px"
              className="object-cover transition-transform duration-1000 select-none touch-callout-none"
              style={{
                filter: `blur(${blurAmount}px) saturate(${holding ? 1.1 : 0.6})`,
                transform: `scale(${1.05 + blurAmount * 0.003})`,
              }}
              draggable={false}
            />

            {/* Overlay that fades as image unblurs */}
            <div
              className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 30%, hsl(0 0% 5% / 0.7) 100%)",
                opacity: Math.min(blurAmount / 20, 1),
              }}
            />

            {/* Pulsing ring when holding */}
            {holding && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-16 h-16 rounded-full border border-rose/30"
                  style={{
                    animation: "breathe 2s ease-in-out infinite",
                  }}
                />
              </div>
            )}
          </div>

          {/* Caption beneath */}
          <div className="mt-6 text-center">
            <p
              className={`font-serif text-xs italic transition-all duration-1000 ${holding ? "text-rose/50" : "text-muted-foreground/20"
                }`}
            >
              {holding
                ? siteConfig.touchToRemember.holdingText
                : revealed
                  ? siteConfig.touchToRemember.revealedText
                  : "\u00A0"}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
