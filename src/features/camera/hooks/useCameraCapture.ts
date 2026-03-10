"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAIStore } from "@/store/ai-state";
import { useSessionStore } from "@/store/session-state";

/**
 * useCameraCapture Hook
 * Manages the automated multi-shot session logic.
 * Triggered by AI detection (Fist gesture).
 */
export function useCameraCapture(videoRef: React.RefObject<HTMLVideoElement | null>) {
    const addPhoto = useSessionStore(state => state.addPhoto);
    const {
        isSessionActive,
        setIsSessionActive,
        setCountdown,
        countdown,
        triggerFlash,
        flashTrigger,
        setShotCount,
        shotCount
    } = useAIStore();

    // Use refs for values that change inside the loop
    const sessionActiveRef = useRef(false);

    // Sync refs
    useEffect(() => {
        sessionActiveRef.current = isSessionActive;
    }, [isSessionActive]);

    const captureFrame = useCallback(() => {
        const video = videoRef.current;
        if (!video || video.readyState < 2 || video.videoWidth === 0) {
            console.warn("⚠️ captureFrame: Video not ready");
            return;
        }

        try {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
            addPhoto(dataUrl);

            // Trigger Global Flash Pulse (handled by MagicalFlash internally)
            triggerFlash();

        } catch (e) {
            console.error("❌ captureFrame: Failed", e);
        }
    }, [videoRef, addPhoto, triggerFlash]);

    // Main Session Controller
    useEffect(() => {
        if (!isSessionActive) return;

        async function runSession() {
            console.log("🎬 Session Started...");
            setShotCount(0);

            // Sequential shots
            for (let i = 0; i < 4; i++) {
                if (!sessionActiveRef.current) break;

                // Initial wait is 3s, subsequent is 8s
                let timeLeft = i === 0 ? 3 : 8;

                while (timeLeft > 0) {
                    if (!sessionActiveRef.current) break;
                    setCountdown(timeLeft);
                    console.log(`⏱️ Countdown: ${timeLeft}s`);
                    await new Promise(r => setTimeout(r, 1000));
                    timeLeft--;
                }

                if (!sessionActiveRef.current) break;

                setCountdown(0);
                captureFrame();
                setShotCount(i + 1);

                // Small buffer after capture
                await new Promise(r => setTimeout(r, 500));
                setCountdown(null);
            }

            console.log("🏁 Session Finished!");
            setIsSessionActive(false);
            setCountdown(null);
        }

        runSession();

        return () => {
            // Logic is controlled by sessionActiveRef in runSession
        };
    }, [isSessionActive, captureFrame, setCountdown, setIsSessionActive, setShotCount]);

    return { flashTrigger, countdown, isSessionActive };
}
