import { Point3D } from "@/store/ai-state";

/**
 * Calculates the Euclidean distance between two 3D points.
 */
export function getDistance(p1: Point3D, p2: Point3D): number {
    return Math.sqrt(
        Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2)
    );
}

/**
 * Normalizes a value relative to a hand's size (e.g. distance between wrist and index mcp).
 * This helps make gesture detection distance-independent.
 */
export function getNormalizedDistance(p1: Point3D, p2: Point3D, scale: number): number {
    return getDistance(p1, p2) / scale;
}
