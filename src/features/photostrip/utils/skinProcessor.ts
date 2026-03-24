/**
 * Skin Detection & Processing
 * Uses dual color-space (YCbCr + HSV) for accurate skin detection,
 * then applies selective brightening and smoothing only to skin regions.
 */

interface SkinProcessOptions {
    brightLevel: number; // 0-100
    smoothLevel: number; // 0-100
}

/**
 * Detect skin pixels using YCbCr + HSV dual color-space analysis.
 * Returns a mask (Uint8Array) where 255 = skin, 0 = not skin.
 */
function detectSkinMask(imageData: ImageData): Uint8Array {
    const { data, width, height } = imageData;
    const mask = new Uint8Array(width * height);

    for (let i = 0; i < width * height; i++) {
        const idx = i * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // --- YCbCr color space check ---
        const y = 0.299 * r + 0.587 * g + 0.114 * b;
        const cb = 128 - 0.169 * r - 0.331 * g + 0.500 * b;
        const cr = 128 + 0.500 * r - 0.419 * g - 0.081 * b;

        const ycbcrSkin =
            y > 80 &&
            cb > 77 && cb < 127 &&
            cr > 133 && cr < 173;

        // --- HSV color space check ---
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;

        let h = 0;
        if (delta > 0) {
            if (max === r) h = 60 * (((g - b) / delta) % 6);
            else if (max === g) h = 60 * ((b - r) / delta + 2);
            else h = 60 * ((r - g) / delta + 4);
        }
        if (h < 0) h += 360;

        const s = max === 0 ? 0 : delta / max;
        const v = max / 255;

        const hsvSkin =
            ((h >= 0 && h <= 50) || (h >= 340 && h <= 360)) &&
            s >= 0.1 && s <= 0.75 &&
            v >= 0.2;

        // --- RGB rule (additional constraint) ---
        const rgbSkin =
            r > 95 && g > 40 && b > 20 &&
            r > g && r > b &&
            Math.abs(r - g) > 15 &&
            (max - min) > 15;

        // Require at least 2 of 3 checks to pass
        const votes = (ycbcrSkin ? 1 : 0) + (hsvSkin ? 1 : 0) + (rgbSkin ? 1 : 0);
        mask[i] = votes >= 2 ? 255 : 0;
    }

    return mask;
}

/**
 * Blur the skin mask to create soft edges (feathering).
 * Uses a simple box blur for performance.
 */
function blurMask(mask: Uint8Array, width: number, height: number, radius: number): Uint8Array {
    if (radius <= 0) return mask;

    const blurred = new Uint8Array(width * height);
    const size = radius * 2 + 1;
    const area = size * size;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let sum = 0;
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const ny = Math.min(height - 1, Math.max(0, y + dy));
                    const nx = Math.min(width - 1, Math.max(0, x + dx));
                    sum += mask[ny * width + nx];
                }
            }
            blurred[y * width + x] = Math.round(sum / area);
        }
    }

    return blurred;
}

/**
 * Apply skin brightening and smoothing using the skin mask.
 * Modifies imageData in place.
 */
function applySkinEffects(
    imageData: ImageData,
    mask: Uint8Array,
    options: SkinProcessOptions
): void {
    const { data, width, height } = imageData;
    const { brightLevel, smoothLevel } = options;

    // Pre-compute a blurred version for smoothing
    let blurredData: Uint8ClampedArray | null = null;
    if (smoothLevel > 0) {
        blurredData = smoothImage(data, width, height, Math.ceil(smoothLevel / 15));
    }

    const brightFactor = 1 + brightLevel * 0.005; // 0% → 1.0, 100% → 1.5
    const smoothAlpha = Math.min(smoothLevel / 100, 0.85); // max 85% smooth blend

    for (let i = 0; i < width * height; i++) {
        const maskValue = mask[i] / 255; // 0.0 - 1.0 (feathered)
        if (maskValue < 0.01) continue;

        const idx = i * 4;

        let r = data[idx];
        let g = data[idx + 1];
        let b = data[idx + 2];

        // Smoothing: blend with blurred version
        if (blurredData && smoothAlpha > 0) {
            const blend = maskValue * smoothAlpha;
            r = r * (1 - blend) + blurredData[idx] * blend;
            g = g * (1 - blend) + blurredData[idx + 1] * blend;
            b = b * (1 - blend) + blurredData[idx + 2] * blend;
        }

        // Brightening: only on skin
        if (brightLevel > 0) {
            const bf = 1 + (brightFactor - 1) * maskValue;
            r = Math.min(255, r * bf);
            g = Math.min(255, g * bf);
            b = Math.min(255, b * bf);
        }

        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
    }
}

/**
 * Simple box blur on raw pixel data for skin smoothing.
 */
function smoothImage(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    radius: number
): Uint8ClampedArray {
    const result = new Uint8ClampedArray(data.length);
    const size = radius * 2 + 1;
    const area = size * size;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let sumR = 0, sumG = 0, sumB = 0;
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const ny = Math.min(height - 1, Math.max(0, y + dy));
                    const nx = Math.min(width - 1, Math.max(0, x + dx));
                    const idx = (ny * width + nx) * 4;
                    sumR += data[idx];
                    sumG += data[idx + 1];
                    sumB += data[idx + 2];
                }
            }
            const idx = (y * width + x) * 4;
            result[idx] = Math.round(sumR / area);
            result[idx + 1] = Math.round(sumG / area);
            result[idx + 2] = Math.round(sumB / area);
            result[idx + 3] = data[idx + 3];
        }
    }

    return result;
}

/**
 * Main entry: process a canvas with skin-aware effects.
 * Call this on each photo's offscreen canvas after drawing.
 */
export function processSkinEffects(
    canvas: HTMLCanvasElement | OffscreenCanvas,
    options: SkinProcessOptions
): void {
    if (options.brightLevel <= 0 && options.smoothLevel <= 0) return;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // 1. Detect skin regions
    const rawMask = detectSkinMask(imageData);

    // 2. Feather mask edges for natural blending
    const featherRadius = Math.max(3, Math.round(Math.min(canvas.width, canvas.height) / 150));
    const mask = blurMask(rawMask, canvas.width, canvas.height, featherRadius);

    // 3. Apply effects only to skin
    applySkinEffects(imageData, mask, options);

    // 4. Write back
    ctx.putImageData(imageData, 0, 0);
}
