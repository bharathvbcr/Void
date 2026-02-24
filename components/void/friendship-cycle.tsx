"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useHaptic } from "@/hooks/use-haptic"
import { TearDrops } from "./tear-drops"
import { siteConfig } from "@/config/site"

// ─── Every real chapter of your story ────────────────────────────
const CHAPTERS = siteConfig.chapters

// ─── Chapter icons ───────────────────────────────────────────────
function ChapterIcon({ id, active, color }: { id: string; active: boolean; color: string }) {
  const a = active ? 0.8 : 0.2
  const s = 32
  const style: React.CSSProperties = {
    transition: "all 1s cubic-bezier(0.22,1,0.36,1)",
    opacity: active ? 1 : 0.25,
    transform: active ? "scale(1)" : "scale(0.7)",
    filter: active ? "none" : "blur(2px)",
  }

  switch (id) {
    case "strangers":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" style={style} aria-hidden="true">
          <circle cx="16" cy="12" r="4.5" stroke={`rgba(${color},${a})`} strokeWidth="1" />
          <path d="M8 28 Q16 19 24 28" stroke={`rgba(${color},${a})`} strokeWidth="1" fill="none" />
        </svg>
      )
    case "the-day-we-met":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" style={style} aria-hidden="true">
          <path d="M16 4V10M16 14V20M4 12H10M22 12H28" stroke={`rgba(${color},${a})`} strokeWidth="0.8" strokeLinecap="round" />
          <path d="M9 5L13 9M19 19L23 23M23 5L19 9M13 19L9 23" stroke={`rgba(${color},${a * 0.5})`} strokeWidth="0.6" strokeLinecap="round" />
          <circle cx="16" cy="12" r="2" fill={`rgba(${color},${a * 0.3})`} />
        </svg>
      )
    case "started-talking":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" style={style} aria-hidden="true">
          <rect x="4" y="6" width="18" height="12" rx="3" stroke={`rgba(${color},${a})`} strokeWidth="1" />
          <path d="M7 11H17M7 14H13" stroke={`rgba(${color},${a * 0.5})`} strokeWidth="0.6" strokeLinecap="round" />
          <path d="M7 18L10 22V18" stroke={`rgba(${color},${a})`} strokeWidth="1" />
          <circle cx="25" cy="9" r="1" fill={`rgba(${color},${a * 0.5})`} />
          <circle cx="27" cy="12" r="0.6" fill={`rgba(${color},${a * 0.3})`} />
        </svg>
      )
    case "jogging-days":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" style={style} aria-hidden="true">
          <path d="M6 26L10 4" stroke={`rgba(${color},${a})`} strokeWidth="0.8" strokeLinecap="round" />
          <path d="M26 26L22 4" stroke={`rgba(${color},${a})`} strokeWidth="0.8" strokeLinecap="round" />
          <path d="M16 8V11M16 14V17M16 20V23" stroke={`rgba(${color},${a})`} strokeWidth="0.8" strokeLinecap="round" strokeDasharray="3 3" />
          <circle cx="12" cy="15" r="1.5" fill={`rgba(${color},${a * 0.25})`} />
          <circle cx="20" cy="15" r="1.5" fill={`rgba(${color},${a * 0.25})`} />
        </svg>
      )
    case "road-trip":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" style={style} aria-hidden="true">
          <circle cx="16" cy="11" r="4.5" stroke={`rgba(${color},${a})`} strokeWidth="1" />
          <path d="M2 20H30" stroke={`rgba(${color},${a})`} strokeWidth="0.8" strokeLinecap="round" />
          <path d="M6 20C6 16 10 13 16 13C22 13 26 16 26 20" stroke={`rgba(${color},${a * 0.3})`} strokeWidth="0.5" fill="none" />
          <path d="M13 7L16 4L19 7" stroke={`rgba(${color},${a * 0.5})`} strokeWidth="0.6" fill="none" />
        </svg>
      )
    case "movie-day":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" style={style} aria-hidden="true">
          <rect x="4" y="8" width="24" height="16" rx="2.5" stroke={`rgba(${color},${a})`} strokeWidth="1" />
          <path d="M4 12H28M4 20H28" stroke={`rgba(${color},${a * 0.2})`} strokeWidth="0.4" />
          <circle cx="16" cy="16" r="3" stroke={`rgba(${color},${a})`} strokeWidth="1" />
          <path d="M14.5 14.5L18 16L14.5 17.5Z" fill={`rgba(${color},${a * 0.5})`} />
        </svg>
      )
    case "the-disconnect":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" style={style} aria-hidden="true">
          <circle cx="10" cy="12" r="4" stroke={`rgba(${color},${a})`} strokeWidth="1" />
          <circle cx="22" cy="12" r="4" stroke={`rgba(${color},${a * 0.3})`} strokeWidth="1" strokeDasharray="2 2" />
          <line x1="14" y1="14" x2="18" y2="14" stroke={`rgba(${color},${a * 0.2})`} strokeWidth="0.6" strokeDasharray="1 2" />
          <path d="M6 26 Q10 20 14 26" stroke={`rgba(${color},${a * 0.4})`} strokeWidth="0.8" fill="none" />
        </svg>
      )
    case "strangers-again":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" style={style} aria-hidden="true">
          <circle cx="16" cy="12" r="4.5" stroke={`rgba(${color},${a * 0.4})`} strokeWidth="0.8" strokeDasharray="2 3" />
          <path d="M8 28 Q16 19 24 28" stroke={`rgba(${color},${a * 0.25})`} strokeWidth="0.8" fill="none" strokeDasharray="2 3" />
          <text x="16" y="15" textAnchor="middle" fill={`rgba(${color},${a * 0.3})`} fontSize="6" fontFamily="serif">{"?"}</text>
        </svg>
      )
    default:
      return null
  }
}

// ─── Main component ──────────────────────────────────────────────
// Buffer: 1.5vh at top + bottom so user sees the section enter / exit cleanly
const BUFFER_VH = 0.75
const TOTAL_EXTRA_VH = BUFFER_VH * 2

export function FriendshipCycle() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [sectionInView, setSectionInView] = useState(false)
  const prevIndexRef = useRef(-1)
  const { trigger } = useHaptic()

  useEffect(() => setMounted(true), [])

  // Vertical scroll -> horizontal progress with buffer zones
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return

    // Throttle via rAF
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(() => {
        const container = containerRef.current
        if (!container) return

        const rect = container.getBoundingClientRect()
        const vh = window.innerHeight

        // How far has the container scrolled past the viewport top
        const scrolledPast = -rect.top
        const bufferPx = BUFFER_VH * vh
        const contentHeight = rect.height - TOTAL_EXTRA_VH * vh

        // Before top buffer: progress = 0 (header visible, no movement)
        // After bottom buffer: progress = 1 (last chapter locked)
        const progressInContent = (scrolledPast - bufferPx) / (contentHeight > 0 ? contentHeight : 1)
        const clamped = Math.max(0, Math.min(1, progressInContent))

        setScrollProgress(clamped)
        setSectionInView(rect.top < vh && rect.bottom > 0)

        const idx = Math.min(CHAPTERS.length - 1, Math.floor(clamped * CHAPTERS.length))
        setActiveIndex(idx)

        if (idx !== prevIndexRef.current && idx >= 0) {
          prevIndexRef.current = idx
          trigger(CHAPTERS[idx].haptic)
        }
      })
    }
  }, [trigger])

  useEffect(() => {
    if (!mounted) return
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [mounted, handleScroll])

  const total = CHAPTERS.length
  const tx = mounted ? -(scrollProgress * (total - 1) * 100) / total : 0

  return (
    <section
      ref={containerRef}
      className="relative bg-void-deep"
      style={{ height: `${total * 100 + TOTAL_EXTRA_VH * 100}vh` }}
      aria-label="The Story of Us - scroll to progress through chapters"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ── Top: progress line ── */}
        <div className="absolute top-0 left-0 right-0 z-30 h-[2px]">
          <div
            className="h-full transition-[width] duration-200 ease-out"
            style={{
              width: `${scrollProgress * 100}%`,
              background: "linear-gradient(90deg, rgba(90,90,90,0.15), rgba(199,125,146,0.4) 40%, rgba(138,107,114,0.3) 75%, rgba(74,69,69,0.12))",
            }}
          />
        </div>

        {/* ── Top: header — fades away as scrolling begins ── */}
        <div
          className="absolute top-0 left-0 right-0 z-30 text-center pointer-events-none flex flex-col items-center justify-center transition-all duration-1000"
          style={{
            paddingTop: "max(env(safe-area-inset-top, 0px), 20px)",
            opacity: scrollProgress < 0.02 ? 1 : Math.max(0, 1 - scrollProgress * 12),
            transform: scrollProgress < 0.02 ? "translateY(0)" : `translateY(-${scrollProgress * 60}px)`,
          }}
        >
          <div className="flex justify-center items-center gap-3 mb-1.5">
            <span className="inline-block w-6 h-px bg-rose/10" />
            <span className="inline-block w-1 h-1 rounded-full border border-rose/[0.08]" />
            <span className="inline-block w-6 h-px bg-rose/10" />
          </div>
          <p className="font-sans text-[8px] tracking-[0.5em] uppercase text-muted-foreground/20">
            {siteConfig.friendshipCycle.header}
          </p>
          <p className="mt-1 font-serif text-[10px] italic text-muted-foreground/15">
            {siteConfig.friendshipCycle.subtitle}
          </p>
          {/* Scroll hint that fades once scrolling starts */}
          <div
            className="mt-5 flex flex-col items-center gap-1 transition-opacity duration-700"
            style={{ opacity: scrollProgress < 0.01 && sectionInView ? 0.3 : 0 }}
          >
            <span className="inline-block w-px h-5 bg-gradient-to-b from-transparent to-rose/30" />
            <span className="font-sans text-[7px] tracking-[0.3em] uppercase text-muted-foreground/20">
              {siteConfig.friendshipCycle.scrollHint}
            </span>
          </div>
        </div>

        {/* ── Horizontal sliding track ── */}
        <div
          className="flex h-full gpu-layer"
          style={{
            width: `${total * 100}%`,
            transform: `translateX(${tx}%)`,
            transition: "transform 0.12s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {CHAPTERS.map((ch, i) => (
            <ChapterScene
              key={ch.id}
              chapter={ch}
              index={i}
              total={total}
              isActive={i === activeIndex}
              isPast={i < activeIndex}
            />
          ))}
        </div>

        {/* ── Bottom: navigation rail ── */}
        <div className="absolute bottom-16 left-0 right-0 z-30 pointer-events-none px-5 md:px-12">
          <div className="relative h-[2px] w-full">
            {/* track bg */}
            <div className="absolute inset-0 bg-muted-foreground/[0.04] rounded-full" />
            {/* progress fill */}
            <div
              className="absolute top-0 left-0 h-full rounded-full transition-[width] duration-200 ease-out"
              style={{
                width: `${scrollProgress * 100}%`,
                background: "linear-gradient(90deg, rgba(90,90,90,0.2), rgba(199,125,146,0.4) 45%, rgba(138,107,114,0.25) 70%, rgba(74,69,69,0.1))",
              }}
            />
            {/* dots */}
            {CHAPTERS.map((ch, i) => {
              const pos = (i / (total - 1)) * 100
              const reached = scrollProgress >= i / (total - 1) - 0.02
              const isCurrent = i === activeIndex
              return (
                <div
                  key={ch.id}
                  className="absolute top-1/2 flex flex-col items-center"
                  style={{ left: `${pos}%`, transform: "translateX(-50%) translateY(-50%)" }}
                >
                  <div
                    className="rounded-full transition-all duration-500"
                    style={{
                      width: isCurrent ? 10 : reached ? 5 : 3,
                      height: isCurrent ? 10 : reached ? 5 : 3,
                      background: reached ? ch.color.dot : "rgba(50,50,50,0.3)",
                      boxShadow: isCurrent
                        ? `0 0 10px 2px rgba(${ch.color.glow}, 0.2)`
                        : "none",
                    }}
                  />
                  {/* label */}
                  <span
                    className={`mt-3 text-[7px] tracking-[0.2em] uppercase font-sans whitespace-nowrap transition-all duration-500 ${isCurrent ? ch.color.text : reached ? "text-muted-foreground/15" : "text-muted-foreground/[0.06]"
                      }`}
                  >
                    {ch.number !== "..." ? ch.number : ""}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Bottom-right: chapter counter ── */}
        <div
          className="absolute bottom-7 right-5 z-30 pointer-events-none transition-opacity duration-500"
          style={{
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
            opacity: sectionInView ? 0.6 : 0,
          }}
        >
          <span className="font-mono text-[10px] text-muted-foreground/15 tracking-wider">
            {CHAPTERS[activeIndex]?.number}/{String(total - 1).padStart(2, "0")}
          </span>
        </div>

        {/* ── Bottom-left: "full circle" at final chapter ── */}
        {activeIndex === CHAPTERS.length - 1 && (
          <div
            className="absolute bottom-7 left-5 z-30 pointer-events-none animate-fade-in"
            style={{
              animationDuration: "2s",
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
          >
            <div className="flex items-center gap-2 opacity-20">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                <path
                  d="M12 5 C12 2 9 1 6 1 C3 1 1 2.5 1 5 C1 7.5 3 9 6 9"
                  stroke="rgba(74,69,69,0.6)"
                  strokeWidth="0.7"
                  fill="none"
                />
                <path d="M5 7.5 L6 9 L4 9" stroke="rgba(74,69,69,0.6)" strokeWidth="0.7" fill="none" />
              </svg>
              <span className="font-sans text-[7px] tracking-[0.3em] uppercase text-muted-foreground/15">
                {siteConfig.friendshipCycle.fullCircleLabel}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Individual chapter scene (each panel) ───────────────────────
function ChapterScene({
  chapter,
  index,
  total,
  isActive,
  isPast,
}: {
  chapter: (typeof CHAPTERS)[number]
  index: number
  total: number
  isActive: boolean
  isPast: boolean
}) {
  const isPeak = chapter.mood === "peak"
  const isFading = chapter.mood === "fading"
  const isVoid = chapter.mood === "void"
  const showTears = isActive && (isFading || isVoid)

  return (
    <div
      className="relative flex-shrink-0 h-full flex flex-col items-center justify-center px-6 md:px-12 overflow-hidden"
      style={{ width: `${100 / total}%` }}
      role="region"
      aria-label={`Chapter ${chapter.number}: ${chapter.label}`}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-[2000ms]"
        style={{
          opacity: isActive ? 1 : 0.1,
          background: `radial-gradient(ellipse at 50% 42%, rgba(${chapter.color.glow}, ${isPeak ? 0.07 : 0.03}) 0%, transparent 60%)`,
        }}
      />

      {/* Tear drops for emotional stages */}
      {showTears && (
        <div className="absolute inset-0 pointer-events-none z-[2]">
          <TearDrops
            count={isVoid ? 5 : 3}
            intensity={isVoid ? "steady" : "gentle"}
            color={chapter.color.glow}
          />
        </div>
      )}

      {/* Content */}
      <div
        className={`relative z-10 max-w-[300px] text-center transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive
          ? "opacity-100 translate-y-0 scale-100"
          : isPast
            ? "opacity-10 -translate-y-6 scale-[0.92]"
            : "opacity-0 translate-y-10 scale-[0.88]"
          }`}
        style={{
          filter: isActive ? "blur(0)" : isPast ? "blur(2px)" : "blur(5px)",
          transitionProperty: "opacity, transform, filter",
        }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div
            className="p-2.5 rounded-full transition-all duration-1000"
            style={{
              background: isActive ? `rgba(${chapter.color.glow}, 0.05)` : "transparent",
              boxShadow: isActive && isPeak
                ? `0 0 20px 5px rgba(${chapter.color.glow}, 0.07)`
                : "none",
            }}
          >
            <ChapterIcon id={chapter.id} active={isActive} color={chapter.color.glow} />
          </div>
        </div>

        {/* Chapter number */}
        <div className="mb-3 flex justify-center">
          <span
            className="font-mono text-[10px] tracking-[0.4em] uppercase transition-colors duration-1000"
            style={{
              color: isActive ? chapter.color.dot : "rgba(60,60,60,0.2)",
            }}
          >
            {chapter.number}
          </span>
        </div>

        {/* Label */}
        <h3
          className={`font-serif text-xl md:text-2xl mb-1.5 tracking-tight text-balance transition-all duration-1000 ${isPeak
            ? "text-rose/80 animate-text-glow"
            : isVoid
              ? "text-muted-foreground/20 line-through"
              : chapter.color.text
            }`}
          style={isVoid ? { textDecorationColor: "rgba(74,69,69,0.15)" } : undefined}
        >
          {chapter.label}
        </h3>

        {/* Subtitle tag */}
        <div className="mb-5 flex justify-center">
          <span
            className="inline-block px-2.5 py-0.5 rounded-full text-[8px] tracking-[0.35em] uppercase font-sans transition-all duration-1000"
            style={{
              background: isActive ? `rgba(${chapter.color.glow}, 0.05)` : "rgba(255,255,255,0.015)",
              color: isActive ? chapter.color.dot : "rgba(80,80,80,0.2)",
              border: `0.5px solid rgba(${chapter.color.glow}, ${isActive ? 0.1 : 0.02})`,
            }}
          >
            {chapter.subtitle}
          </span>
        </div>

        {/* Ornament */}
        <div className="flex justify-center mb-5">
          <div
            className="h-px transition-all duration-1000"
            style={{
              width: isActive ? 36 : 16,
              background: `linear-gradient(90deg, transparent, rgba(${chapter.color.glow}, ${isActive ? 0.25 : 0.06}), transparent)`,
            }}
          />
        </div>

        {/* Description */}
        <p
          className={`font-sans text-[12.5px] md:text-[13.5px] leading-[1.95] transition-all duration-[1500ms] ${isPeak ? "text-foreground/55" : isVoid ? "text-muted-foreground/20 italic" : isFading ? "text-muted-foreground/30" : "text-muted-foreground/45"
            }`}
          style={{
            filter: isActive ? "none" : "blur(1px)",
            transitionProperty: "opacity, color, filter",
          }}
        >
          {chapter.description}
        </p>

        {/* Personal quote at peak moments */}
        {isPeak && chapter.id === "road-trip" && isActive && (
          <div className="mt-8 relative">
            <div className="flex justify-center mb-3">
              <div
                className="h-px w-8"
                style={{ background: "linear-gradient(90deg, transparent, rgba(199,125,146,0.2), transparent)" }}
              />
            </div>
            <blockquote
              className="font-serif text-[11.5px] italic text-rose/35 leading-[1.85] animate-fade-in"
              style={{ animationDelay: "500ms", animationFillMode: "both", animationDuration: "2s" }}
            >
              {"\u201C"}{siteConfig.friendshipCycle.roadTripQuote}{"\u201D"}
            </blockquote>
          </div>
        )}

        {/* Final line at the void */}
        {isVoid && isActive && (
          <div className="mt-7 relative">
            <div className="flex justify-center mb-3">
              <div
                className="h-px w-6"
                style={{ background: "linear-gradient(90deg, transparent, rgba(74,69,69,0.12), transparent)" }}
              />
            </div>
            <p
              className="font-serif text-[10px] italic text-muted-foreground/12 tracking-wide leading-[1.8] animate-fade-in"
              style={{ animationDelay: "800ms", animationFillMode: "both", animationDuration: "2.5s" }}
            >
              {siteConfig.friendshipCycle.finalVoidText}
            </p>
          </div>
        )}
      </div>

      {/* Side ornament lines */}
      <div className="absolute left-3 top-1/4 bottom-1/4 w-px pointer-events-none">
        <div
          className="h-full transition-opacity duration-1000"
          style={{
            opacity: isActive ? 0.05 : 0.015,
            background: `linear-gradient(to bottom, transparent, rgba(${chapter.color.glow}, 0.12), transparent)`,
          }}
        />
      </div>
      <div className="absolute right-3 top-1/3 bottom-1/3 w-px pointer-events-none">
        <div
          className="h-full transition-opacity duration-1000"
          style={{
            opacity: isActive ? 0.035 : 0.01,
            background: `linear-gradient(to bottom, transparent, rgba(${chapter.color.glow}, 0.08), transparent)`,
          }}
        />
      </div>
    </div>
  )
}
