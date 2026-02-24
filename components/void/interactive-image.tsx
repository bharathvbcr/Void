"use client"

import Image, { ImageProps } from "next/image"

// We omit all pointer, mouse, and touch events that we are overriding internally
// to prevent conflicting event handlers from being passed down.
interface InteractiveImageProps extends Omit<ImageProps, 
  | "onPointerDown" | "onPointerUp" | "onPointerOut" | "onPointerCancel"
  | "onMouseDown" | "onMouseUp" | "onMouseLeave"
  | "onTouchStart" | "onTouchEnd" | "onTouchCancel"
> {
  onHoldStart?: () => void
  onHoldEnd?: () => void
}

export function InteractiveImage({ onHoldStart, onHoldEnd, className = "", style, ...props }: InteractiveImageProps) {
  return (
    <Image
      {...props}
      className={`${className} select-none`}
      style={{
        ...style,
        // Critical CSS for preventing selection, callouts, and dragging on all devices
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
        userSelect: "none",
        // Prevents the browser from hijacking the touch to scroll the page
        // This makes the "hold" action feel much more stable and native
        touchAction: "none",
      }}
      draggable={false}
      // Use modern pointer events to handle mouse, touch, and stylus uniformly
      onPointerDown={onHoldStart}
      onPointerUp={onHoldEnd}
      onPointerOut={onHoldEnd}
      onPointerCancel={onHoldEnd}
      // Prevent the context menu (long press on mobile, right click on desktop)
      onContextMenu={(e) => {
        e.preventDefault()
      }}
    />
  )
}
