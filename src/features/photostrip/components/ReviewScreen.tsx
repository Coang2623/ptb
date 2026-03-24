"use client";

import { useState } from "react";
import { useSessionStore } from "@/store/session-state";
import { motion } from "framer-motion";
import { Photostrip } from "./Photostrip";
import { cn } from "@/lib/utils/cn";

import { PHOTO_FILTERS, FILTER_CATEGORIES, getFilterStyle } from "../utils/filters";
import { exportPhotostrip } from "../utils/exportPhotostrip";

import { useAIStore } from "@/store/ai-state";

export function ReviewScreen() {
    const {
        photos,
        clearPhotos,
        filter: activeFilterId,
        setFilter,
        brightness,
        setBrightness,
        skinSmooth,
        setSkinSmooth,
        skinBright,
        setSkinBright,
        frameColor,
        setFrameColor
    } = useSessionStore();

    const [activeCategory, setActiveCategory] = useState<string>("basic");
    const filteredFilters = PHOTO_FILTERS.filter(f => f.category === activeCategory);

    const handleExport = () => {
        const filterStyle = getFilterStyle(activeFilterId, brightness, skinSmooth, skinBright);
        exportPhotostrip(photos, filterStyle.filter as string, frameColor);
    };

    const handleRetake = () => {
        clearPhotos();
        const aiStore = useAIStore.getState();
        aiStore.setIsSessionActive(false);
        aiStore.setCountdown(null);
        aiStore.setShotCount(0);
    };

    return (
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-center p-4 md:p-6 gap-6 md:gap-10 overflow-hidden">
            {/* Left side: The Photostrip Preview — scale to fit viewport */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative group shrink-0 flex items-center justify-center"
                style={{ height: "calc(100vh - 9rem)" }}
            >
                <div className="absolute -inset-4 bg-electric-cyan/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
                <Photostrip
                    photos={photos}
                    className="rotate-[-2deg] hover:rotate-0 transition-transform duration-500 cursor-zoom-in"
                    fitHeight
                />
            </motion.div>

            {/* Right side: Editor & Actions */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-sm w-full flex flex-col gap-4"
            >
                <div className="text-left">
                    <h2 className="text-3xl md:text-4xl font-bold font-outfit text-white mb-1 leading-tight tracking-tight">
                        Magical Shot <span className="text-electric-cyan">Revealed</span>
                    </h2>
                    <p className="text-white/40 font-inter uppercase tracking-[0.2em] text-xs">
                        Apply magical filters to your 4-cut story
                    </p>
                </div>

                {/* Filter Selection */}
                <div className="glass rounded-2xl p-4 border border-white/10 flex flex-col gap-3">
                    {/* Category Tabs */}
                    <div className="flex gap-1 bg-white/5 rounded-xl p-1">
                        {FILTER_CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={cn(
                                    "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                    activeCategory === cat.id
                                        ? "bg-electric-cyan/20 text-electric-cyan"
                                        : "text-white/30 hover:text-white/60"
                                )}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                    {/* Filter Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                        {filteredFilters.map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id)}
                                className={cn(
                                    "py-2 px-1 rounded-lg border transition-all text-[9px] font-bold flex items-center justify-center whitespace-nowrap",
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

                {/* Adjustments */}
                <div className="glass rounded-2xl p-4 border border-white/10 flex flex-col gap-3">
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
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-white/60 font-outfit text-xs uppercase tracking-widest font-bold">Skin Bright</span>
                        <span className="text-electric-cyan font-mono text-xs">{skinBright}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={skinBright}
                        onChange={(e) => setSkinBright(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-full appearance-none accent-electric-cyan cursor-pointer"
                    />
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-white/60 font-outfit text-xs uppercase tracking-widest font-bold">Skin Smooth</span>
                        <span className="text-electric-cyan font-mono text-xs">{skinSmooth}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={skinSmooth}
                        onChange={(e) => setSkinSmooth(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-full appearance-none accent-electric-cyan cursor-pointer"
                    />
                </div>

                {/* Frame Color Selection */}
                <div className="glass rounded-2xl p-4 border border-white/10 flex items-center gap-4">
                    <span className="text-white/60 font-outfit text-xs uppercase tracking-widest font-bold">Frame</span>
                    <div className="flex gap-2">
                        {[
                            { id: 'white', class: 'bg-white border-black/10' },
                            { id: 'black', class: 'bg-midnight border-white/20' },
                            { id: 'violet', class: 'bg-magical-violet border-black/10' }
                        ].map((color) => (
                            <button
                                key={color.id}
                                onClick={() => setFrameColor(color.id)}
                                className={cn(
                                    "w-8 h-8 rounded-full border-2 transition-all relative",
                                    color.class,
                                    frameColor === color.id ? "scale-110 border-electric-cyan" : "border-transparent opacity-60 hover:opacity-100"
                                )}
                            >
                                {frameColor === color.id && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-electric-cyan" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Final Actions */}
                <div className="flex flex-col gap-3 mt-1">
                    <button
                        onClick={handleExport}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-electric-cyan to-magical-violet text-midnight font-outfit font-black text-lg shadow-[0_0_40px_rgba(0,242,255,0.4)] hover:shadow-[0_0_60px_rgba(0,242,255,0.6)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        GET YOUR PHOTOSTRIP
                    </button>

                    <button
                        onClick={handleRetake}
                        className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white font-outfit font-semibold transition-all border border-white/5 uppercase text-xs tracking-widest"
                    >
                        Retake & Reshoot
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
