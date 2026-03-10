"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAIStore } from "@/store/ai-state";

export function useHandTracker() {
    const workerRef = useRef<Worker | null>(null);
    const { setHandLandmarks, setIsProcessing } = useAIStore();

    const isBusyRef = useRef(false);
    const lastFrameTimeRef = useRef(0);
    const frameCountRef = useRef(0);

    const processFrame = useCallback(async (video: HTMLVideoElement) => {
        const now = performance.now();

        // Anti-flood: If worker takes too long (>500ms), force release busy flag
        if (isBusyRef.current && (now - lastFrameTimeRef.current > 500)) {
            console.warn("⚠️ AI Engine: Worker timeout, forcing release");
            isBusyRef.current = false;
        }

        if (isBusyRef.current || !workerRef.current || video.readyState < 2 || video.paused || video.ended) return;

        if (video.videoWidth === 0 || video.videoHeight === 0) return;

        try {
            isBusyRef.current = true;
            lastFrameTimeRef.current = now;

            const bitmap = await createImageBitmap(video);

            frameCountRef.current++;
            if (frameCountRef.current % 100 === 0) {
                console.log(`📸 AI Engine: Processing frame #${frameCountRef.current}`);
            }

            workerRef.current.postMessage(
                {
                    type: "PROCESS_FRAME",
                    payload: bitmap,
                    timestamp: now
                },
                [bitmap]
            );
        } catch (e) {
            console.error("AI Engine: Frame capture failed", e);
            isBusyRef.current = false;
        }
    }, []);

    useEffect(() => {
        const worker = new Worker(
            new URL("../services/hand-detector.worker.ts", import.meta.url)
        );
        workerRef.current = worker;

        worker.onmessage = (event) => {
            const { type, multiHandLandmarks } = event.data;

            if (type === "INIT_DONE") {
                console.log("🚀 AI Engine: Worker Initialized and Ready");
                setIsProcessing(true);
            }

            if (type === "RESULTS") {
                setHandLandmarks(multiHandLandmarks);
                isBusyRef.current = false; // Release for next frame
            }

            if (type === "ERROR") {
                console.error("AI Engine Worker Error:", event.data.payload);
                isBusyRef.current = false;
            }
        };

        worker.postMessage({ type: "INIT" });

        return () => {
            worker.terminate();
            workerRef.current = null;
        };
    }, [setHandLandmarks, setIsProcessing]);

    return { processFrame };
}
