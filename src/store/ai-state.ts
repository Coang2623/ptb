import { create } from "zustand";

export interface Point3D {
    x: number;
    y: number;
    z: number;
}

interface AIState {
    handLandmarks: Point3D[][] | null;
    isBopActive: boolean;
    bopProgress: number; // 0.0 to 1.0 (legacy pinch)
    isProcessing: boolean;

    // NEW: Automated Session State
    isSessionActive: boolean;
    countdown: number | null;
    shotCount: number; // Current shot number in session
    flashTrigger: number; // Increment to trigger a flash pulse
    isOpenHandDetected: boolean;

    setHandLandmarks: (landmarks: Point3D[][]) => void;
    setIsBopActive: (active: boolean) => void;
    setBopProgress: (progress: number) => void;
    setIsProcessing: (processing: boolean) => void;

    setIsSessionActive: (active: boolean) => void;
    setCountdown: (seconds: number | null) => void;
    setShotCount: (count: number) => void;
    triggerFlash: () => void;
    setIsOpenHandDetected: (detected: boolean) => void;
}

export const useAIStore = create<AIState>((set) => ({
    handLandmarks: [],
    isBopActive: false,
    bopProgress: 0,
    isProcessing: false,

    isSessionActive: false,
    countdown: null,
    shotCount: 0,
    flashTrigger: 0,
    isOpenHandDetected: false,

    setHandLandmarks: (landmarks) => set({ handLandmarks: landmarks }),
    setIsBopActive: (active) => set({ isBopActive: active }),
    setBopProgress: (progress) => set({ bopProgress: progress }),
    setIsProcessing: (processing) => set({ isProcessing: processing }),

    setIsSessionActive: (active) => set({ isSessionActive: active }),
    setCountdown: (seconds) => set({ countdown: seconds }),
    setShotCount: (count) => set({ shotCount: count }),
    triggerFlash: () => set((state) => ({ flashTrigger: state.flashTrigger + 1 })),
    setIsOpenHandDetected: (detected) => set({ isOpenHandDetected: detected }),
}));

// Better DX for automation
if (typeof window !== "undefined") {
    (window as any).useAIStore = useAIStore;
}
