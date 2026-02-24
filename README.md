# THE VOID

> "What hurts more than a breakup? Losing a best friend."

**The Void** is an immersive, mobile-optimized digital monument designed to capture the slow fading of a deep connection. It's a template for those who have experienced a "friendship breakup"—the kind that doesn't end with a fight or a goodbye, but with a slow transition from paragraphs to single words, from hours of talking to weeks of silence.

**Live Experience:** [https://friendship-void.web.app](https://friendship-void.web.app)

---

## 🥀 The Experience

The Void isn't just a website; it's a scroll-driven journey through the archaeology of a connection.

### 🌓 Thematic Core
- **Immersive Scroll-Telling**: A non-linear narrative that transitions from the warmth of meeting to the coldness of the disconnect using GPU-accelerated layers and 100% CSS-driven animations.
- **The Silence Counter**: A live, ticking clock that measures the time since the last meaningful interaction—a reminder of the growing distance.
- **The Heartbeat Line**: A pulsing SVG line that reflects the current "rhythm" of the connection. As you scroll into the later chapters, the pulse flattens.
- **Unsent Message Drafts**: A realistic iMessage-style component showing the messages that were written but never delivered.
- **The Closure Letter**: A finalized, interactive card for the words you finally needed to say to let go.

---

## 🧪 Technical Deep Dive

### 📱 Mobile Mastery & Haptics
We've spent significant time optimizing the experience for mobile devices, where most of these memories live.

- **iOS Resonant Haptics (170Hz)**: Standard browser vibration often fails on iOS. Our `HapticEngine` synthesizes 170Hz sine waves—the physical resonant frequency of the iPhone Taptic Engine—using the Web Audio API to create "punchier" feedback that feels like a native app.
- **Unified Pointer Events**: By using `onPointerDown`, `onPointerUp`, and `onPointerCancel` instead of standard touch/mouse events, we ensure a consistent interaction model across all devices.
- **Interaction Isolation**: The `InteractiveImage` and `TouchToRemember` components use `touch-action: none` and `WebkitTouchCallout: "none"` to block native OS long-press menus, allowing for custom "hold to reveal" logic without the "Save Image" popups.

### 🌌 Visual Systems
- **Interactive Particle Fields**: A custom Canvas-based particle system with mouse and touch repulsion.
- **Battery & Performance Optimization**: 
  - Uses `IntersectionObserver` to pause heavy Canvas animations when sections are off-screen.
  - Leverages `devicePixelRatio` scaling for 2x/3x "Retina" crispness without sacrificing frame rate.
  - Utilizes `will-change: transform` and `gpu-layer` classes to offload animations to the GPU.
- **Dynamic Mood System**: The entire site's palette (colors, glow intensities, and haptic patterns) shifts dynamically based on the current "mood" defined in the configuration (warm, peak, fading, void).

### 🔒 Privacy-First Template
The Void is designed to be shared while remaining deeply personal.
- **100% Client-Side**: No personal data is sent to a backend (unless you explicitly configure a form).
- **Easy Anonymization**: Centralized strings in `config/site.ts` make it trivial to scrub real names and identifiers before deployment.
- **Native Platform Share**: Integrated with `navigator.share()` for private, encrypted sharing via system-level apps like iMessage or WhatsApp.

---

## 🛠️ The Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom "Void" palette.
- **Components**: [Radix UI](https://www.radix-ui.com/) for accessible primitives.
- **Haptics**: Custom Web Audio API-based frequency synthesis.
- **Deployment**: [Firebase Hosting](https://firebase.google.com/products/hosting).

---

## 🎨 Personalizing Your Story

Everything is controlled via `config/site.ts`. You don't need to touch the component logic.

### 🌓 The Mood Engine
You can define the emotional journey of each chapter:
```typescript
{
    id: "the-disconnect",
    label: "The Disconnect",
    mood: "fading", // Affects glow, color, and haptics
    color: { dot: "#8A6B72", glow: "138, 107, 114" },
    haptic: "heavy", // Uses the 'heavy' pattern from use-haptic.ts
}
```

### 💓 The Silence Counter
Simply set a date, and the counter handles the math:
```typescript
silenceCounter: {
    startDate: "2024-01-01T00:00:00",
    label: "Time since the warmth faded",
    units: { days: "days", hours: "hours", ... },
}
```

---

## 🚀 Getting Started

1. **Clone & Install**:
   ```bash
   git clone https://github.com/bharathvbcr/Void.git
   cd Void
   pnpm install
   ```

2. **Development**:
   ```bash
   npm run dev
   ```

3. **Build & Deploy**:
   ```bash
   npm run build
   cmd /c firebase deploy
   ```

---

## 📜 License & Credits

Distributed under the **MIT License**. Created with 🖤 by [bharathvbcr](https://github.com/bharathvbcr).

*Inspired by the quiet moments and the people who are still here, but unreachable.*
