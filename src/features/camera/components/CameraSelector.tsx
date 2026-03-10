"use client";

import { useCameraStore } from "@/store/camera-state";

export function CameraSelector() {
    const { devices, selectedDeviceId, setSelectedDeviceId } = useCameraStore();

    if (devices.length === 0) return null;

    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-widest px-1">
                Select Camera
            </label>
            <div className="relative group">
                <select
                    value={selectedDeviceId || ""}
                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                    className="w-full appearance-none bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-white font-inter focus:outline-none focus:border-electric-cyan/50 hover:bg-white/10 transition-all cursor-pointer"
                >
                    {devices.map((device) => (
                        <option key={device.deviceId} value={device.deviceId} className="bg-midnight text-white">
                            {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
                        </option>
                    ))}
                </select>

                {/* Custom arrow */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 group-hover:text-electric-cyan transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
