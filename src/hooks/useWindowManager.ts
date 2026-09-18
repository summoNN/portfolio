import { useState, useCallback, useEffect } from 'react';

export interface WindowState {
  id: string;
  appId: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  previousPosition: { x: number; y: number };
  previousSize: { width: number; height: number };
}

interface UseWindowManagerReturn {
  windows: WindowState[];
  activeWindowId: string | null;
  openWindow: (appId: string) => void;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  closeActiveWindow: () => void;
  toggleAppWindow: (appId: string) => void;
  updateWindowPosition: (windowId: string, position: { x: number; y: number }) => void;
  updateWindowBounds: (
    windowId: string,
    bounds: { position?: { x: number; y: number }; size?: { width: number; height: number } }
  ) => void;
}

const DEFAULT_WIDTH = 680;
const DEFAULT_HEIGHT = 540;
const CASCADE_OFFSET = 30;
const TOP_OFFSET = 38; // below top system bar (32px)
const DOCK_BOTTOM_MARGIN = 90; // above dock

function calculateInitialBounds(windowIndex: number): {
  position: { x: number; y: number };
  size: { width: number; height: number };
} {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const isTablet = typeof window !== 'undefined' && window.innerWidth < 1024;

  const screenW = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const screenH = typeof window !== 'undefined' ? window.innerHeight : 768;

  if (isMobile) {
    const width = Math.max(300, screenW - 24);
    const height = Math.max(360, screenH - TOP_OFFSET - 90);
    return {
      position: { x: 12, y: TOP_OFFSET },
      size: { width, height },
    };
  }

  const width = Math.min(DEFAULT_WIDTH, isTablet ? screenW - 60 : DEFAULT_WIDTH);
  const height = Math.min(DEFAULT_HEIGHT, screenH - TOP_OFFSET - DOCK_BOTTOM_MARGIN);

  // Stagger / cascade newly opened windows so they do not perfectly overlap
  const stagger = (windowIndex % 6) * CASCADE_OFFSET;
  const baseX = Math.max(20, Math.floor((screenW - width) / 2));
  const baseY = Math.max(TOP_OFFSET, Math.floor((screenH - height - 40) / 2));

  const x = Math.min(baseX + stagger, screenW - width - 20);
  const y = Math.min(baseY + stagger, screenH - height - DOCK_BOTTOM_MARGIN);

  return {
    position: { x, y },
    size: { width, height },
  };
}

const BASE_WINDOW_Z_INDEX = 50;

export function useWindowManager(): UseWindowManagerReturn {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [highestZIndex, setHighestZIndex] = useState(BASE_WINDOW_Z_INDEX);

  const focusWindow = useCallback((windowId: string) => {
    setWindows((prev) => {
      const target = prev.find((w) => w.id === windowId);
      if (!target) return prev;

      const nextZ = highestZIndex + 1;
      setHighestZIndex(nextZ);
      setActiveWindowId(windowId);

      return prev.map((w) =>
        w.id === windowId
          ? { ...w, zIndex: nextZ, isMinimized: false }
          : w
      );
    });
  }, [highestZIndex]);

  const openWindow = useCallback((appId: string) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.appId === appId);

      // If already open
      if (existing) {
        const nextZ = highestZIndex + 1;
        setHighestZIndex(nextZ);
        setActiveWindowId(existing.id);

        return prev.map((w) =>
          w.id === existing.id
            ? { ...w, zIndex: nextZ, isMinimized: false }
            : w
        );
      }

      // If not already open, create a new window with staggered position
      const initial = calculateInitialBounds(prev.length);
      const nextZ = highestZIndex + 1;
      setHighestZIndex(nextZ);

      const newWindow: WindowState = {
        id: `win-${appId}-${Date.now()}`,
        appId,
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZ,
        position: initial.position,
        size: initial.size,
        previousPosition: initial.position,
        previousSize: initial.size,
      };

      setActiveWindowId(newWindow.id);
      return [...prev, newWindow];
    });
  }, [highestZIndex]);

  const closeWindow = useCallback((windowId: string) => {
    setWindows((prev) => {
      const remaining = prev.filter((w) => w.id !== windowId);
      if (remaining.length === 0) {
        setHighestZIndex(BASE_WINDOW_Z_INDEX);
      }

      // If closed window was active, focus the highest z-index remaining unminimized window
      setActiveWindowId((currentActive) => {
        if (currentActive !== windowId) return currentActive;

        const visibleRemaining = remaining
          .filter((w) => !w.isMinimized)
          .sort((a, b) => b.zIndex - a.zIndex);

        return visibleRemaining.length > 0 ? visibleRemaining[0].id : null;
      });

      return remaining;
    });
  }, []);

  const minimizeWindow = useCallback((windowId: string) => {
    setWindows((prev) => {
      const target = prev.find((w) => w.id === windowId);
      if (!target) return prev;

      // Select next active window if active one was minimized
      setActiveWindowId((currentActive) => {
        if (currentActive !== windowId) return currentActive;

        const otherVisible = prev
          .filter((w) => w.id !== windowId && !w.isMinimized)
          .sort((a, b) => b.zIndex - a.zIndex);

        return otherVisible.length > 0 ? otherVisible[0].id : null;
      });

      return prev.map((w) =>
        w.id === windowId ? { ...w, isMinimized: true } : w
      );
    });
  }, []);

  const maximizeWindow = useCallback((windowId: string) => {
    setWindows((prev) => {
      const target = prev.find((w) => w.id === windowId);
      if (!target) return prev;

      const screenW = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const screenH = typeof window !== 'undefined' ? window.innerHeight : 768;

      const nextZ = highestZIndex + 1;
      setHighestZIndex(nextZ);
      setActiveWindowId(windowId);

      if (target.isMaximized) {
        // Restore to previous bounds
        return prev.map((w) =>
          w.id === windowId
            ? {
                ...w,
                isMaximized: false,
                position: w.previousPosition,
                size: w.previousSize,
                zIndex: nextZ,
              }
            : w
        );
      } else {
        // Maximize within desktop viewport boundaries (below TopBar, above Dock)
        const maximizedPos = { x: 12, y: TOP_OFFSET };
        const maximizedSize = {
          width: Math.max(300, screenW - 24),
          height: Math.max(360, screenH - TOP_OFFSET - DOCK_BOTTOM_MARGIN),
        };

        return prev.map((w) =>
          w.id === windowId
            ? {
                ...w,
                isMaximized: true,
                previousPosition: w.position,
                previousSize: w.size,
                position: maximizedPos,
                size: maximizedSize,
                zIndex: nextZ,
              }
            : w
        );
      }
    });
  }, [highestZIndex]);

  const closeActiveWindow = useCallback(() => {
    if (activeWindowId) {
      closeWindow(activeWindowId);
    }
  }, [activeWindowId, closeWindow]);

  // ESC key closes only the currently active window
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeActiveWindow();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeActiveWindow]);

  const toggleAppWindow = useCallback((appId: string) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.appId === appId);

      // 1. CLOSED: Launch application
      if (!existing) {
        const initial = calculateInitialBounds(prev.length);
        const nextZ = highestZIndex + 1;
        setHighestZIndex(nextZ);
        const newWindow: WindowState = {
          id: `win-${appId}-${Date.now()}`,
          appId,
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZ,
          position: initial.position,
          size: initial.size,
          previousPosition: initial.position,
          previousSize: initial.size,
        };
        setActiveWindowId(newWindow.id);
        return [...prev, newWindow];
      }

      // 2. ACTIVE: Minimize application
      if (activeWindowId === existing.id && !existing.isMinimized) {
        const otherVisible = prev
          .filter((w) => w.id !== existing.id && !w.isMinimized)
          .sort((a, b) => b.zIndex - a.zIndex);

        setActiveWindowId(otherVisible.length > 0 ? otherVisible[0].id : null);
        return prev.map((w) =>
          w.id === existing.id ? { ...w, isMinimized: true } : w
        );
      }

      // 3. MINIMIZED: Restore and focus
      // 4. OPEN BUT INACTIVE: Focus
      const nextZ = highestZIndex + 1;
      setHighestZIndex(nextZ);
      setActiveWindowId(existing.id);

      return prev.map((w) =>
        w.id === existing.id
          ? { ...w, zIndex: nextZ, isMinimized: false }
          : w
      );
    });
  }, [highestZIndex, activeWindowId]);

  const updateWindowPosition = useCallback((windowId: string, position: { x: number; y: number }) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, position } : w))
    );
  }, []);

  const updateWindowBounds = useCallback((
    windowId: string,
    bounds: { position?: { x: number; y: number }; size?: { width: number; height: number } }
  ) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId
          ? {
              ...w,
              position: bounds.position ?? w.position,
              size: bounds.size ?? w.size,
            }
          : w
      )
    );
  }, []);

  return {
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    closeActiveWindow,
    toggleAppWindow,
    updateWindowPosition,
    updateWindowBounds,
  };
}
