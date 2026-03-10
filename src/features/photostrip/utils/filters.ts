export interface FilterConfig {
    name: string;
    id: string;
    style: string;
}

export const PHOTO_FILTERS: FilterConfig[] = [
    {
        id: "none",
        name: "Natural",
        style: ""
    },
    {
        id: "k-retro",
        name: "K-Retro",
        style: "sepia(0.2) contrast(1.1) brightness(1.1) saturate(0.8)"
    },
    {
        id: "beauty",
        name: "Beauty",
        style: "contrast(1.05) brightness(1.15) saturate(0.9) blur(0.5px)"
    },
    {
        id: "noir",
        name: "Noir",
        style: "grayscale(1) contrast(1.2) brightness(0.9)"
    },
    {
        id: "magic",
        name: "Magic",
        style: "hue-rotate(10deg) saturate(1.4) brightness(1.1) contrast(1.05)"
    }
];

export function getFilterStyle(filterId: string, brightness: number = 100): React.CSSProperties {
    const filter = PHOTO_FILTERS.find(f => f.id === filterId);
    const brightnessFilter = `brightness(${brightness}%)`;

    return {
        filter: `${filter?.style || ""} ${brightnessFilter}`.trim()
    };
}
