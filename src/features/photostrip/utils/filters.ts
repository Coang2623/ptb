export interface FilterConfig {
    name: string;
    id: string;
    style: string;
    category: "basic" | "film" | "k-style" | "vivid" | "trending";
}

export const PHOTO_FILTERS: FilterConfig[] = [
    // ── Basic ──
    {
        id: "none",
        name: "Natural",
        style: "",
        category: "basic",
    },

    // ── Classic Film Emulations ──
    {
        id: "portra-400",
        name: "Portra 400",
        style: "brightness(1.08) contrast(1.0) saturate(1.05) sepia(0.08) hue-rotate(-5deg)",
        category: "film",
    },
    {
        id: "kodak-gold",
        name: "Kodak Gold",
        style: "brightness(1.08) contrast(1.1) saturate(1.15) sepia(0.15) hue-rotate(-8deg)",
        category: "film",
    },
    {
        id: "superia",
        name: "Fuji Superia",
        style: "brightness(1.05) contrast(1.08) saturate(1.05) hue-rotate(8deg) sepia(0.05)",
        category: "film",
    },
    {
        id: "pro-400h",
        name: "Pro 400H",
        style: "brightness(1.12) contrast(0.92) saturate(0.9) hue-rotate(5deg) sepia(0.04)",
        category: "film",
    },
    {
        id: "cinestill",
        name: "Cinestill 800T",
        style: "brightness(0.95) contrast(1.15) saturate(1.1) hue-rotate(15deg) sepia(0.06)",
        category: "film",
    },

    // ── K-Style Photobooth ──
    {
        id: "k-soft",
        name: "K-Soft",
        style: "brightness(1.15) contrast(0.95) saturate(1.0) sepia(0.05) blur(0.3px)",
        category: "k-style",
    },
    {
        id: "k-cream",
        name: "K-Cream",
        style: "brightness(1.1) contrast(0.95) saturate(1.0) sepia(0.18) hue-rotate(-3deg)",
        category: "k-style",
    },
    {
        id: "k-blue",
        name: "K-Blue",
        style: "brightness(1.1) contrast(1.0) saturate(0.95) hue-rotate(15deg) sepia(0.03)",
        category: "k-style",
    },
    {
        id: "haru",
        name: "Haru Film",
        style: "brightness(1.12) contrast(0.95) saturate(1.05) sepia(0.12) hue-rotate(-10deg)",
        category: "k-style",
    },
    {
        id: "k-pink",
        name: "K-Pink",
        style: "brightness(1.1) contrast(1.0) saturate(1.2) hue-rotate(-15deg) sepia(0.08)",
        category: "k-style",
    },

    // ── Vivid / Punchy ──
    {
        id: "pop-art",
        name: "Pop Art",
        style: "brightness(1.1) contrast(1.25) saturate(1.6) hue-rotate(5deg)",
        category: "vivid",
    },
    {
        id: "neon-glow",
        name: "Neon Glow",
        style: "brightness(1.05) contrast(1.2) saturate(1.5) hue-rotate(20deg)",
        category: "vivid",
    },
    {
        id: "candy",
        name: "Candy",
        style: "brightness(1.12) contrast(1.1) saturate(1.4) hue-rotate(-20deg) sepia(0.05)",
        category: "vivid",
    },
    {
        id: "electric",
        name: "Electric",
        style: "brightness(1.0) contrast(1.3) saturate(1.5) hue-rotate(30deg)",
        category: "vivid",
    },
    {
        id: "sunset-pop",
        name: "Sunset Pop",
        style: "brightness(1.08) contrast(1.15) saturate(1.45) sepia(0.15) hue-rotate(-15deg)",
        category: "vivid",
    },
    {
        id: "tropical",
        name: "Tropical",
        style: "brightness(1.1) contrast(1.1) saturate(1.4) hue-rotate(10deg) sepia(0.05)",
        category: "vivid",
    },

    // ── Trending / Social ──
    {
        id: "y2k",
        name: "Y2K",
        style: "brightness(1.05) contrast(1.2) saturate(1.3) hue-rotate(10deg) sepia(0.02)",
        category: "trending",
    },
    {
        id: "faded",
        name: "Faded Vintage",
        style: "brightness(1.1) contrast(0.9) saturate(0.85) sepia(0.15)",
        category: "trending",
    },
    {
        id: "golden-hour",
        name: "Golden Hour",
        style: "brightness(1.08) contrast(1.05) saturate(1.2) sepia(0.25) hue-rotate(-10deg)",
        category: "trending",
    },
    {
        id: "noir-classic",
        name: "Noir Classic",
        style: "grayscale(1) contrast(1.3) brightness(1.05)",
        category: "trending",
    },
    {
        id: "teal-orange",
        name: "Cinematic",
        style: "brightness(1.0) contrast(1.15) saturate(1.1) hue-rotate(5deg) sepia(0.1)",
        category: "trending",
    },
    {
        id: "soft-bloom",
        name: "Soft Bloom",
        style: "brightness(1.15) contrast(0.88) saturate(0.9) sepia(0.1) blur(0.6px)",
        category: "trending",
    },
];

export const FILTER_CATEGORIES = [
    { id: "basic", label: "Basic" },
    { id: "film", label: "Film" },
    { id: "k-style", label: "K-Style" },
    { id: "vivid", label: "Vivid" },
    { id: "trending", label: "Trending" },
] as const;

export function getFilterStyle(filterId: string, brightness: number = 100): React.CSSProperties {
    const filter = PHOTO_FILTERS.find(f => f.id === filterId);
    const brightnessFilter = `brightness(${brightness}%)`;

    return {
        filter: `${filter?.style || ""} ${brightnessFilter}`.trim()
    };
}
