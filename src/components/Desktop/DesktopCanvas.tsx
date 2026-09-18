import { apps } from '../../data/apps';
import { config } from '../../data/config';
import { DESKTOP_ICON_CONFIGS } from '../../data/desktopIcons';
import { useDesktopIcons } from '../../hooks/useDesktopIcons';
import { DesktopIcon } from './DesktopIcon';

interface DesktopCanvasProps {
  onOpenApp: (appId: string) => void;
  selectedAppId?: string | null;
  onSelectApp?: (appId: string | null) => void;
}

const BADGE_MAP: Record<string, string> = Object.fromEntries(
  DESKTOP_ICON_CONFIGS.map((c) => [c.id, c.badge ?? ''])
);

export function DesktopCanvas({
  onOpenApp,
  selectedAppId: externalSelectedAppId,
  onSelectApp: externalOnSelectApp,
}: DesktopCanvasProps) {
  const {
    positions,
    selectedIconId,
    activeDraggingId,
    selectIcon,
    updateIconPosition,
    setDraggingIcon,
  } = useDesktopIcons();

  // Unified selection (local manager + optional external prop)
  const currentSelectedId = externalSelectedAppId ?? selectedIconId;

  const handleSelect = (appId: string | null) => {
    selectIcon(appId);
    externalOnSelectApp?.(appId);
  };

  // Primary portfolio apps to display on desktop canvas
  const desktopApps = apps.filter((app) =>
    ['about', 'experience', 'projects', 'skills', 'resume'].includes(app.id)
  );

  return (
    <div
      className="relative z-0 isolate w-full h-full overflow-hidden select-none"
      onPointerDown={(e) => {
        // Deselect all icons when clicking directly on the empty desktop background
        if (e.target === e.currentTarget) {
          handleSelect(null);
        }
      }}
    >
      {/* Fullscreen transparent drag overlay when dragging to lock cursor and isolate events */}
      {activeDraggingId && (
        <div
          className="fixed inset-0 select-none z-20 cursor-grabbing"
          onPointerMove={(e) => e.preventDefault()}
        />
      )}

      {/* Wallpaper Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100"
        style={{ backgroundImage: `url(${config.wallpaper})` }}
        onClick={() => handleSelect(null)}
      >
        {/* Soft atmospheric gradient overlays matching the reference */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/70 pointer-events-none" />
      </div>

      {/* Spatial Draggable Desktop Icons for Desktop & Tablet Screens */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        {desktopApps.map((app) => {
          const pos = positions[app.id];
          if (!pos) return null;

          const isSelected = currentSelectedId === app.id;
          const badge = BADGE_MAP[app.id];

          return (
            <DesktopIcon
              key={app.id}
              app={app}
              position={pos}
              isSelected={isSelected}
              isDraggingAny={activeDraggingId !== null}
              badgeLabel={badge}
              onSelect={() => handleSelect(app.id)}
              onOpen={() => onOpenApp(app.id)}
              onDragStart={() => {
                handleSelect(app.id);
                setDraggingIcon(app.id);
              }}
              onDragEnd={(finalPos) => {
                updateIconPosition(app.id, finalPos);
                setDraggingIcon(null);
              }}
            />
          );
        })}
      </div>

      {/* Responsive Grid for Smaller Mobile Screens */}
      <div
        className="md:hidden absolute inset-0 pt-14 pb-24 px-6 overflow-y-auto app-scroll flex flex-col items-center justify-center pointer-events-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleSelect(null);
          }
        }}
      >
        <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto justify-items-center">
          {desktopApps.map((app) => {
            const isSelected = currentSelectedId === app.id;
            const badge = BADGE_MAP[app.id];

            return (
              <DesktopIcon
                key={app.id}
                app={app}
                isStatic
                isSelected={isSelected}
                badgeLabel={badge}
                onSelect={() => handleSelect(app.id)}
                onOpen={() => onOpenApp(app.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
