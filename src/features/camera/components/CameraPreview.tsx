"use client";

import { useEffect, useRef, useState } from "react";
import { useCameraStore } from "@/store/camera-state";
import { useAIStore } from "@/store/ai-state";
import { useSessionStore } from "@/store/session-state";
import { cameraService } from "../services/camera.service";
import { useHandTracker } from "@/features/ai-engine/hooks/useHandTracker";
import { useGestureDetection } from "@/features/ai-engine/hooks/useGestureDetection";
import { MagicCanvas } from "@/features/ai-engine/components/MagicCanvas";
import { useCameraCapture } from "../hooks/useCameraCapture";
import { MagicalFlash } from "./MagicalFlash";

export function CameraPreview() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { selectedDeviceId } = useCameraStore();
    const { photos } = useSessionStore();
    const [error, setError] = useState<string | null>(null);
    const { processFrame } = useHandTracker();
    const { flashTrigger, countdown, isSessionActive } = useCameraCapture(videoRef);
    const [videoReady, setVideoReady] = useState(false);

    // Register continuous gesture monitoring
    useGestureDetection();

    // Periodic detection logging (per User Request: 1.5s interval)
    useEffect(() => {
        const interval = setInterval(() => {
            const { handLandmarks } = useAIStore.getState();
            if (handLandmarks && handLandmarks.length > 0) {
                console.log("👉 Hand detected");
            } else {
                console.log("🌑 No hand");
            }
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let currentStream: MediaStream | null = null;
        let animationFrameId: number;

        async function startStream() {
            if (!selectedDeviceId) return;

            try {
                setError(null);
                currentStream = await cameraService.getCameraStream(selectedDeviceId);

                if (videoRef.current) {
                    videoRef.current.srcObject = currentStream;
                }
            } catch (err) {
                console.error("Camera start error:", err);
                setError("Could not access camera. Please check permissions.");
            }
        }

        const runProcessing = () => {
            if (videoRef.current && videoReady) {
                processFrame(videoRef.current);
            }
            animationFrameId = requestAnimationFrame(runProcessing);
        };

        startStream().then(() => {
            animationFrameId = requestAnimationFrame(runProcessing);
        });

        return () => {
            if (currentStream) {
                currentStream.getTracks().forEach((track) => track.stop());
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, [selectedDeviceId, processFrame, videoReady]);

    if (error) {
        return (
            <div className="w-full aspect-video glass rounded-3xl flex items-center justify-center text-white/80 p-8 text-center">
                <p className="font-outfit text-xl">{error}</p>
            </div>
        );
    }

    return (
        <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={() => setVideoReady(true)}
                className="w-full h-full object-cover mirror"
            />

            {/* Visual AI Overlay */}
            <MagicCanvas />

            {/* Capture Flash Effect */}
            <MagicalFlash pulse={flashTrigger} />

            {/* Countdown Overlay */}
            {isSessionActive && countdown !== null && countdown > 0 && (
                <div className="absolute inset-0 flex items-center justify-center z-[70] pointer-events-none">
                    <div className="flex flex-col items-center">
                        <span className="text-[12rem] font-bold font-outfit text-white drop-shadow-[0_0_50px_rgba(0,242,255,0.8)] animate-pulse leading-none">
                            {countdown}
                        </span>
                        <p className="text-white/60 font-inter uppercase tracking-[0.4em] text-xl -mt-4">Get Ready!</p>
                    </div>
                </div>
            )}

            {/* Photo Counter Overlay */}
            <div className="absolute top-6 right-6 z-[80] flex flex-col items-end gap-1">
                <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isSessionActive ? 'bg-red-500 animate-pulse' : 'bg-white/40'}`} />
                    <span className="text-white font-outfit font-medium tracking-wider">
                        {photos.length} / 4 PHOTOS
                    </span>
                </div>
                {isSessionActive && (
                    <span className="text-cyan-400 text-[10px] font-mono uppercase tracking-[0.2em] bg-cyan-950/50 px-2 py-0.5 rounded-lg border border-cyan-500/30">
                        SESSION LIVE
                    </span>
                )}
            </div>

            {/* Decorative frame overlay */}
            <div className="absolute inset-0 pointer-events-none border-[12px] border-white/5 rounded-[inherit]" />
        </div>
    );
}
