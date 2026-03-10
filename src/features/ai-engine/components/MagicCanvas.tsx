"use client";

import { useEffect, useRef } from "react";
import { useAIStore } from "@/store/ai-state";
import { ParticleSystem } from "../utils/particle-system";

interface StateRef {
    handLandmarks: any[][];
    isBopActive: boolean;
    bopProgress: number;
    isProcessing: boolean;
}

export function MagicCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const systemRef = useRef<ParticleSystem | null>(null);
    const frameCount = useRef(0);

    const stateRef = useRef<StateRef>({
        handLandmarks: [],
        isBopActive: false,
        bopProgress: 0,
        isProcessing: false,
    });

    useEffect(() => {
        const unsub = useAIStore.subscribe((state) => {
            stateRef.current = {
                handLandmarks: state.handLandmarks || [],
                isBopActive: state.isBopActive,
                bopProgress: state.bopProgress,
                isProcessing: state.isProcessing
            };
        });
        return unsub;
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        systemRef.current = new ParticleSystem(ctx);

        let animationId: number;

        const render = () => {
            frameCount.current++;
            const { handLandmarks, isBopActive, bopProgress, isProcessing } = stateRef.current;
            const system = systemRef.current;

            if (system && canvas) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // 1. ENGINE HEARTBEAT (Diagnostic)
                const dotColor = frameCount.current % 30 < 15 ? "#00FF00" : "#004400";
                ctx.fillStyle = dotColor;
                ctx.beginPath();
                ctx.arc(15, 15, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.font = "10px monospace";
                ctx.fillStyle = "#AAAAAA";
                ctx.fillText("ENGINE ALIVE", 25, 18);

                if (handLandmarks && handLandmarks.length > 0) {
                    // 2. Draw Landmarks (YELLOW)
                    ctx.save();
                    ctx.fillStyle = "#FFD700";
                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 1;

                    handLandmarks.forEach((hand, hIdx) => {
                        hand.forEach((point: any, pIdx: number) => {
                            const px = (1 - point.x) * canvas.width;
                            const py = point.y * canvas.height;

                            ctx.beginPath();
                            ctx.arc(px, py, 4, 0, Math.PI * 2);
                            ctx.fill();

                            // Key landmarks only for less clutter
                            if (pIdx === 4 || pIdx === 8) {
                                ctx.stroke();
                            }
                        });
                    });

                    // Text Indicator
                    ctx.font = "bold 20px Outfit, sans-serif";
                    ctx.fillStyle = "#FFD700";
                    ctx.fillText(`👐 HAND DETECTED (${handLandmarks.length})`, 24, 60);
                    ctx.restore();

                    // 3. Gesture FX
                    let tx: number | undefined;
                    let ty: number | undefined;

                    if (isBopActive) {
                        const landmarks = handLandmarks[0];
                        if (landmarks && landmarks.length >= 9) {
                            const thumbTip = landmarks[4];
                            const indexTip = landmarks[8];

                            tx = (1 - (thumbTip.x + indexTip.x) / 2) * canvas.width;
                            ty = ((thumbTip.y + indexTip.y) / 2) * canvas.height;

                            system.spawn(tx, ty, 4);
                        }
                    }

                    system.update(tx, ty);
                    system.draw();
                } else {
                    if (isProcessing) {
                        ctx.font = "16px Outfit";
                        ctx.fillStyle = "rgba(255,255,255,0.3)";
                        ctx.fillText("WAITING FOR HANDS...", 24, 60);
                    }
                    system.update();
                    system.draw();
                }
            }
            animationId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationId);
    }, []);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                const parent = canvasRef.current.parentElement;
                if (parent) {
                    canvasRef.current.width = parent.clientWidth;
                    canvasRef.current.height = parent.clientHeight;
                }
            }
        };

        handleResize();
        const resizeObserver = new ResizeObserver(handleResize);
        if (canvasRef.current?.parentElement) {
            resizeObserver.observe(canvasRef.current.parentElement);
        }

        return () => resizeObserver.disconnect();
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-[60]" // Even higher z-index
        />
    );
}
