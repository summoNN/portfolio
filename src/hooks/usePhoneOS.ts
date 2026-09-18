import { useState, useCallback } from 'react';

interface PhoneOSState {
  currentApp: string | null;
  openingIconRect: DOMRect | null;
}

export function usePhoneOS() {
  const [state, setState] = useState<PhoneOSState>({
    currentApp: null,
    openingIconRect: null,
  });

  const openApp = useCallback((appId: string, iconRect?: DOMRect) => {
    setState({
      currentApp: appId,
      openingIconRect: iconRect ?? null,
    });
  }, []);

  const goHome = useCallback(() => {
    setState({
      currentApp: null,
      openingIconRect: null,
    });
  }, []);

  return {
    currentApp: state.currentApp,
    openingIconRect: state.openingIconRect,
    openApp,
    goHome,
  };
}
