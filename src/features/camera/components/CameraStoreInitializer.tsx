"use client";

import { useEffect } from "react";
import { useCameraStore } from "@/store/camera-state";
import { cameraService } from "../services/camera.service";

export function CameraStoreInitializer() {
    const { setDevices, setSelectedDeviceId, selectedDeviceId } = useCameraStore();

    useEffect(() => {
        async function init() {
            const videoDevices = await cameraService.enumerateCameras();
            setDevices(videoDevices);

            // Restore preference
            const saved = localStorage.getItem("bop_preferred_camera");
            if (saved && videoDevices.find((d) => d.deviceId === saved)) {
                setSelectedDeviceId(saved);
            } else if (videoDevices.length > 0 && !selectedDeviceId) {
                setSelectedDeviceId(videoDevices[0].deviceId);
            }
        }

        init();
    }, [setDevices, setSelectedDeviceId, selectedDeviceId]);

    return null;
}
