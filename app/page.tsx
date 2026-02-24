import { VoidHero } from "@/components/void/void-hero"
import { MemoryMosaic } from "@/components/void/memory-mosaic"
import { VoidQuotes } from "@/components/void/void-quotes"
import { SilenceCounter } from "@/components/void/silence-counter"
import { PhaseTransition } from "@/components/void/phase-transition"
import { Dedication } from "@/components/void/dedication"
import { UnsentMessage } from "@/components/void/unsent-message"
import { VoidFooter } from "@/components/void/void-footer"
import { siteConfig } from "@/config/site"
import dynamic from "next/dynamic"

// Lazy load heavy interactive components below the fold
const FriendshipCycle = dynamic(() => import("@/components/void/friendship-cycle").then(mod => mod.FriendshipCycle))
const HeartbeatLine = dynamic(() => import("@/components/void/heartbeat-line").then(mod => mod.HeartbeatLine))
const TouchToRemember = dynamic(() => import("@/components/void/touch-to-remember").then(mod => mod.TouchToRemember))
const ClosureCard = dynamic(() => import("@/components/void/closure-card").then(mod => mod.ClosureCard))

export default function Page() {
  const { features } = siteConfig

  return (
    <main className="relative w-full min-h-screen bg-void-deep">

      {/* ACT I: The Void -- what happened */}
      <VoidHero />
      {features.enableMemories && <MemoryMosaic />}
      {features.enableTimeline && <FriendshipCycle />}
      {features.enableQuotes && <VoidQuotes />}
      {features.enableHeartbeat && <HeartbeatLine />}

      {/* ACT II: The Weight -- what it feels like */}
      {features.enableTouchToRemember && <TouchToRemember />}
      {features.enableSilenceCounter && <SilenceCounter />}

      {/* ACT III: The Closure -- the truth */}
      {features.enableClosure && (
        <>
          <PhaseTransition />
          <Dedication />
          <ClosureCard />
        </>
      )}

      {/* Epilogue */}
      {features.enableUnsentMessage && <UnsentMessage />}
      <VoidFooter />
    </main>
  )
}
