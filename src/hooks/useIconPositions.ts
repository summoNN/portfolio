import { useState, useCallback, useEffect } from 'react';
import { gridApps, dockApps } from '../data/apps';

const STORAGE_KEY = 'portfolio-icon-positions';

interface IconPositions {
  gridOrder: string[];
  dockOrder: string[];
}

function getDefaultPositions(): IconPositions {
  return {
    gridOrder: gridApps.map((a) => a.id),
    dockOrder: dockApps.map((a) => a.id),
  };
}

function loadPositions(): IconPositions {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as IconPositions;
      // Validate that all app IDs are present
      const allGridIds = new Set(gridApps.map((a) => a.id));
      const allDockIds = new Set(dockApps.map((a) => a.id));

      const gridValid =
        parsed.gridOrder.length === allGridIds.size &&
        parsed.gridOrder.every((id) => allGridIds.has(id));
      const dockValid =
        parsed.dockOrder.length === allDockIds.size &&
        parsed.dockOrder.every((id) => allDockIds.has(id));

      if (gridValid && dockValid) return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return getDefaultPositions();
}

export function useIconPositions() {
  const [positions, setPositions] = useState<IconPositions>(loadPositions);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  }, [positions]);

  const updateGridOrder = useCallback((newOrder: string[]) => {
    setPositions((prev) => ({ ...prev, gridOrder: newOrder }));
  }, []);

  const updateDockOrder = useCallback((newOrder: string[]) => {
    setPositions((prev) => ({ ...prev, dockOrder: newOrder }));
  }, []);

  return {
    gridOrder: positions.gridOrder,
    dockOrder: positions.dockOrder,
    updateGridOrder,
    updateDockOrder,
  };
}
