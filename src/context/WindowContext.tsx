import React, { createContext, useContext } from 'react';
import type { WindowState } from '../hooks/useWindowManager';

export interface WindowContextValue {
  window: WindowState;
  isActive: boolean;
  focus: () => void;
  close: () => void;
  minimize: () => void;
  maximize: () => void;
  updatePosition: (position: { x: number; y: number }) => void;
  updateBounds: (bounds: { position?: { x: number; y: number }; size?: { width: number; height: number } }) => void;
}

const WindowContext = createContext<WindowContextValue | null>(null);

export function WindowContextProvider({
  value,
  children,
}: {
  value: WindowContextValue;
  children: React.ReactNode;
}) {
  return (
    <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
  );
}

export function useWindowContext(): WindowContextValue | null {
  return useContext(WindowContext);
}
