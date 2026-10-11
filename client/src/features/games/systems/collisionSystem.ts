import type { BladePoint } from "../config/game.types";

export interface CircleEntity {
  x: number;
  y: number;
  radius: number;
}

/**
 * High-performance line segment vs circle intersection
 * (Rule 12: pure mathematical computation kept isolated)
 */
export function lineIntersectsCircle(
  p1: BladePoint,
  p2: BladePoint,
  c: CircleEntity
): boolean {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return false;

  const u = ((c.x - p1.x) * dx + (c.y - p1.y) * dy) / lenSq;
  const clampedU = Math.max(0, Math.min(1, u));
  const nearestX = p1.x + clampedU * dx;
  const nearestY = p1.y + clampedU * dy;

  const distX = c.x - nearestX;
  const distY = c.y - nearestY;
  return distX * distX + distY * distY <= c.radius * c.radius;
}
