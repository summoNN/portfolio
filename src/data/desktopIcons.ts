export interface DesktopIconConfig {
  id: string;
  badge?: string;
  defaultPosition: {
    xPercent: number; // Percentage of viewport width (0-100)
    yPercent: number; // Percentage of viewport height (0-100)
  };
}

export interface IconPosition {
  x: number;
  y: number;
}

export const DESKTOP_ICON_CONFIGS: DesktopIconConfig[] = [
  { id: 'about', badge: 'Identity', defaultPosition: { xPercent: 12, yPercent: 15 } },
  { id: 'experience', badge: 'Timeline', defaultPosition: { xPercent: 16, yPercent: 44 } },
  { id: 'projects', badge: 'Featured', defaultPosition: { xPercent: 42, yPercent: 48 } },
  { id: 'skills', badge: 'Stack', defaultPosition: { xPercent: 68, yPercent: 16 } },
  { id: 'resume', badge: 'Curriculum', defaultPosition: { xPercent: 72, yPercent: 42 } },
];

export const DESKTOP_STORAGE_KEY = 'desktop-icon-positions-v2';

export const ICON_WIDTH = 100;
export const ICON_HEIGHT = 90;
export const TOP_BAR_HEIGHT = 38;
export const DOCK_AREA_HEIGHT = 90;
export const DESKTOP_MARGIN = 16;
export const GRID_SNAP = 32;

/**
 * Returns usable desktop boundaries given viewport dimensions
 */
export function getUsableBounds(viewportWidth: number, viewportHeight: number) {
  const minX = DESKTOP_MARGIN;
  const maxX = Math.max(minX, viewportWidth - ICON_WIDTH - DESKTOP_MARGIN);
  const minY = TOP_BAR_HEIGHT + DESKTOP_MARGIN;
  const maxY = Math.max(minY, viewportHeight - DOCK_AREA_HEIGHT - ICON_HEIGHT - DESKTOP_MARGIN);

  return { minX, maxX, minY, maxY };
}

/**
 * Snaps a coordinate to the subtle desktop grid and clamps inside the usable viewport
 */
export function snapAndClampPosition(
  x: number,
  y: number,
  viewportWidth: number,
  viewportHeight: number
): IconPosition {
  const { minX, maxX, minY, maxY } = getUsableBounds(viewportWidth, viewportHeight);

  // Snap relative to top-left bounds
  const snappedX = Math.round((x - minX) / GRID_SNAP) * GRID_SNAP + minX;
  const snappedY = Math.round((y - minY) / GRID_SNAP) * GRID_SNAP + minY;

  const clampedX = Math.min(Math.max(minX, snappedX), maxX);
  const clampedY = Math.min(Math.max(minY, snappedY), maxY);

  return { x: clampedX, y: clampedY };
}

/**
 * Calculates initial default positions for all configured icons
 */
export function calculateDefaultPositions(
  viewportWidth: number,
  viewportHeight: number
): Record<string, IconPosition> {
  const result: Record<string, IconPosition> = {};

  for (const item of DESKTOP_ICON_CONFIGS) {
    const rawX = (item.defaultPosition.xPercent / 100) * viewportWidth;
    const rawY = (item.defaultPosition.yPercent / 100) * viewportHeight;
    result[item.id] = snapAndClampPosition(rawX, rawY, viewportWidth, viewportHeight);
  }

  return result;
}

/**
 * Checks for collisions with other icons and shifts to the nearest available grid slot if needed
 */
export function resolveCollisions(
  targetId: string,
  candidatePos: IconPosition,
  allPositions: Record<string, IconPosition>,
  viewportWidth: number,
  viewportHeight: number
): IconPosition {
  const COLLISION_THRESHOLD = 72; // pixels
  const { minX, maxX, minY, maxY } = getUsableBounds(viewportWidth, viewportHeight);

  const hasCollision = (pos: IconPosition) => {
    return Object.entries(allPositions).some(([id, otherPos]) => {
      if (id === targetId) return false;
      const dx = Math.abs(pos.x - otherPos.x);
      const dy = Math.abs(pos.y - otherPos.y);
      return dx < COLLISION_THRESHOLD && dy < COLLISION_THRESHOLD;
    });
  };

  if (!hasCollision(candidatePos)) {
    return candidatePos;
  }

  // Search adjacent grid offsets
  const step = GRID_SNAP * 3; // 96px
  const offsets = [
    { dx: 0, dy: step },
    { dx: 0, dy: -step },
    { dx: step, dy: 0 },
    { dx: -step, dy: 0 },
    { dx: step, dy: step },
    { dx: -step, dy: step },
    { dx: step, dy: -step },
    { dx: -step, dy: -step },
  ];

  for (const offset of offsets) {
    const testX = Math.min(Math.max(minX, candidatePos.x + offset.dx), maxX);
    const testY = Math.min(Math.max(minY, candidatePos.y + offset.dy), maxY);
    const testPos = { x: testX, y: testY };
    if (!hasCollision(testPos)) {
      return testPos;
    }
  }

  return candidatePos;
}
