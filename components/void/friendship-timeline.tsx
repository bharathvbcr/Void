"use client"

import { useEffect, useRef, useState } from "react"
import { WordByWord } from "./word-by-word"
import { useHaptic } from "@/hooks/use-haptic"
import { siteConfig } from "@/config/site"

const MILESTONES = siteConfig.milestones

function MilestoneIcon({ icon, mood }: { icon: string; mood: string }) {
  const color =
    mood === "cold"
      ? "hsl(0 0% 30%)"
      : mood === "bright"
        ? "hsl(344 35% 68%)"
        : "hsl(344 30% 63%)"

  switch (icon) {
    case "spark":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 1V5M7 9V13M1 7H5M9 7H13" stroke={color} strokeWidth="1" strokeLinecap="round" />
          <path d="M3.5 3.5L5.5 5.5M8.5 8.5L10.5 10.5M10.5 3.5L8.5 5.5M5.5 8.5L3.5 10.5" stroke={color} strokeWidth="0.7" strokeLinecap="round" opacity="0.5" />
        </svg>
      )
    case "message":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect x="1.5" y="2" width="11" height="8" rx="2" stroke={color} strokeWidth="0.8" />
          <path d="M4 5.5H10M4 7.5H8" stroke={color} strokeWidth="0.6" strokeLinecap="round" opacity="0.6" />
          <path d="M3.5 10L5.5 12V10" stroke={color} strokeWidth="0.8" />
        </svg>
      )
    case "road":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M3 12L5.5 2" stroke={color} strokeWidth="0.8" strokeLinecap="round" />
          <path d="M11 12L8.5 2" stroke={color} strokeWidth="0.8" strokeLinecap="round" />
          <path d="M7 4V5.5M7 7.5V9M7 11V12" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeDasharray="1.5 2" />
        </svg>
      )
    case "horizon":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 10H13" stroke={color} strokeWidth="0.8" strokeLinecap="round" />
          <path d="M7 2L7 8" stroke={color} strokeWidth="0.6" strokeLinecap="round" opacity="0.5" />
          <circle cx="7" cy="5" r="2.5" stroke={color} strokeWidth="0.8" />
          <path d="M3 10C3 8 5 6.5 7 6.5C9 6.5 11 8 11 10" stroke={color} strokeWidth="0.5" opacity="0.3" />
        </svg>
      )
    case "film":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect x="1.5" y="3" width="11" height="8" rx="1.5" stroke={color} strokeWidth="0.8" />
          <path d="M1.5 5.5H12.5M1.5 8.5H12.5" stroke={color} strokeWidth="0.4" opacity="0.3" />
          <circle cx="7" cy="7" r="1.5" stroke={color} strokeWidth="0.8" />
          <path d="M6.2 6.2L8.2 7L6.2 7.8Z" fill={color} opacity="0.5" />
        </svg>
      )
    case "void":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />
          <circle cx="7" cy="7" r="2" stroke={color} strokeWidth="0.5" opacity="0.3" />
        </svg>
      )
    default:
      return null
  }
}

export function FriendshipTimeline() {
  return (
    <section className="relative w-full py-12 bg-void-deep overflow-hidden">
      {/* Section header */}
      <TimelineHeader />

      {/* The timeline */}
      <div className="relative max-w-sm mx-auto px-6">
        {/* The vertical thread line */}
        <div className="absolute left-[30px] top-0 bottom-0 w-px">
          <TimelineThread />
        </div>

        {/* Milestones */}
        <div className="flex flex-col gap-0">
          {MILESTONES.map((milestone, i) => (
            <TimelineMilestone
              key={i}
              milestone={milestone}
              index={i}
              isLast={i === MILESTONES.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to top, hsl(0 0% 7%) 0%, transparent 100%)",
        }}
      />
    </section>
  )
}

function TimelineHeader() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`text-center mb-8 px-6 transition-all duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      style={{
        filter: inView ? "blur(0)" : "blur(4px)",
        transitionProperty: "all",
      }}
    >
      <div className="flex justify-center items-center gap-3 mb-5">
        <span className="inline-block w-8 h-px bg-rose/20" />
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose/30" />
        <span className="inline-block w-8 h-px bg-rose/20" />
      </div>
      <h2 className="font-serif text-lg text-rose/70 tracking-tight text-balance animate-text-glow">
        {siteConfig.friendshipTimeline.header}
      </h2>
      <p className="mt-3 font-sans text-[10px] tracking-[0.4em] uppercase text-muted-foreground/30">
        {siteConfig.friendshipTimeline.subtitle}
      </p>
    </div>
  )
}

function TimelineThread() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="relative w-full h-full">
      {/* Main thread -- grows downward */}
      <div
        className="absolute top-0 left-0 w-full transition-all ease-out"
        style={{
          height: inView ? "100%" : "0%",
          transitionDuration: "4000ms",
          transitionDelay: "500ms",
          background:
            "linear-gradient(to bottom, hsl(344 30% 63% / 0.3) 0%, hsl(344 30% 63% / 0.2) 70%, hsl(0 0% 25% / 0.15) 90%, hsl(0 0% 20% / 0.05) 100%)",
        }}
      />
      {/* Glow on the thread */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3 transition-all ease-out"
        style={{
          height: inView ? "75%" : "0%",
          transitionDuration: "4000ms",
          transitionDelay: "500ms",
          background:
            "linear-gradient(to bottom, hsl(344 30% 63% / 0.08) 0%, transparent 100%)",
          filter: "blur(4px)",
        }}
      />
    </div>
  )
}

function TimelineMilestone({
  milestone,
  index,
  isLast,
}: {
  milestone: (typeof MILESTONES)[number]
  index: number
  isLast: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const { trigger } = useHaptic()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          trigger(isLast ? "heartbeat" : "reveal")
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [trigger, isLast])

  const isCold = milestone.mood === "cold"
  const dotColor = isCold
    ? "bg-muted-foreground/20 border-muted-foreground/10"
    : "bg-rose/30 border-rose/20"
  const glowColor = isCold
    ? "hsl(0 0% 30% / 0.05)"
    : "hsl(344 30% 63% / 0.08)"

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-5 transition-all duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isLast ? "pb-0" : "pb-6"
        } ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{
        transitionDelay: `${index * 300 + 200}ms`,
        filter: inView ? "blur(0)" : "blur(3px)",
        transitionProperty: "all",
      }}
    >
      {/* Dot on the thread */}
      <div className="relative flex-shrink-0 w-[18px] flex justify-center pt-1 z-10">
        {/* Ambient glow behind dot */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full pointer-events-none transition-opacity duration-[2000ms] ${inView ? "opacity-100" : "opacity-0"
            }`}
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            transitionDelay: `${index * 300 + 600}ms`,
          }}
        />
        {/* The dot */}
        <div
          className={`w-[9px] h-[9px] rounded-full border ${dotColor} transition-all duration-[1200ms] ${inView ? "scale-100" : "scale-0"
            }`}
          style={{ transitionDelay: `${index * 300 + 400}ms` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0">
        {/* Milestone number */}
        <div className="flex items-center gap-2.5 mb-2">
          <span
            className={`font-sans text-[9px] tracking-[0.3em] uppercase ${isCold ? "text-muted-foreground/20" : "text-rose/25"
              }`}
          >
            {isLast ? "\u2022 \u2022 \u2022" : String(index + 1).padStart(2, "0")}
          </span>
          <MilestoneIcon icon={milestone.icon} mood={milestone.mood} />
        </div>

        {/* Label */}
        <h3
          className={`font-serif text-base leading-snug mb-2.5 ${isCold
              ? "text-muted-foreground/30 line-through decoration-muted-foreground/10"
              : "text-foreground/80"
            }`}
        >
          {milestone.label}
        </h3>

        {/* Description with word-by-word reveal */}
        <p
          className={`font-sans text-[12.5px] leading-[1.9] ${isCold ? "text-muted-foreground/25 italic" : "text-muted-foreground/55"
            }`}
        >
          {inView ? (
            <WordByWord
              text={milestone.description}
              wordDelay={isCold ? 90 : 50}
              startDelay={index * 300 + 700}
            />
          ) : (
            <span className="opacity-0">{milestone.description}</span>
          )}
        </p>

        {/* Small feeling tag for non-cold milestones */}
        {!isCold && (
          <div
            className={`mt-3 transition-all duration-[1500ms] ${inView ? "opacity-100" : "opacity-0"
              }`}
            style={{ transitionDelay: `${index * 300 + 1200}ms` }}
          >
            <span className="inline-block font-sans text-[8px] tracking-[0.4em] uppercase text-rose/20 border border-rose/[0.06] rounded-full px-2.5 py-0.5">
              {index === 0
                ? siteConfig.friendshipTimeline.tags.beginning
                : index === 3
                  ? siteConfig.friendshipTimeline.tags.bestDay
                  : siteConfig.friendshipTimeline.tags.chapter}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
