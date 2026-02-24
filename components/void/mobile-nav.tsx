"use client"

import { useEffect, useState, useRef } from "react"
import { useHaptic } from "@/hooks/use-haptic"
import Link from "next/link"
import { VoidLogo } from "./void-logo"
import { siteConfig } from "@/config/site"

export function MobileNav() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("void")
  const [scrollProgress, setScrollProgress] = useState(0)
  const { trigger } = useHaptic()
  const prevSection = useRef(activeSection)

  const getActiveSections = () => {
    const sections: string[] = ["void"]
    if (siteConfig.features.enableQuotes) sections.push("quotes")
    if (siteConfig.features.enableTouchToRemember) sections.push("weight")
    if (siteConfig.features.enableClosure) sections.push("closure")
    return sections
  }

  useEffect(() => {
    let ticking = false

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    const handleScroll = () => {
      const y = window.scrollY
      setScrolled(y > 60)

      // Calculate scroll progress
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? Math.min(y / docHeight, 1) : 0)

      // Detect active section
      const sections = getActiveSections()
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id)
        if (el && y >= el.offsetTop - 200) {
          setActiveSection(id)
          break
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Haptic on section change
  useEffect(() => {
    if (activeSection !== prevSection.current) {
      trigger("sectionSnap")
      prevSection.current = activeSection
    }
  }, [activeSection, trigger])

  const sectionsToRender = getActiveSections()

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled
        ? "bg-[hsl(0_0%_5%_/_0.85)] backdrop-blur-xl border-b border-rose/[0.03]"
        : "bg-transparent"
        }`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-px bg-rose/20" style={{ width: `${scrollProgress * 100}%` }} />

      <div className="flex items-center justify-between px-5 py-4">
        {/* Logo mark */}
        <Link href="/" className="flex items-center gap-2.5 group" onClick={() => trigger("light")}>
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Static glow backing */}
            <div className="absolute inset-0 bg-rose/20 blur-md rounded-full scale-0 group-hover:scale-100 transition-transform duration-700" />
            <VoidLogo size={32} className="relative z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-foreground/50 group-hover:text-foreground/80 transition-colors">
            {siteConfig.footer.brandName}
          </span>
        </Link>

        {/* Section indicator dots */}
        <div className="flex items-center gap-2.5" aria-hidden="true">
          {sectionsToRender.map((section) => (
            <button
              key={section}
              onClick={() => {
                trigger("medium")
                document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })
              }}
              className={`tap-target transition-all duration-500 rounded-full min-h-[44px] min-w-[44px] ${activeSection === section
                ? "w-4 h-1 bg-rose/60"
                : "w-1 h-1 bg-muted-foreground/25 hover:bg-muted-foreground/40"
                }`}
              aria-label={`Go to ${section} section`}
            />
          ))}
        </div>
      </div>
    </nav>
  )
}
