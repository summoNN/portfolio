import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TopBar } from './components/Desktop/TopBar';
import { DesktopCanvas } from './components/Desktop/DesktopCanvas';
import { DesktopDock } from './components/Desktop/DesktopDock';
import { WindowContextProvider } from './context/WindowContext';
import { useWindowManager } from './hooks/useWindowManager';
import { AboutApp } from './components/Apps/AboutApp';
import { ExperienceApp } from './components/Apps/ExperienceApp';
import { ProjectsApp } from './components/Apps/ProjectsApp';
import { SkillsApp } from './components/Apps/SkillsApp';
import { ResumeApp } from './components/Apps/ResumeApp';
import { GithubApp } from './components/Apps/GithubApp';
import { LinkedinApp } from './components/Apps/LinkedinApp';
import { ContactApp } from './components/Apps/ContactApp';
import { apps } from './data/apps';

const APP_COMPONENTS: Record<string, React.ComponentType<{ onBack: () => void }>> = {
  about: AboutApp,
  experience: ExperienceApp,
  projects: ProjectsApp,
  skills: SkillsApp,
  resume: ResumeApp,
  github: GithubApp,
  linkedin: LinkedinApp,
  contact: ContactApp,
};

export default function App() {
  const {
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    toggleAppWindow,
    updateWindowPosition,
    updateWindowBounds,
  } = useWindowManager();

  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const handleOpenApp = (appId: string) => {
    setSelectedAppId(appId);
    openWindow(appId);
  };

  // Find active window's app title for the top system bar
  const activeWindow = windows.find((w) => w.id === activeWindowId && !w.isMinimized);
  const activeAppLabel = activeWindow
    ? apps.find((a) => a.id === activeWindow.appId)?.label ?? null
    : null;
  void TopBar;
  void activeAppLabel;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans antialiased select-none">
      {/* { Top System Bar }
      <TopBar activeAppTitle={activeAppLabel} onOpenApp={handleOpenApp} />
    */}
      {/* Main Desktop Space & Wallpaper */}
      <DesktopCanvas
        onOpenApp={handleOpenApp}
        selectedAppId={selectedAppId}
        onSelectApp={setSelectedAppId}
      />

      {/* Floating Bottom Dock with Window State & Toggle */}
      <DesktopDock
        windows={windows}
        activeWindowId={activeWindowId}
        onAppClick={toggleAppWindow}
      />

      {/* Simultaneously Open Windows (Multi-Window Manager) */}
      <AnimatePresence>
        {windows.map((win) => {
          const Component = APP_COMPONENTS[win.appId];
          if (!Component) return null;

          return (
            <WindowContextProvider
              key={win.id}
              value={{
                window: win,
                isActive: activeWindowId === win.id,
                focus: () => focusWindow(win.id),
                close: () => closeWindow(win.id),
                minimize: () => minimizeWindow(win.id),
                maximize: () => maximizeWindow(win.id),
                updatePosition: (pos) => updateWindowPosition(win.id, pos),
                updateBounds: (bounds) => updateWindowBounds(win.id, bounds),
              }}
            >
              <Component onBack={() => closeWindow(win.id)} />
            </WindowContextProvider>
          );
        })}
      </AnimatePresence>
    </main>
  );
}
