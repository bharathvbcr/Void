"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useHaptic } from "@/hooks/use-haptic"
import { TearDrops } from "./tear-drops"
import { siteConfig } from "@/config/site"

export function ClosureCard() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { trigger } = useHaptic()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          trigger("success")
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const { closureLetter } = siteConfig

  return (
    <section
      ref={ref}
      className="relative w-full py-20 px-4 flex items-center justify-center min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, hsl(0 0% 4%) 0%, hsl(30 6% 8%) 15%, hsl(35 8% 11%) 50%, hsl(30 6% 8%) 85%, hsl(0 0% 5%) 100%)",
      }}
    >
      {/* Tears -- heavy during the letter */}
      {isVisible && (
        <div className="absolute inset-0 pointer-events-none z-[1]">
          <TearDrops count={6} intensity="heavy" color="180, 150, 120" />
        </div>
      )}

      {/* Ambient warm bokeh glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 25% 25%, hsl(40 50% 55% / 0.06) 0%, transparent 45%), radial-gradient(circle at 75% 65%, hsl(40 50% 55% / 0.04) 0%, transparent 35%), radial-gradient(circle at 50% 80%, hsl(40 40% 50% / 0.03) 0%, transparent 30%)",
        }}
      />

      {/* Floating warm orbs */}
      <div
        className="absolute top-[20%] left-[15%] w-3 h-3 rounded-full animate-float pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(40 50% 70% / 0.15) 0%, transparent 70%)",
          animationDuration: "8s",
        }}
      />
      <div
        className="absolute top-[60%] right-[10%] w-4 h-4 rounded-full animate-float pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(40 50% 70% / 0.1) 0%, transparent 70%)",
          animationDuration: "10s",
          animationDelay: "3s",
        }}
      />
      <div
        className="absolute bottom-[25%] left-[25%] w-2 h-2 rounded-full animate-float pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(40 50% 70% / 0.12) 0%, transparent 70%)",
          animationDuration: "7s",
          animationDelay: "1.5s",
        }}
      />

      {/* The Card */}
      <div
        className={`relative w-full max-w-md mx-auto overflow-hidden rounded-xl card-warm-glow gpu-layer will-animate transition-all duration-[2500ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-16 scale-[0.92]"
        }`}
        style={{
          boxShadow: isVisible
            ? "0 30px 100px -25px hsl(40 30% 20% / 0.35), 0 0 50px -15px hsl(40 50% 55% / 0.06), inset 0 1px 0 0 hsl(40 40% 80% / 0.15)"
            : "none",
        }}
      >
        {/* Card background image */}
        <div className="absolute inset-0">
          <Image
            src={closureLetter.bgImage}
            alt=""
            fill
            sizes="(max-width: 768px) 95vw, 448px"
            className="object-cover"
          />
          {/* Layered overlays for depth */}
          <div className="absolute inset-0 bg-[hsl(35_20%_95%_/_0.85)]" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, hsl(40 30% 90% / 0.3) 0%, transparent 50%)",
            }}
          />
        </div>

        {/* Corner flourishes (delicate) */}
        <CornerFlourish position="top-left" />
        <CornerFlourish position="top-right" />
        <CornerFlourish position="bottom-left" />
        <CornerFlourish position="bottom-right" />

        {/* Card Content */}
        <div className="relative z-10 px-8 py-14 sm:px-10 sm:py-16">
          {/* Top ornamental header */}
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-10 h-px bg-[hsl(40_30%_55%_/_0.35)]" />
              <OrnamentalDiamond />
              <span className="inline-block w-10 h-px bg-[hsl(40_30%_55%_/_0.35)]" />
            </div>
            <span
              className={`text-[10px] tracking-[0.5em] uppercase font-sans transition-all duration-[1500ms] delay-300 ${
                isVisible
                  ? "opacity-40 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
              style={{ color: "hsl(40 30% 45%)" }}
            >
              {closureLetter.title}
            </span>
          </div>

          {/* Letter content */}
          <div className="space-y-5 text-center">
            {closureLetter.paragraphs.map((text, i) => (
              <LetterParagraph
                key={i}
                delay={400 + i * 300}
                isVisible={isVisible}
                isLast={i === closureLetter.paragraphs.length - 1}
              >
                {text}
              </LetterParagraph>
            ))}
          </div>

          {/* Bottom seal */}
          <div className="flex flex-col items-center mt-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-10 h-px bg-[hsl(40_30%_55%_/_0.35)]" />
              <OrnamentalDiamond />
              <span className="inline-block w-10 h-px bg-[hsl(40_30%_55%_/_0.35)]" />
            </div>
            {/* Wax seal impression */}
            <div
              className={`mt-4 w-12 h-12 rounded-full border border-[hsl(40_30%_55%_/_0.2)] flex items-center justify-center transition-all duration-[2000ms] delay-[2200ms] ${
                isVisible ? "opacity-30 scale-100" : "opacity-0 scale-50"
              }`}
            >
              <div className="w-8 h-8 rounded-full border border-[hsl(40_30%_55%_/_0.15)] flex items-center justify-center">
                <span className="font-serif text-[10px] text-[hsl(40_30%_45%)] italic">
                  {closureLetter.signature}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


function LetterParagraph({
  children,
  delay,
  isVisible,
  isLast = false,
}: {
  children: React.ReactNode
  delay: number
  isVisible: boolean
  isLast?: boolean
}) {
  return (
    <p
      className={`font-serif text-[13px] sm:text-[14.5px] leading-[2] transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isLast ? "text-[hsl(30_15%_30%)] font-medium" : "text-[hsl(30_10%_28%)]"
      } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{
        transitionDuration: "1500ms",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </p>
  )
}

function OrnamentalDiamond() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect
        x="4"
        y="0.5"
        width="5"
        height="5"
        rx="0.5"
        transform="rotate(45 4 0.5)"
        stroke="hsl(40 40% 55%)"
        strokeWidth="0.5"
        fill="none"
        opacity="0.4"
      />
    </svg>
  )
}

function CornerFlourish({
  position,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}) {
  const positionClasses = {
    "top-left": "top-5 left-5",
    "top-right": "top-5 right-5 -scale-x-100",
    "bottom-left": "bottom-5 left-5 -scale-y-100",
    "bottom-right": "bottom-5 right-5 -scale-x-100 -scale-y-100",
  }

  return (
    <div
      className={`absolute z-10 w-12 h-12 ${positionClasses[position]}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full opacity-25"
      >
        <path
          d="M2 46C2 24 10 10 46 2"
          stroke="hsl(40 40% 55%)"
          strokeWidth="0.5"
          strokeLinecap="round"
        />
        <path
          d="M7 46C7 26 14 14 46 7"
          stroke="hsl(40 40% 55%)"
          strokeWidth="0.3"
          strokeLinecap="round"
        />
        <path
          d="M12 46C12 28 18 18 46 12"
          stroke="hsl(40 40% 55%)"
          strokeWidth="0.2"
          strokeLinecap="round"
        />
        <circle cx="4" cy="44" r="1.2" fill="hsl(40 40% 55% / 0.35)" />
        <circle cx="9" cy="44" r="0.6" fill="hsl(40 40% 55% / 0.2)" />
      </svg>
    </div>
  )
}
