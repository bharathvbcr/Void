"use client"

import { Share } from "lucide-react"
import { useHaptic } from "@/hooks/use-haptic"
import { siteConfig } from "@/config/site"

export function ShareButton() {
  const { trigger } = useHaptic()

  if (!siteConfig.features.enableShare) return null

  const handleShare = async () => {
    trigger("medium")
    const shareData = {
      title: siteConfig.metadata.title,
      text: siteConfig.metadata.description,
      url: siteConfig.metadata.url,
    }

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback
        await navigator.clipboard.writeText(siteConfig.metadata.url)
        alert("Link copied to clipboard!")
      }
    } catch (err) {
      console.log("Error sharing", err)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-5 py-2.5 mt-8 rounded-full border border-rose/20 bg-rose/5 text-rose/60 hover:bg-rose/10 hover:text-rose/80 transition-all duration-300 text-xs font-sans uppercase tracking-widest group"
      aria-label="Share this page"
    >
      <Share size={14} className="group-hover:scale-110 transition-transform duration-300" />
      <span>Share</span>
    </button>
  )
}
