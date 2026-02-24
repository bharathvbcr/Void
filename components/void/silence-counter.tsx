"use client"

import React, { useEffect, useRef, useState } from "react"
import { TearDrops } from "./tear-drops"
import { useHaptic } from "@/hooks/use-haptic"
import { siteConfig } from "@/config/site"

// The moment the silence began -- set as a meaningful date
const SILENCE_START = new Date(siteConfig.silenceCounter.startDate)

function getElapsed() {
  const now = new Date()
  const diff = now.getTime() - SILENCE_START.getTime()

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

export function SilenceCounter() {
  const [elapsed, setElapsed] = useState<ReturnType<typeof getElapsed> | null>(null)
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
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
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [trigger])

  useEffect(() => {
    setElapsed(getElapsed())
    const timer = setInterval(() => setElapsed(getElapsed()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section ref={ref} className="relative w-full py-20 bg-void-deep overflow-hidden">
      {/* Tears falling in the background */}
      {inView && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <TearDrops count={3} intensity="steady" color="199, 125, 146" />
        </div>
      )}
      <div
        className={`transition-all duration-[2500ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        style={{ filter: inView ? "blur(0)" : "blur(6px)", transitionProperty: "all" }}
      >
        {/* Label */}
        <div className="text-center mb-10 px-6">
          <p className="font-serif text-sm text-muted-foreground/35 italic leading-relaxed">
            {siteConfig.silenceCounter.label}
          </p>
        </div>

        {/* Counter */}
        <div className="flex justify-center items-start gap-3 px-6">
          <CounterUnit value={elapsed?.days ?? 0} label={siteConfig.silenceCounter.units.days} inView={inView} delay={0} />
          <span className="text-rose/20 font-serif text-lg mt-3">:</span>
          <CounterUnit value={elapsed?.hours ?? 0} label={siteConfig.silenceCounter.units.hours} inView={inView} delay={100} />
          <span className="text-rose/20 font-serif text-lg mt-3">:</span>
          <CounterUnit value={elapsed?.minutes ?? 0} label={siteConfig.silenceCounter.units.minutes} inView={inView} delay={200} />
          <span className="text-rose/20 font-serif text-lg mt-3">:</span>
          <CounterUnit value={elapsed?.seconds ?? 0} label={siteConfig.silenceCounter.units.seconds} inView={inView} delay={300} />
        </div>

        {/* Beneath */}
        <div className="text-center mt-10 px-6">
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-rose/15">
            {siteConfig.silenceCounter.subtext}
          </p>
        </div>
      </div>
    </section>
  )
}

const CounterUnit = React.memo(function CounterUnit({
  value,
  label,
  inView,
  delay,
}: {
  value: number
  label: string
  inView: boolean
  delay: number
}) {
  return (
    <div
      className={`flex flex-col items-center transition-all duration-[1500ms] ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      style={{ transitionDelay: `${delay + 800}ms` }}
    >
      <div className="relative w-14 h-14 rounded-lg border border-rose/[0.08] flex items-center justify-center bg-[hsl(0_0%_8%)]">
        {/* Inner glow */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsl(344 30% 63% / 0.03) 0%, transparent 70%)",
          }}
        />
        <span className="font-sans text-xl font-light text-foreground/80 tabular-nums relative z-10">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-2 font-sans text-[8px] tracking-[0.3em] uppercase text-muted-foreground/25">
        {label}
      </span>
    </div>
  )
})
