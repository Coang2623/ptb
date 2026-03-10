"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface Props {
    pulse: number;
}

/**
 * MagicalFlash Component
 * Provides a screen-wide white flash effect when taking a photo.
 * Strictly self-extinguishing to prevent "White Screen of Death".
 */
export function MagicalFlash({ pulse }: Props) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (pulse > 0) {
            setIsVisible(true);

            // Safety: Flash MUST DISAPPEAR after 1000ms per user preference
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [pulse]);

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                "fixed inset-0 bg-white z-[9999] pointer-events-none transition-opacity duration-100",
                isVisible ? "opacity-100" : "opacity-0"
            )}
        />
    );
}
