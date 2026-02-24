"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { siteConfig } from "@/config/site"
import { useHaptic } from "@/hooks/use-haptic"

const MEMORIES = siteConfig.memories

export function MemoryMosaic() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const { trigger } = useHaptic()
  const lastSnapRef = useRef(0)

  // Haptic feedback on snap (scroll stop detection)
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const el = scrollRef.current
    const snapIndex = Math.round(el.scrollLeft / 280)
    if (snapIndex !== lastSnapRef.current) {
      lastSnapRef.current = snapIndex
      trigger("light")
    }
  }, [trigger])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 overflow-hidden bg-void-deep"
    >
      {/* Section whisper */}
      <div
        className={`text-center mb-10 transition-all duration-[2000ms] ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        style={{ filter: inView ? "blur(0)" : "blur(4px)", transitionProperty: "all" }}
      >
        <p className="font-sans text-[9px] tracking-[0.6em] uppercase text-rose/30">
          {siteConfig.memoryMosaic.title}
        </p>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-none ios-scroll"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onScroll={handleScroll}
      >
        {MEMORIES.map((memory, i) => (
          <MemoryCard
            key={i}
            memory={memory}
            index={i}
            inView={inView}
          />
        ))}

        {/* Final empty card -- "the void" */}
        <div
          className={`flex-shrink-0 snap-center w-[260px] h-[340px] rounded-xl border border-dashed border-rose/10 flex flex-col items-center justify-center transition-all duration-[2000ms] ${inView ? "opacity-100" : "opacity-0"
            }`}
          style={{ transitionDelay: `${MEMORIES.length * 200 + 400}ms` }}
        >
          <div className="w-8 h-8 rounded-full border border-rose/10 flex items-center justify-center mb-4">
            <span className="inline-block w-2 h-px bg-rose/20" />
          </div>
          <p className="font-serif text-xs text-rose/20 italic">
            {siteConfig.memoryMosaic.emptyCardText}
          </p>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className={`mt-6 flex justify-center items-center gap-2 transition-all duration-[2000ms] delay-[1500ms] ${inView ? "opacity-30" : "opacity-0"
          }`}
      >
        <span className="inline-block w-4 h-px bg-rose/30" />
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-rose/30" aria-hidden="true">
          <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  )
}

interface QuoteRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  key?: React.Key
}

function MemoryCard({
  memory,
  index,
  inView,
}: {
  memory: { text: string; time: string }
  index: number
  inView: boolean
  key?: React.Key
}) {
  return (
    <div
      className={`flex-shrink-0 snap-center w-[260px] h-[340px] rounded-xl border border-rose/[0.06] relative overflow-hidden will-animate gpu-layer transition-all duration-[1800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      style={{
        transitionDelay: `${index * 200 + 300}ms`,
        background:
          "linear-gradient(160deg, hsl(0 0% 9%) 0%, hsl(344 10% 8%) 50%, hsl(0 0% 7%) 100%)",
      }}
    >
      {/* Inner glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, hsl(344 30% 63% / 0.04) 0%, transparent 60%)`,
        }}
      />

      {/* Time stamp */}
      <div className="absolute top-5 right-5">
        <span className="font-sans text-[10px] text-rose/25 tracking-wider">
          {memory.time}
        </span>
      </div>

      {/* Memory number */}
      <div className="absolute top-5 left-5">
        <span className="font-sans text-[10px] text-muted-foreground/20">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
        <div className="mb-6 w-6 h-px bg-rose/15" />
        <p className="font-serif text-[15px] leading-[1.8] text-foreground/70 text-balance italic">
          {memory.text}
        </p>
        <div className="mt-6 w-1 h-1 rounded-full bg-rose/20" />
      </div>

      {/* Bottom fade line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rose/10 to-transparent" />
    </div>
  )
}
