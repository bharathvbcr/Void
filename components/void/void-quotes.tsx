"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { siteConfig } from "@/config/site"
import { QuoteReveal } from "./quote-reveal"
import { WordByWord } from "./word-by-word"
import { ParticleField } from "./particle-field"
import { TearDrops } from "./tear-drops"

export function VoidQuotes() {
  return (
    <section className="relative w-full bg-void-deep overflow-hidden" id="quotes">
      {/* Subtle top fade from hero */}
      <div
        className="absolute top-0 left-0 right-0 h-40 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, hsl(0 0% 4% / 1) 0%, transparent 100%)",
        }}
      />

      {/* Sparse background particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <ParticleField count={20} color={siteConfig.theme.colors.rose} />
      </div>

      {/* Tear drops layer -- gentle crying during emotional quotes */}
      <div className="absolute inset-0 pointer-events-none z-[5]">
        <TearDrops count={4} intensity="gentle" color={siteConfig.theme.colors.rose} />
      </div>

      {/* Ambient side glows */}
      <div
        className="absolute top-1/4 -left-20 w-60 h-60 rounded-full animate-breathe pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(344 30% 63% / 0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-1/3 -right-20 w-48 h-48 rounded-full animate-breathe pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(344 30% 63% / 0.04) 0%, transparent 70%)",
          animationDelay: "4s",
        }}
      />

      <div className="relative z-20 flex flex-col items-center px-6 py-32 gap-28 max-w-lg mx-auto">
        {siteConfig.quotes.map((quote, idx) => {
          if (quote.type === "word-by-word") {
            return (
              <QuoteReveal key={idx}>
                <div className="text-center">
                  <div className="mb-6 flex justify-center items-center gap-3">
                    <span className="inline-block w-8 h-px bg-rose/30" />
                    <span className="inline-block w-2 h-2 rounded-full border border-rose/20" />
                    <span className="inline-block w-8 h-px bg-rose/30" />
                  </div>
                  <blockquote className="font-serif text-xl sm:text-2xl leading-relaxed text-foreground/90 text-balance">
                    <WordByWord
                      text={`\u201C${quote.text}\u201D`}
                      wordDelay={quote.wordDelay}
                    />
                  </blockquote>
                  <div className="mt-8 flex justify-center gap-2">
                    <span className="inline-block w-1 h-1 rounded-full bg-rose/50" />
                    <span className="inline-block w-8 h-px bg-rose/20 self-center" />
                    <span className="inline-block w-1 h-1 rounded-full bg-rose/50" />
                  </div>
                </div>
              </QuoteReveal>
            )
          }

          if (quote.type === "staggered" && quote.paragraphs) {
            return (
              <QuoteReveal key={idx} delay={200}>
                <div className="text-center">
                  <div className="mb-8 flex justify-center items-center gap-2">
                    <span className="inline-block w-12 h-px bg-gradient-to-r from-transparent via-rose/25 to-transparent" />
                  </div>
                  <div className="font-sans text-sm sm:text-[15px] leading-[2] text-muted-foreground/80 space-y-4">
                    {quote.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className={p.className}>
                        <WordByWord
                          text={p.text}
                          wordDelay={p.wordDelay}
                          startDelay={p.startDelay}
                        />
                      </p>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-center">
                    <span className="inline-block w-1 h-1 rounded-full bg-rose/30" />
                  </div>
                </div>
              </QuoteReveal>
            )
          }

          if (quote.type === "reflective") {
            return (
              <QuoteReveal key={idx} delay={400}>
                <div className="relative text-center">
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none animate-breathe"
                    style={{
                      background:
                        "radial-gradient(circle, hsl(344 30% 63% / 0.06) 0%, transparent 60%)",
                    }}
                  />
                  <div className="relative">
                    <div className="mb-6 flex justify-center items-center gap-3">
                      <span className="inline-block w-8 h-px bg-rose/30" />
                      <span className="inline-block w-2 h-2 rounded-full border border-rose/25" />
                      <span className="inline-block w-8 h-px bg-rose/30" />
                    </div>
                    <blockquote className="font-serif text-lg sm:text-xl leading-[1.7] text-rose/70 italic text-balance animate-text-glow">
                      <WordByWord
                        text={`\u201C${quote.text}\u201D`}
                        wordDelay={quote.wordDelay}
                      />
                    </blockquote>
                    <div className="mt-10 flex justify-center gap-2 items-center">
                      <span className="inline-block w-1 h-1 rounded-full bg-rose/20" />
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose/40" />
                      <span className="inline-block w-1 h-1 rounded-full bg-rose/20" />
                    </div>
                  </div>
                </div>
              </QuoteReveal>
            )
          }

          return null
        })}
      </div>

      {/* Bottom fade into transition */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, hsl(0 0% 4% / 1) 0%, transparent 100%)",
        }}
      />
    </section>
  )
}
