import { create } from "zustand";

interface CameraState {
    devices: MediaDeviceInfo[];
    selectedDeviceId: string | null;
    setDevices: (devices: MediaDeviceInfo[]) => void;
    setSelectedDeviceId: (id: string) => void;
}

export const useCameraStore = create<CameraState>((set) => ({
    devices: [],
    selectedDeviceId: null,
    setDevices: (devices) => set({ devices }),
    setSelectedDeviceId: (id) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("bop_preferred_camera", id);
        }
        set({ selectedDeviceId: id });
    },
}));
