"use client";

import { useSessionStore } from "@/store/session-state";
import { CameraPreview } from "@/features/camera/components/CameraPreview";
import { CameraSelector } from "@/features/camera/components/CameraSelector";
import { AIStatusIndicator } from "@/features/ai-engine/components/AIStatusIndicator";
import { ReviewScreen } from "@/features/photostrip/components/ReviewScreen";
import { CameraStoreInitializer } from "@/features/camera/components/CameraStoreInitializer";
import { cn } from "@/lib/utils/cn";

export function StudioView({ id }: { id: string }) {
    const { photos } = useSessionStore();
    const isSessionComplete = photos.length >= 4;

    return (
        <div className="min-h-screen bg-midnight relative flex flex-col font-inter text-white">
            <CameraStoreInitializer />

            {/* Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-electric-cyan/10 blur-[150px] rounded-full -z-10" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-magical-violet/10 blur-[150px] rounded-full -z-10" />

            {/* Studio Header */}
            <header className="z-20 border-b border-white/5 backdrop-blur-md px-8 py-2 flex items-center justify-between">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-outfit text-white tracking-tight">
                        {isSessionComplete ? "Review Gallery" : "Magical Studio"}
                    </h2>
                    <p className="text-white/40 text-[10px] sm:text-xs font-mono uppercase tracking-widest leading-none mt-1">ID: {id.slice(0, 8)}...</p>
                </div>

                {!isSessionComplete && (
                    <div className="w-48 sm:w-64">
                        <CameraSelector />
                    </div>
                )}
            </header>

            {/* Main Studio Area */}
            <main className={cn("flex-1 flex items-center justify-center z-10", isSessionComplete ? "p-0" : "p-4 sm:p-6")}>
                <div className="max-w-5xl w-full h-full flex items-center justify-center">
                    {isSessionComplete ? (
                        <ReviewScreen />
                    ) : (
                        <CameraPreview />
                    )}
                </div>
            </main>

            {/* Footer Controls */}
            {!isSessionComplete && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
                    <AIStatusIndicator vertical />
                </div>
            )}
        </div>
    );
}
