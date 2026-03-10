"use client";

import { useEffect, useMemo, useRef } from "react";
import { useAIStore } from "@/store/ai-state";
import { getDistance } from "../utils/coordinates";

const FIST_THRESHOLD = 0.16;
const PINCH_THRESHOLD = 0.08;
const OPEN_THRESHOLD = 0.35; // Threshold for open hand distance

export function useGestureDetection() {
    const {
        handLandmarks,
        setIsSessionActive,
        isSessionActive,
        isOpenHandDetected,
        setIsOpenHandDetected
    } = useAIStore();

    useEffect(() => {
        if (!handLandmarks || handLandmarks.length === 0 || isSessionActive) {
            return;
        }

        let triggerActivated = false;

        for (const hand of handLandmarks) {
            if (hand.length < 21) continue;

            const wrist = hand[0];
            const fingerTips = [hand[8], hand[12], hand[16], hand[20]];
            const distances = fingerTips.map(tip => getDistance(tip, wrist));

            // 1. OPEN HAND DETECTION (🖐️)
            // If most fingers are extended far from the wrist
            const isOpen = distances.filter(d => d > OPEN_THRESHOLD).length >= 3;

            // 2. FIST DETECTION (✊)
            const isFist = distances.filter(d => d < FIST_THRESHOLD).length >= 3;

            // 3. PINCH/BOP DETECTION (🤏)
            const thumbTip = hand[4];
            const indexTip = hand[8];
            const pinchDistance = getDistance(thumbTip, indexTip);
            const isPinch = pinchDistance < PINCH_THRESHOLD;

            // SEQUENCE LOGIC:
            if (isOpen && !isOpenHandDetected) {
                console.log("🖐️ OPEN HAND DETECTED - MAGIC TRIGGER READY!");
                setIsOpenHandDetected(true);
            }

            if (isOpenHandDetected && (isFist || isPinch)) {
                console.log(`🚀 TRIGGER ACTIVATED! (${isFist ? '✊ FIST' : '🤏 PINCH'}) STARTING SESSION...`);
                triggerActivated = true;
                setIsOpenHandDetected(false); // Reset sequence
                break;
            }

            // DEBUG: Occasionally log stats
            if (Math.random() > 0.99) {
                console.log(`🖐️ GESTURE DEBUG: IsOpen: ${isOpen} | Ready: ${isOpenHandDetected} | Fist Dists: [${distances.map(d => d.toFixed(2)).join(",")}]`);
            }
        }

        if (triggerActivated && !isSessionActive) {
            setIsSessionActive(true);
        }
    }, [handLandmarks, isSessionActive, setIsSessionActive, isOpenHandDetected, setIsOpenHandDetected]);
}
