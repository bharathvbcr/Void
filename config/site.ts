export type SiteConfig = typeof siteConfig

export const siteConfig = {
    metadata: {
        title: "The Void",
        description: "What hurts more than a breakup? Losing a best friend.",
        url: "https://friendship-void.web.app",
        themeColor: "#191919",
        ogImage: "/opengraph-image.jpg",
        twitterImage: "/twitter-image.jpg",
    },
    theme: {
        colors: {
            rose: "199, 125, 146",
            gold: "180, 140, 110",
        }
    },
    features: {
        enableMemories: true,
        enableTimeline: true,
        enableQuotes: true,
        enableHeartbeat: true,
        enableTouchToRemember: true,
        enableSilenceCounter: true,
        enableClosure: true,
        enableUnsentMessage: true,
        enableShare: true,
    },
    firebase: {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
    },
    hero: {
        title: "What hurts more than a breakup?",
        subtitle: "Scroll to enter the distance",
        image: {
            src: "/images/friends-memory.jpg",
            alt: "A fading memory of friends laughing together",
        },
        status: "The Void",
        enterLabel: "Enter",
    },
    memories: [
        { text: "The one person I could always count on and talk to anytime", time: "11:47 PM" },
        { text: "When you laughed so hard you couldn't breathe", time: "3:22 PM" },
        { text: "The silence that was never uncomfortable", time: "2:08 AM" },
        { text: "How you always knew before I even said it", time: "9:15 PM" },
        { text: "The way you made the worst days bearable", time: "6:33 PM" },
        { text: "When we playfully teased each other", time: "1:04 AM" },
    ],
    chapters: [
        {
            id: "strangers",
            number: "00",
            label: "Strangers",
            subtitle: "before it all",
            description: "When I moved to the city. No idea what was coming. No idea someone was about to make my boring life exciting.",
            mood: "muted" as const,
            color: { dot: "#555", glow: "90, 90, 90", text: "text-muted-foreground/35" },
            haptic: "light" as const,
        },
        {
            id: "the-day-we-met",
            number: "01",
            label: "The Day We Met",
            subtitle: "the beginning",
            description: "Two strangers in the same place at the same time. No idea what was about to begin. But something shifted. Something quiet and enormous.",
            mood: "warm" as const,
            color: { dot: "#A0878E", glow: "160, 135, 142", text: "text-muted-foreground/55" },
            haptic: "reveal" as const,
        },
        {
            id: "started-talking",
            number: "02",
            label: "When We Started Talking",
            subtitle: "the spark",
            description: "The messages that started short and turned into paragraphs. Hours felt like minutes. I couldn't wait to see your name on my screen.",
            mood: "warm" as const,
            color: { dot: "#B08D96", glow: "176, 141, 150", text: "text-muted-foreground/60" },
            haptic: "reveal" as const,
        },
        {
            id: "jogging-days",
            number: "03",
            label: "Our Jogging Days",
            subtitle: "the rhythm",
            description: "Side by side, catching our breath and catching up on life. The rhythm of us. Every step felt like we were building something.",
            mood: "warm" as const,
            color: { dot: "#B8939D", glow: "184, 147, 157", text: "text-muted-foreground/60" },
            haptic: "reveal" as const,
        },
        {
            id: "road-trip",
            number: "04",
            label: "The Road Trip",
            subtitle: "the best day",
            description: "10 hours of driving, and every single minute was full of fun and excitement. The kind of freedom that only feels real with the right person.",
            mood: "peak" as const,
            color: { dot: "#C77D92", glow: "199, 125, 146", text: "text-rose/70" },
            haptic: "heartbeat" as const,
        },
        {
            id: "movie-day",
            number: "05",
            label: "Movie Day",
            subtitle: "the warmth",
            description: "It was never about the movie. It was about who was next to me. About the feeling of being exactly where I belonged.",
            mood: "peak" as const,
            color: { dot: "#C07D90", glow: "192, 125, 144", text: "text-rose/60" },
            haptic: "heartbeat" as const,
        },
        {
            id: "the-disconnect",
            number: "06",
            label: "The Disconnect",
            subtitle: "the silence",
            description: "They still call every few days. But shorter replies. Colder tone. Going through the motions. The warmth left so quietly I didn't notice until I was already cold.",
            mood: "fading" as const,
            color: { dot: "#8A6B72", glow: "138, 107, 114", text: "text-muted-foreground/35" },
            haptic: "heavy" as const,
        },
        {
            id: "strangers-again",
            number: "...",
            label: "Strangers Again",
            subtitle: "full circle",
            description: "The cruelest distance isn't miles. It's hearing their voice every few days and knowing the person who used to light up for you is gone. Still there, but unreachable.",
            mood: "void" as const,
            color: { dot: "#4A4545", glow: "74, 69, 69", text: "text-muted-foreground/20" },
            haptic: "flatline" as const,
        },
    ],
    milestones: [
        {
            label: "The Day We Met",
            description: "When I moved to the city. No idea what was coming. No idea someone was about to make my boring life exciting.",
            icon: "spark",
            mood: "warm",
        },
        {
            label: "When We Started Talking",
            description: "The messages that started short and turned into paragraphs. Hours felt like minutes.",
            icon: "message",
            mood: "warm",
        },
        {
            label: "Our Jogging Days",
            description: "Side by side, catching our breath and catching up on life. The rhythm of us.",
            icon: "road",
            mood: "warm",
        },
        {
            label: "The Road Trip",
            description: "10 hours of driving, and every single minute was full of fun and excitement. The kind of freedom that only feels real with the right person.",
            icon: "horizon",
            mood: "bright",
        },
        {
            label: "Movie Day",
            description: "It was never about the movie. It was about who was next to me.",
            icon: "film",
            mood: "warm",
        },
        {
            label: "The Silence",
            description: "No fight. No goodbye. Just a slow fade into nothing.",
            icon: "void",
            mood: "cold",
        },
    ],
    quotes: [
        {
            type: "word-by-word",
            text: "When they still call, still show up\u2014but the warmth behind it is gone. And you're left to reconcile the presence with the absence, a quiet shift in what once was.",
            wordDelay: 90,
        },
        {
            type: "staggered",
            paragraphs: [
                {
                    text: "People come into your life unexpectedly and slowly become your safe place. You share your worst fears, your midnight thoughts, your ugly truths.",
                    wordDelay: 40,
                },
                {
                    text: "You trust them with pieces of yourself you've never shown anyone. And one day, without explanation, without a fight, without closure, they simply drift.",
                    wordDelay: 40,
                    startDelay: 400,
                },
                {
                    text: "The calls still come, every few days. But the warmth behind them is gone.",
                    wordDelay: 70,
                    startDelay: 800,
                },
                {
                    text: "And you're left standing in the ruins of a connection you thought was unbreakable, wondering what went wrong.",
                    wordDelay: 50,
                    startDelay: 1100,
                },
                {
                    text: "No goodbye. No reason. Just going through the motions where memories used to live.",
                    wordDelay: 100,
                    startDelay: 1500,
                    className: "text-rose/60 font-serif italic text-base",
                },
            ],
        },
        {
            type: "reflective",
            text: "The hardest kind of losing is when they\u2019re still there\u2014still calling, still talking\u2014but the person you knew is gone. You hear their voice, but you can\u2019t feel them anymore.",
            wordDelay: 70,
        },
    ],
    silenceCounter: {
        startDate: "2024-01-01T00:00:00",
        label: "It's been this long since their voice carried the warmth it used to",
        subtext: "and still counting",
        units: {
            days: "days",
            hours: "hours",
            minutes: "min",
            seconds: "sec",
        },
    },
    dedication: {
        heading: "For You",
        text1: "Because you deserve to hear the truth, ",
        text1Highlight: "even if you don't see what's changed.",
        text2: "This isn't about blame. This isn't about anger. ",
        text2Highlight: "This is about missing the version of you that used to light up when we talked."
    },
    unsentMessage: {
        title: "The unsent message",
        subtitle: "Still sitting in my drafts.",
        recipientName: "My Friend",
        status: "called 2 days ago",
        receivedMessage: "yeah, everything's fine. we should catch up sometime.",
        timeGapText: "after another hollow phone call...",
        draftMessage: "You still call. And I still pick up. But we both know it's not the same. I miss the you who couldn't wait to tell me things. I miss the excitement in your voice. I don't know where that person went, but I keep hoping they'll come back.",
        draftLabel: "Draft - Not delivered",
        appLabel: "iMessage",
        inputPlaceholder: "Message...",
    },
    closureLetter: {
        title: "A Letter to You",
        paragraphs: [
            "I've been sitting with this for a few days and I really need to be honest with you. Those two months of friendship we shared were genuinely special to me. You became one of the people I trusted most, and that's not something I say lightly.",
            "You still call every few days, and I still pick up. But something is different\u2014the excitement in your voice is gone. The way you used to light up when you talked to me, the way you couldn't wait to share things with me\u2014I miss all of that. I keep replaying things in my head, trying to figure out what changed, but I genuinely don't know.",
            "I'm not writing this to guilt you or make you feel bad. I just believe that real respect between two people means being honest, even when it's hard. The calls still happen, but we both know they're hollow now. If something changed for you, if the closeness we had has run its course\u2014I can accept that. What I can't accept is pretending the warmth is still there when we both feel it fading.",
            "You meant a lot to me, and because of that, you deserve my honesty: I'd rather have a painful truth than a comfortable silence. And I think you deserve to know that whatever happens next, I'll always be grateful for the good moments we had.",
            "If the old you is still in there somewhere, I'm here. If this is just who we are now, I'll learn to accept it. But I need you to know\u2014I miss the excitement. I miss the warmth. I miss my best friend."
        ],
        signature: "fin",
        bgImage: "/images/closure-card-bg.jpg"
    },
    memoryMosaic: {
        title: "Fragments of us",
        emptyCardText: "...and then, just going through the motions."
    },
    phaseTransition: {
        label: "The Closure",
        text: "What hurts most isn't the silence... it's that you're still here, but you feel so far away."
    },
    footer: {
        credits: "A digital monument to the slow fading of what we once were.",
        brandName: "the void",
    },
    heartbeatLine: {
        label: "The connection",
        text: "...the line still pulses, but the rhythm we had is gone.",
    },
    touchToRemember: {
        label: "A fading memory",
        instruction: "Press and hold to remember...",
        holdingText: "You can see it... but you can't feel it like before.",
        revealedText: "The memory stays, but the warmth behind it fades.",
    },
    friendshipCycle: {
        header: "The Story of Us",
        subtitle: "every chapter mattered",
        scrollHint: "scroll",
        fullCircleLabel: "full circle",
        roadTripQuote: "I used to love the excitement you had when you'd talk to me. The way your eyes would light up, the way your voice would change. I miss that.",
        finalVoidText: "They still call. I still answer. But the person on the other end isn't the one I miss.",
    },
    friendshipTimeline: {
        header: "The Story of Us",
        subtitle: "Every chapter mattered",
        tags: {
            beginning: "the beginning",
            bestDay: "the best day",
            chapter: "a chapter",
        },
    },
}