"use client"

import { cn } from "@/lib/utils"

interface VoidLogoProps {
    className?: string
    size?: number
}

export function VoidLogo({ className = "", size = 32 }: VoidLogoProps) {
    // Tesseract design: Inner cube spinning opposite to outer cube
    // Pure CSS 3D for performance and lightweight footprint

    return (
        <div
            className={cn("relative perspective-500", className)}
            style={{ width: size, height: size }}
            aria-label="Void Logo"
        >
            {/* Outer Cube Container */}
            <div className="absolute inset-0 preserve-3d animate-[spin-slow-3d_12s_linear_infinite] transform-style-3d">
                {/* Outer Cube Faces */}
                {/* Front */}
                <div className="absolute inset-0 border border-rose/30 bg-rose/5 backdrop-blur-[1px]"
                    style={{ transform: `translateZ(${size / 2}px)` }} />
                {/* Back */}
                <div className="absolute inset-0 border border-rose/30 bg-rose/5 backdrop-blur-[1px]"
                    style={{ transform: `rotateY(180deg) translateZ(${size / 2}px)` }} />
                {/* Right */}
                <div className="absolute inset-0 border border-rose/30 bg-rose/5 backdrop-blur-[1px]"
                    style={{ transform: `rotateY(90deg) translateZ(${size / 2}px)` }} />
                {/* Left */}
                <div className="absolute inset-0 border border-rose/30 bg-rose/5 backdrop-blur-[1px]"
                    style={{ transform: `rotateY(-90deg) translateZ(${size / 2}px)` }} />
                {/* Top */}
                <div className="absolute inset-0 border border-rose/30 bg-rose/5 backdrop-blur-[1px]"
                    style={{ transform: `rotateX(90deg) translateZ(${size / 2}px)` }} />
                {/* Bottom */}
                <div className="absolute inset-0 border border-rose/30 bg-rose/5 backdrop-blur-[1px]"
                    style={{ transform: `rotateX(-90deg) translateZ(${size / 2}px)` }} />
            </div>

            {/* Inner Cube Container (Reverse Spin) */}
            <div className="absolute inset-0 m-auto preserve-3d animate-[spin-reverse-3d_8s_linear_infinite] transform-style-3d"
                style={{ width: size * 0.5, height: size * 0.5 }}>

                {/* Inner Core Glow */}
                <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 bg-rose/40 blur-md rounded-full"
                    style={{ transform: "translateZ(0)" }} />

                {/* Inner Cube Faces */}
                {/* Front */}
                <div className="absolute inset-0 border border-rose/60 bg-rose/10"
                    style={{ transform: `translateZ(${size * 0.25}px)` }} />
                {/* Back */}
                <div className="absolute inset-0 border border-rose/60 bg-rose/10"
                    style={{ transform: `rotateY(180deg) translateZ(${size * 0.25}px)` }} />
                {/* Right */}
                <div className="absolute inset-0 border border-rose/60 bg-rose/10"
                    style={{ transform: `rotateY(90deg) translateZ(${size * 0.25}px)` }} />
                {/* Left */}
                <div className="absolute inset-0 border border-rose/60 bg-rose/10"
                    style={{ transform: `rotateY(-90deg) translateZ(${size * 0.25}px)` }} />
                {/* Top */}
                <div className="absolute inset-0 border border-rose/60 bg-rose/10"
                    style={{ transform: `rotateX(90deg) translateZ(${size * 0.25}px)` }} />
                {/* Bottom */}
                <div className="absolute inset-0 border border-rose/60 bg-rose/10"
                    style={{ transform: `rotateX(-90deg) translateZ(${size * 0.25}px)` }} />
            </div>

            <style jsx global>{`
        .perspective-500 {
          perspective: 500px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        @keyframes spin-slow-3d {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
        @keyframes spin-reverse-3d {
          0% { transform: rotateX(360deg) rotateY(360deg); }
          100% { transform: rotateX(0deg) rotateY(0deg); }
        }
      `}</style>
        </div>
    )
}
