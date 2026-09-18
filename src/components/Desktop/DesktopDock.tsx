import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apps } from '../../data/apps';
import type { WindowState } from '../../hooks/useWindowManager';

interface DesktopDockProps {
  windows: WindowState[];
  activeWindowId?: string | null;
  onAppClick: (appId: string) => void;
}

const DOCK_APP_IDS = ['github', 'linkedin', 'contact'];

export function DesktopDock({
  windows,
  activeWindowId,
  onAppClick,
}: DesktopDockProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Strictly only show Github, Linkedin, and Contact in the dock
  const dockApps = apps.filter((app) => DOCK_APP_IDS.includes(app.id));

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-[900] pointer-events-none select-none">
      <motion.nav
        className="pointer-events-auto flex items-end gap-2 px-3.5 py-2.5 rounded-2xl glass-panel shadow-2xl border border-white/10 backdrop-blur-2xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.2 }}
        onMouseLeave={() => setHoveredId(null)}
        role="toolbar"
        aria-label="Application Dock"
      >
        {dockApps.map((app) => {
          const appWindow = windows.find((w) => w.appId === app.id);
          const isOpen = Boolean(appWindow);
          const isMinimized = appWindow?.isMinimized ?? false;
          const isActive = Boolean(appWindow && !isMinimized && appWindow.id === activeWindowId);
          const isHovered = hoveredId === app.id;
          const Icon = app.icon;

          return (
            <div key={app.id} className="relative flex flex-col items-center">
              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                    animate={{ opacity: 1, y: -8, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -top-7 px-2.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-medium text-white border border-white/10 whitespace-nowrap pointer-events-none shadow-lg"
                  >
                    {app.label}
                    {isMinimized && ' (Minimized)'}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dock Icon Button */}
              <motion.button
                onClick={() => onAppClick(app.id)}
                onMouseEnter={() => setHoveredId(app.id)}
                className="relative rounded-xl flex items-center justify-center p-2.5 cursor-pointer outline-none border-none transition-shadow"
                style={{
                  width: 48,
                  height: 48,
                  background: `linear-gradient(135deg, ${app.color} 0%, rgba(20,20,22,0.9) 100%)`,
                  boxShadow: isActive
                    ? '0 0 14px rgba(255,255,255,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                    : '0 4px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
                }}
                whileHover={{
                  scale: 1.25,
                  y: -6,
                  transition: { type: 'spring', stiffness: 400, damping: 20 },
                }}
                whileTap={{ scale: 0.95 }}
                aria-label={app.label}
              >
                <Icon size={23} strokeWidth={1.8} className="text-white/90" />

                {/* Subtle top reflection */}
                <div className="absolute top-0 left-1 right-1 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-lg pointer-events-none" />
              </motion.button>

              {/* Running App Dot Indicator */}
              <div className="h-1.5 flex items-center justify-center mt-1">
                {isOpen ? (
                  <div
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] scale-110'
                        : 'bg-white/40'
                    }`}
                  />
                ) : (
                  <div className="w-1.5 h-1.5" />
                )}
              </div>
            </div>
          );
        })}
      </motion.nav>
    </div>
  );
}
