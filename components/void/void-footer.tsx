import React from "react"
import { siteConfig } from "@/config/site"
import Link from "next/link"
import { QuoteReveal } from "./quote-reveal"
import { TearDrops } from "./tear-drops"
import { VoidLogo } from "./void-logo"
import { ShareButton } from "./share-button"
import { Github } from "lucide-react"

export function VoidFooter() {
  return (
    <footer
      className="relative w-full py-28 px-6 flex flex-col items-center justify-center overflow-hidden pb-safe"
      style={{
        background:
          "linear-gradient(to bottom, hsl(0 0% 5%) 0%, hsl(0 0% 3%) 100%)",
      }}
    >
      {/* Final gentle tears */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <TearDrops count={2} intensity="gentle" color="199, 125, 146" />
      </div>

      {/* Faint ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, hsl(344 30% 63% / 0.03) 0%, transparent 70%)",
        }}
      />

      <QuoteReveal>
        <div className="text-center max-w-[260px] mx-auto">
          {/* Top ornament */}
          <div className="mb-8 flex justify-center items-center gap-2">
            <span className="inline-block w-6 h-px bg-rose/10" />
            <span className="inline-block w-1 h-1 rounded-full bg-rose/20" />
            <span className="inline-block w-1.5 h-1.5 rounded-full border border-rose/15" />
            <span className="inline-block w-1 h-1 rounded-full bg-rose/20" />
            <span className="inline-block w-6 h-px bg-rose/10" />
          </div>

          <p className="font-serif text-xs text-muted-foreground/30 leading-relaxed tracking-wide italic">
            {siteConfig.footer.credits}
          </p>

          <div className="mt-10 flex flex-col items-center gap-6">
            <span className="inline-block w-px h-8 bg-gradient-to-b from-rose/10 to-transparent" />

            <Link href="/" className="group" aria-label="Return to top">
              <VoidLogo size={24} className="opacity-40 group-hover:opacity-80 transition-opacity duration-500" />
            </Link>
          </div>

          <p className="mt-4 font-sans text-[9px] tracking-[0.4em] uppercase text-muted-foreground/15">
            {siteConfig.footer.brandName}
          </p>

          <div className="flex flex-col items-center gap-4 mt-8">
            <ShareButton />
            <Link
              href="https://github.com/bharathvbcr/Void"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-rose/5 bg-transparent text-rose/30 hover:bg-rose/5 hover:text-rose/50 transition-all duration-300 text-[10px] font-sans uppercase tracking-[0.2em] group"
            >
              <Github size={12} className="opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              <span>bharathvbcr / Void</span>
            </Link>
          </div>
        </div>
      </QuoteReveal>
    </footer>
  )
}
