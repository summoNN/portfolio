import { useState, useEffect, useCallback, useRef } from 'react';
import {
  type IconPosition,
  DESKTOP_STORAGE_KEY,
  calculateDefaultPositions,
  snapAndClampPosition,
  resolveCollisions,
} from '../data/desktopIcons';

export interface UseDesktopIconsReturn {
  positions: Record<string, IconPosition>;
  selectedIconId: string | null;
  activeDraggingId: string | null;
  selectIcon: (id: string | null) => void;
  updateIconPosition: (id: string, rawPosition: IconPosition) => void;
  setDraggingIcon: (id: string | null) => void;
  resetToDefault: () => void;
}

export function useDesktopIcons(): UseDesktopIconsReturn {
  const [positions, setPositions] = useState<Record<string, IconPosition>>({});
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [activeDraggingId, setActiveDraggingId] = useState<string | null>(null);
  const isInitializedRef = useRef(false);

  // Initialize positions from localStorage or fallback to defaults
  useEffect(() => {
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 768;

    let loadedPositions: Record<string, IconPosition> | null = null;

    try {
      const saved = localStorage.getItem(DESKTOP_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          // Validate and clamp saved positions to current viewport
          const clamped: Record<string, IconPosition> = {};
          for (const [id, pos] of Object.entries(parsed)) {
            if (
              typeof pos === 'object' &&
              pos !== null &&
              typeof (pos as IconPosition).x === 'number' &&
              typeof (pos as IconPosition).y === 'number'
            ) {
              clamped[id] = snapAndClampPosition(
                (pos as IconPosition).x,
                (pos as IconPosition).y,
                screenW,
                screenH
              );
            }
          }
          if (Object.keys(clamped).length > 0) {
            loadedPositions = clamped;
          }
        }
      }
    } catch {
      // Fallback
    }

    if (!loadedPositions) {
      loadedPositions = calculateDefaultPositions(screenW, screenH);
    }

    setPositions(loadedPositions);
    isInitializedRef.current = true;
  }, []);

  // Save to localStorage when positions change after initialization
  useEffect(() => {
    if (!isInitializedRef.current || Object.keys(positions).length === 0) return;

    try {
      localStorage.setItem(DESKTOP_STORAGE_KEY, JSON.stringify(positions));
    } catch {
      // Ignore quota errors
    }
  }, [positions]);

  // Handle window resizing: clamp existing positions to stay inside usable viewport
  useEffect(() => {
    const handleResize = () => {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      setPositions((prev) => {
        const next: Record<string, IconPosition> = {};
        let changed = false;

        for (const [id, pos] of Object.entries(prev)) {
          const clamped = snapAndClampPosition(pos.x, pos.y, screenW, screenH);
          if (clamped.x !== pos.x || clamped.y !== pos.y) {
            changed = true;
          }
          next[id] = clamped;
        }

        return changed ? next : prev;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const selectIcon = useCallback((id: string | null) => {
    setSelectedIconId(id);
  }, []);

  const setDraggingIcon = useCallback((id: string | null) => {
    setActiveDraggingId(id);
  }, []);

  const updateIconPosition = useCallback((id: string, rawPosition: IconPosition) => {
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 768;

    const snapped = snapAndClampPosition(rawPosition.x, rawPosition.y, screenW, screenH);

    setPositions((prev) => {
      const resolved = resolveCollisions(id, snapped, prev, screenW, screenH);
      return {
        ...prev,
        [id]: resolved,
      };
    });
  }, []);

  const resetToDefault = useCallback(() => {
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 768;
    const defaults = calculateDefaultPositions(screenW, screenH);
    setPositions(defaults);
    try {
      localStorage.setItem(DESKTOP_STORAGE_KEY, JSON.stringify(defaults));
    } catch {
      // Ignore
    }
  }, []);

  return {
    positions,
    selectedIconId,
    activeDraggingId,
    selectIcon,
    updateIconPosition,
    setDraggingIcon,
    resetToDefault,
  };
}
