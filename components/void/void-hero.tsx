"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import { ParticleField } from "./particle-field"
import { useIsMobile } from "@/hooks/use-mobile"
import { VoidLogo } from "./void-logo"

export function VoidHero() {
  const [phase, setPhase] = useState(0) // 0=hidden, 1=label, 2=question, 3=subtitle
  const ref = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2800),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden scan-line gpu-layer"
      id="void"
    >
      {/* Background image with liquid glass overlay */}
      <div className="absolute inset-0 liquid-glass grain-overlay">
        <Image
          src={siteConfig.hero.image.src}
          alt={siteConfig.hero.image.alt}
          fill
          sizes="100vw"
          className="object-cover opacity-60 blur-[3px] scale-110"
          priority
        />
      </div>

      {/* Slow-breathing heartbeat ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full animate-heartbeat pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(344 30% 63% / 0.12) 0%, transparent 60%)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 25%, hsl(0 0% 5% / 0.35) 60%, hsl(0 0% 4% / 0.85) 100%)",
        }}
      />

      {/* Interactive particle field -- reduced on mobile for perf */}
      <ParticleField count={isMobile ? 15 : 30} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* 3D Logo */}
        <div className={`mb-8 transition-all duration-[2000ms] ease-out ${phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
          <Link href="/" aria-label="Home">
            <VoidLogo size={48} className="opacity-90 hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* Status bar */}
        <div
          className={`mb-6 flex items-center gap-3 transition-all duration-[1500ms] ease-out ${phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
        >
          <span className="inline-block w-6 h-px bg-rose/30" />
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose animate-rose-pulse" />
          <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground/70 font-sans">
            {siteConfig.hero.status}
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose/30" />
          <span className="inline-block w-6 h-px bg-rose/30" />
        </div>

        {/* Header question with glow */}
        <h1
          className={`font-serif text-[2rem] sm:text-4xl md:text-5xl leading-[1.2] text-rose tracking-tight transition-all duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${phase >= 2
            ? "opacity-100 translate-y-0 animate-text-glow"
            : "opacity-0 translate-y-10 blur-sm"
            }`}
        >
          <span className="text-balance">
            {siteConfig.hero.title.split("<br />").map((line, i) => (
              <span key={i}>
                {line}
                {i < siteConfig.hero.title.split("<br />").length - 1 && <br />}
              </span>
            ))}
          </span>
        </h1>

        {/* Animated separator */}
        <div className="relative mt-8 mb-10 h-px w-20 overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-rose/50 to-transparent transition-all duration-[2000ms] delay-500 ${phase >= 2 ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
              }`}
          />
        </div>

        {/* Subtle subtitle */}
        <p
          className={`max-w-[220px] text-[11px] leading-relaxed text-muted-foreground/50 font-sans tracking-widest uppercase transition-all duration-[2000ms] ease-out ${phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
        >
          {siteConfig.hero.subtitle}
        </p>
      </div>

      {/* Scroll indicator with trail */}
      <div
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 transition-all duration-[2000ms] delay-[3500ms] ${phase >= 3 ? "opacity-50" : "opacity-0"
          }`}
        aria-label={siteConfig.hero.enterLabel}
      >
        <span className="inline-block w-px h-8 bg-gradient-to-b from-transparent via-rose/30 to-rose/60" />
        <ChevronDown className="w-3.5 h-3.5 text-rose/50 animate-float" />
      </div>
    </section>
  )
}
