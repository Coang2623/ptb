"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useSessionStore } from "@/store/session-state";
import { getFilterStyle } from "../utils/filters";

interface Props {
    photos: string[];
    className?: string;
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
export function Photostrip({ photos, className }: Props) {
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
        <div className={cn(
            "w-[320px] p-4 shadow-2xl flex flex-col gap-3 items-center transition-colors duration-500",
            theme.bg,
            className
        )}>
            {displayPhotos.map((photo, idx) => (
                <div
                    key={idx}
                    className={cn(
                        "w-full aspect-[4/3] bg-midnight overflow-hidden relative border",
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
            <div className="mt-2 flex flex-col items-center">
                <h3 className={cn("font-outfit font-black tracking-tighter text-2xl leading-none", theme.text)}>BOP</h3>
                <p className={cn("font-inter text-[8px] uppercase tracking-[0.3em] opacity-40 animate-pulse", theme.text)}>Magical Studio Experience</p>
            </div>
        </div>
    );
}
