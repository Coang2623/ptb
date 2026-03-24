"use client";

import { useAIStore } from "@/store/ai-state";
import { cn } from "@/lib/utils/cn";

export function AIStatusIndicator({ vertical }: { vertical?: boolean }) {
    const { isProcessing, isOpenHandDetected, isSessionActive } = useAIStore();

    return (
        <div className={cn(
            "glass text-white/30 text-sm font-medium",
            vertical
                ? "px-4 py-6 rounded-2xl flex flex-col gap-4 items-start"
                : "px-8 py-4 rounded-full flex gap-6 items-center"
        )}>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isProcessing ? 'bg-electric-cyan animate-pulse shadow-[0_0_8px_rgba(0,242,255,1)]' : 'bg-white/20'}`} />
                <span className={isProcessing ? 'text-white/80' : ''}>
                    AI {isProcessing ? 'Active' : 'Off'}
                </span>
            </div>

            <span className={vertical ? "w-full h-[1px] bg-white/10" : "w-[1px] h-4 bg-white/10"} />

            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isSessionActive ? 'bg-red-500 animate-pulse' :
                    isOpenHandDetected ? 'bg-electric-cyan scale-150 shadow-[0_0_12px_rgba(0,242,255,1)]' : 'bg-white/10'
                    }`} />
                <span className={cn(
                    "transition-colors",
                    isSessionActive ? 'text-red-500' :
                        isOpenHandDetected ? 'text-electric-cyan brightness-150' : ''
                )}>
                    {isSessionActive ? 'SESSION LIVE' : isOpenHandDetected ? 'MAGIC READY:握' : '🖐️ → ✊'}
                </span>
            </div>

            <span className={vertical ? "w-full h-[1px] bg-white/10" : "w-[1px] h-4 bg-white/10"} />
            <span className="text-[10px] uppercase tracking-tighter opacity-50 font-mono">
                {isOpenHandDetected ? 'Close hand to start' : 'Open hand first'}
            </span>
        </div>
    );
}
