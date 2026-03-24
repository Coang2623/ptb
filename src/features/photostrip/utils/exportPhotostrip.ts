const FRAME_COLORS: Record<string, { bg: string; text: string }> = {
    white: { bg: "#FFFFFF", text: "#0A0E17" },
    black: { bg: "#0A0E17", text: "#FFFFFF" },
    violet: { bg: "#B066FE", text: "#0A0E17" },
};

const WIDTH = 1440;
const PADDING = 60;
const GAP = 24;
const PHOTO_WIDTH = WIDTH - PADDING * 2;
const PHOTO_HEIGHT = PHOTO_WIDTH * 3 / 4; // 4:3 aspect
const FOOTER_HEIGHT = 160;
const HEIGHT = PADDING * 2 + PHOTO_HEIGHT * 4 + GAP * 3 + FOOTER_HEIGHT;

export async function exportPhotostrip(
    photos: string[],
    filterCss: string,
    frameColor: string
): Promise<void> {
    const theme = FRAME_COLORS[frameColor] || FRAME_COLORS.white;

    const canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Draw photos
    for (let i = 0; i < 4; i++) {
        const y = PADDING + i * (PHOTO_HEIGHT + GAP);
        const photoSrc = photos[i];

        if (photoSrc) {
            const img = await loadImage(photoSrc);

            // Apply filter via offscreen canvas
            const offscreen = document.createElement("canvas");
            offscreen.width = PHOTO_WIDTH;
            offscreen.height = PHOTO_HEIGHT;
            const offCtx = offscreen.getContext("2d")!;
            offCtx.filter = filterCss || "none";

            // Cover crop
            const scale = Math.max(PHOTO_WIDTH / img.width, PHOTO_HEIGHT / img.height);
            const sw = PHOTO_WIDTH / scale;
            const sh = PHOTO_HEIGHT / scale;
            const sx = (img.width - sw) / 2;
            const sy = (img.height - sh) / 2;
            offCtx.drawImage(img, sx, sy, sw, sh, 0, 0, PHOTO_WIDTH, PHOTO_HEIGHT);

            ctx.drawImage(offscreen, PADDING, y);
        } else {
            ctx.fillStyle = "#0A0E17";
            ctx.fillRect(PADDING, y, PHOTO_WIDTH, PHOTO_HEIGHT);
        }
    }

    // Branding footer
    const footerY = PADDING + 4 * PHOTO_HEIGHT + 3 * GAP + 20;
    ctx.fillStyle = theme.text;
    ctx.textAlign = "center";
    ctx.font = "bold 72px 'Outfit', sans-serif";
    ctx.fillText("BOP", WIDTH / 2, footerY + 60);
    ctx.font = "20px 'Inter', sans-serif";
    ctx.globalAlpha = 0.4;
    ctx.fillText("MAGICAL STUDIO EXPERIENCE", WIDTH / 2, footerY + 100);
    ctx.globalAlpha = 1;

    // Download
    const link = document.createElement("a");
    link.download = `bop-photostrip-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}
