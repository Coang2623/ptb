import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let handLandmarker: HandLandmarker | null = null;

self.onmessage = async (event) => {
    const { type, payload, timestamp } = event.data;

    if (type === "INIT") {
        try {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );
            handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                },
                runningMode: "VIDEO",
                numHands: 2,
                minHandDetectionConfidence: 0.7, // Stricter detection
                minHandPresenceConfidence: 0.7,   // Stricter presence
                minTrackingConfidence: 0.5
            });
            console.log("✅ AI Engine: MediaPipe HandLandmarker Ready (High Confidence)");
            self.postMessage({ type: "INIT_DONE" });
        } catch (error) {
            console.error("❌ AI Engine: Init Error:", error);
            self.postMessage({ type: "ERROR", payload: "Failed to initialize AI" });
        }
    }

    if (type === "PROCESS_FRAME") {
        if (!handLandmarker) {
            if (payload && payload.close) payload.close();
            return;
        }
        try {
            const results = handLandmarker.detectForVideo(payload, timestamp);

            // Send empty results instead of null to keep stores stable
            self.postMessage({
                type: "RESULTS",
                multiHandLandmarks: results.landmarks || [],
            });
        } catch (error) {
            // Log once per many errors
            if (Math.random() > 0.99) {
                console.error("AI Engine: Processing error:", error);
            }
            self.postMessage({ type: "RESULTS", multiHandLandmarks: [] });
        } finally {
            if (payload && payload.close) payload.close();
        }
    }
};
