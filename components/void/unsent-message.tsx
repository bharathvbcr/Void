"use client"

import { useEffect, useRef, useState } from "react"
import { Typewriter } from "./typewriter"
import { useHaptic } from "@/hooks/use-haptic"
import { TearDrops } from "./tear-drops"
import { siteConfig } from "@/config/site"

export function UnsentMessage() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const { trigger } = useHaptic()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          trigger("medium")
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const { unsentMessage } = siteConfig

  return (
    <section
      ref={ref}
      className="relative w-full py-20 overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, hsl(0 0% 5%) 0%, hsl(0 0% 4%) 100%)",
      }}
    >
      {/* Tears falling while the unsent message types */}
      {inView && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <TearDrops count={5} intensity="steady" color="199, 125, 146" />
        </div>
      )}
      <div
        className={`transition-all duration-[2500ms] ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{ filter: inView ? "blur(0)" : "blur(6px)", transitionProperty: "all" }}
      >
        {/* Label */}
        <div className="text-center mb-10 px-6">
          <p className="font-sans text-[9px] tracking-[0.6em] uppercase text-rose/25 mb-3">
            {unsentMessage.title}
          </p>
          <p className="font-serif text-xs text-muted-foreground/25 italic">
            {unsentMessage.subtitle}
          </p>
        </div>

        {/* Fake phone message UI */}
        <div className="max-w-[320px] mx-auto px-6">
          {/* Chat header */}
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-rose/[0.05]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[hsl(344_15%_15%)] flex items-center justify-center">
                <span className="font-sans text-[10px] text-rose/40">
                  {unsentMessage.recipientName[0]}
                </span>
              </div>
              <div>
                <p className="font-sans text-xs text-foreground/50">{unsentMessage.recipientName}</p>
                <p className="font-sans text-[9px] text-muted-foreground/30">{unsentMessage.status}</p>
              </div>
            </div>
            <span className="font-sans text-[9px] tracking-wider text-muted-foreground/20 uppercase">
              {unsentMessage.appLabel}
            </span>
          </div>

          {/* Old message from her -- delivered, read */}
          <div className="flex justify-start mb-4">
            <div className="max-w-[85%] bg-[hsl(0_0%_12%)] rounded-2xl rounded-bl-sm px-4 py-3">
              <p className="font-sans text-[13px] text-foreground/50 leading-relaxed">
                {unsentMessage.receivedMessage}
              </p>
              <div className="flex justify-end items-center gap-1 mt-1">
                <span className="font-sans text-[9px] text-muted-foreground/25">
                  Read
                </span>
              </div>
            </div>
          </div>

          {/* Time gap indicator */}
          <div className="text-center my-6">
            <span className="font-sans text-[9px] text-muted-foreground/20 bg-[hsl(0_0%_8%)] px-3 py-1 rounded-full">
              {unsentMessage.timeGapText}
            </span>
          </div>

          {/* Your unsent message -- typing, never sent */}
          <div className="flex justify-end mb-3">
            <div className="max-w-[85%] bg-[hsl(344_20%_12%)] rounded-2xl rounded-br-sm px-4 py-3 border border-rose/[0.08]">
              <p className="font-sans text-[13px] text-foreground/60 leading-relaxed">
                {inView ? (
                  <Typewriter
                    text={unsentMessage.draftMessage}
                    speed={45}
                    startDelay={1200}
                    cursor={true}
                  />
                ) : (
                  "\u00A0"
                )}
              </p>
            </div>
          </div>

          {/* Draft indicator */}
          <div className="flex justify-end">
            <span
              className={`font-sans text-[9px] text-rose/30 italic transition-all duration-[1500ms] delay-[10000ms] ${
                inView ? "opacity-100" : "opacity-0"
              }`}
            >
              {unsentMessage.draftLabel}
            </span>
          </div>


          {/* Fake input bar */}
          <div className="mt-8 flex items-center gap-3 border border-rose/[0.06] rounded-full px-4 py-3 bg-[hsl(0_0%_7%)]">
            <div className="flex-1">
              <span className="font-sans text-[12px] text-muted-foreground/20">
                {unsentMessage.inputPlaceholder}
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-rose/10 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M10.5 1.5L5.5 6.5M10.5 1.5L7 10.5L5.5 6.5M10.5 1.5L1.5 5L5.5 6.5"
                  stroke="hsl(344 30% 63%)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.4"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
