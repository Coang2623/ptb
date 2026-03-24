export const cameraService = {
    async enumerateCameras(): Promise<MediaDeviceInfo[]> {
        if (!navigator.mediaDevices?.enumerateDevices) {
            console.warn("Media devices API not available");
            return [];
        }

        // Request initial permission to get labels
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach((track) => track.stop());
        } catch (error) {
            console.error("Error requesting camera permission:", error);
        }

        const allDevices = await navigator.mediaDevices.enumerateDevices();
        return allDevices.filter((device) => device.kind === "videoinput");
    },

    async getCameraStream(deviceId?: string): Promise<MediaStream> {
        const constraints: MediaStreamConstraints = {
            video: {
                deviceId: deviceId ? { exact: deviceId } : undefined,
                width: { ideal: 3840 },
                height: { ideal: 2160 },
            },
        };

        return await navigator.mediaDevices.getUserMedia(constraints);
    },
};
