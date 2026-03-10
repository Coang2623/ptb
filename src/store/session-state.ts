import { create } from "zustand";

interface SessionState {
    photos: string[]; // Data URLs or Blobs
    sessionId: string | null;
    filter: string;
    brightness: number;
    frameColor: string;
    addPhoto: (photo: string) => void;
    removePhoto: (index: number) => void;
    clearPhotos: () => void;
    setSessionId: (id: string) => void;
    setFilter: (filter: string) => void;
    setBrightness: (brightness: number) => void;
    setFrameColor: (color: string) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    photos: [],
    sessionId: null,
    filter: "none",
    brightness: 100,
    frameColor: "white",
    addPhoto: (photo) => set((state) => ({
        photos: [...state.photos, photo].slice(-4) // Max 4 photos for the strip
    })),
    removePhoto: (index) => set((state) => ({
        photos: state.photos.filter((_, i) => i !== index)
    })),
    clearPhotos: () => set({ photos: [], filter: "none", brightness: 100, frameColor: "white" }),
    setSessionId: (id) => set({ sessionId: id }),
    setFilter: (filter) => set({ filter }),
    setBrightness: (brightness) => set({ brightness }),
    setFrameColor: (frameColor) => set({ frameColor }),
}));
