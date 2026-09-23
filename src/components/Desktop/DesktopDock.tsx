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
        className="pointer-events-auto relative flex items-end gap-3 px-4 py-3 rounded-[22px] liquid-glass-dock"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.2 }}
        onMouseLeave={() => setHoveredId(null)}
        role="toolbar"
        aria-label="Application Dock"
      >
        {/* Inner top highlight strip */}
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none rounded-t-[22px]"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.50) 30%, rgba(255,255,255,0.50) 70%, transparent 100%)',
          }}
        />

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
                className="relative rounded-[16px] flex items-center justify-center cursor-pointer outline-none border-none liquid-glass-dock-icon overflow-hidden"
                style={{
                  width: 52,
                  height: 52,
                }}
                whileHover={{
                  scale: 1.30,
                  y: -8,
                  transition: { type: 'spring', stiffness: 400, damping: 18 },
                }}
                whileTap={{ scale: 0.94 }}
                aria-label={app.label}
              >
                {/* Per-app color tint */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 45% 40%, ${app.color}30 0%, transparent 65%)`,
                  }}
                />

                {/* Active state glow ring */}
                {isActive && (
                  <div
                    className="absolute inset-0 rounded-[16px] pointer-events-none"
                    style={{
                      boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.55), 0 0 16px rgba(255,255,255,0.22)',
                    }}
                  />
                )}

                <Icon size={24} strokeWidth={1.7} className="relative z-10 text-white/92" />

                {/* Top specular reflection */}
                <div
                  className="absolute inset-x-0 top-0 pointer-events-none"
                  style={{
                    height: '45%',
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.08) 55%, transparent 100%)',
                    borderRadius: '16px 16px 40% 40%',
                  }}
                />
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
