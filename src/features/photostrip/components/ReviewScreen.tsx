"use client";

import { useSessionStore } from "@/store/session-state";
import { motion } from "framer-motion";
import { Photostrip } from "./Photostrip";
import { cn } from "@/lib/utils/cn";

import { PHOTO_FILTERS } from "../utils/filters";

import { useAIStore } from "@/store/ai-state";

export function ReviewScreen() {
    const {
        photos,
        clearPhotos,
        filter: activeFilterId,
        setFilter,
        brightness,
        setBrightness,
        frameColor,
        setFrameColor
    } = useSessionStore();

    const handleRetake = () => {
        clearPhotos();
        const aiStore = useAIStore.getState();
        aiStore.setIsSessionActive(false);
        aiStore.setCountdown(null);
        aiStore.setShotCount(0);
    };

    return (
        <div className="w-full h-full min-h-screen flex flex-col md:flex-row items-center justify-center p-8 gap-12 overflow-y-auto">
            {/* Left side: The Photostrip Preview */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative group"
            >
                <div className="absolute -inset-4 bg-electric-cyan/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
                <Photostrip
                    photos={photos}
                    className="rotate-[-2deg] hover:rotate-0 transition-transform duration-500 cursor-zoom-in"
                />
            </motion.div>

            {/* Right side: Editor & Actions */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-md w-full flex flex-col gap-8"
            >
                <div className="text-left">
                    <h2 className="text-5xl font-bold font-outfit text-white mb-4 leading-tight tracking-tight">
                        Magical Shot <span className="text-electric-cyan">Revealed</span>
                    </h2>
                    <p className="text-white/40 font-inter uppercase tracking-[0.2em] text-sm">
                        Apply magical filters to your 4-cut story
                    </p>
                </div>

                {/* Filter Selection */}
                <div className="glass rounded-3xl p-6 border border-white/10 flex flex-col gap-4">
                    <span className="text-white/60 font-outfit text-xs uppercase tracking-widest font-bold">Select Filter</span>
                    <div className="grid grid-cols-3 gap-3">
                        {PHOTO_FILTERS.map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id)}
                                className={cn(
                                    "aspect-video rounded-xl border transition-all uppercase tracking-tighter text-[10px] font-bold flex items-center justify-center",
                                    activeFilterId === f.id
                                        ? "bg-electric-cyan/20 border-electric-cyan text-electric-cyan shadow-[0_0_15px_rgba(0,242,255,0.3)]"
                                        : "bg-midnight border-white/5 text-white/40 hover:text-white hover:border-white/20"
                                )}
                            >
                                {f.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Brightness Control */}
                <div className="glass rounded-3xl p-6 border border-white/10 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <span className="text-white/60 font-outfit text-xs uppercase tracking-widest font-bold">Brightness</span>
                        <span className="text-electric-cyan font-mono text-xs">{brightness}%</span>
                    </div>
                    <input
                        type="range"
                        min="50"
                        max="150"
                        value={brightness}
                        onChange={(e) => setBrightness(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-full appearance-none accent-electric-cyan cursor-pointer"
                    />
                </div>

                {/* Frame Color Selection */}
                <div className="glass rounded-3xl p-6 border border-white/10 flex flex-col gap-4">
                    <span className="text-white/60 font-outfit text-xs uppercase tracking-widest font-bold">Frame Theme</span>
                    <div className="flex gap-4">
                        {[
                            { id: 'white', class: 'bg-white border-black/10' },
                            { id: 'black', class: 'bg-midnight border-white/20' },
                            { id: 'violet', class: 'bg-magical-violet border-black/10' }
                        ].map((color) => (
                            <button
                                key={color.id}
                                onClick={() => setFrameColor(color.id)}
                                className={cn(
                                    "w-12 h-12 rounded-full border-4 transition-all relative",
                                    color.class,
                                    frameColor === color.id ? "scale-110 border-electric-cyan" : "border-transparent opacity-60 hover:opacity-100"
                                )}
                            >
                                {frameColor === color.id && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-electric-cyan" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Final Actions */}
                <div className="flex flex-col gap-4 mt-4">
                    <button className="w-full py-5 rounded-3xl bg-gradient-to-r from-electric-cyan to-magical-violet text-midnight font-outfit font-black text-xl shadow-[0_0_40px_rgba(0,242,255,0.4)] hover:shadow-[0_0_60px_rgba(0,242,255,0.6)] transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                        GET YOUR PHOTOSTRIP
                    </button>

                    <button
                        onClick={handleRetake}
                        className="w-full py-4 rounded-3xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white font-outfit font-semibold transition-all border border-white/5 uppercase text-xs tracking-widest"
                    >
                        Retake & Reshoot
                    </button>
                </div>

                <p className="text-center text-white/10 font-inter text-[10px] uppercase tracking-[0.4em] mt-4">
                    Final Master PNG Resolution: 720x1280
                </p>
            </motion.div>
        </div>
    );
}
