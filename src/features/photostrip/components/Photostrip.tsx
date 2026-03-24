"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useSessionStore } from "@/store/session-state";
import { getFilterStyle } from "../utils/filters";

interface Props {
    photos: string[];
    className?: string;
    compact?: boolean;
    fitHeight?: boolean;
}

const FRAME_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    white: { bg: "bg-white", text: "text-midnight", border: "border-black/5" },
    black: { bg: "bg-midnight", text: "text-white", border: "border-white/10" },
    violet: { bg: "bg-magical-violet", text: "text-midnight", border: "border-black/10" }
};

/**
 * Photostrip Component
 * A vertical, 4-frame assembly in classic K-Style.
 */
export function Photostrip({ photos, className, compact, fitHeight }: Props) {
    const { filter: filterId, brightness, frameColor } = useSessionStore();
    const filterStyle = getFilterStyle(filterId, brightness);

    // Get color theme
    const theme = FRAME_COLORS[frameColor] || FRAME_COLORS.white;

    // Fill placeholders if less than 4 photos
    const displayPhotos = [...photos];
    while (displayPhotos.length < 4) {
        displayPhotos.push(""); // Empty state
    }

    return (
        <div
            className={cn(
                "shadow-2xl flex flex-col items-center transition-colors duration-500",
                fitHeight ? "h-full aspect-[2/7] p-[2%] gap-[1%]" : compact ? "w-[220px] p-2.5 gap-2" : "w-[320px] p-4 gap-3",
                theme.bg,
                className
            )}
        >
            {displayPhotos.map((photo, idx) => (
                <div
                    key={idx}
                    className={cn(
                        "bg-midnight overflow-hidden relative border w-full",
                        fitHeight ? "flex-1 min-h-0" : "aspect-[4/3]",
                        theme.border
                    )}
                >
                    {photo ? (
                        <img
                            src={photo}
                            alt={`Shot ${idx + 1}`}
                            style={filterStyle}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white/10 font-mono text-[10px]">FRAME #{idx + 1}</span>
                        </div>
                    )}
                </div>
            ))}

            {/* Branding Footer */}
            <div className={cn("flex flex-col items-center shrink-0", fitHeight || compact ? "mt-0.5" : "mt-2")}>
                <h3 className={cn("font-outfit font-black tracking-tighter leading-none", fitHeight || compact ? "text-base" : "text-2xl", theme.text)}>BOP</h3>
                <p className={cn("font-inter uppercase tracking-[0.3em] opacity-40 animate-pulse", fitHeight || compact ? "text-[5px]" : "text-[8px]", theme.text)}>Magical Studio Experience</p>
            </div>
        </div>
    );
}
