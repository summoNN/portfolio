import { motion } from 'framer-motion';
import type { AppDefinition } from '../../data/apps';

interface AppIconProps {
  app: AppDefinition;
  onOpen: (appId: string, rect?: DOMRect) => void;
  isDragging?: boolean;
  style?: React.CSSProperties;
  listeners?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
  setNodeRef?: (node: HTMLElement | null) => void;
}

export function AppIcon({
  app,
  onOpen,
  isDragging = false,
  style,
  listeners,
  attributes,
  setNodeRef,
}: AppIconProps) {
  const Icon = app.icon;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    onOpen(app.id, rect);
  };

  return (
    <motion.button
      ref={setNodeRef}
      className="flex flex-col items-center gap-[6px] cursor-pointer border-none outline-none bg-transparent select-none"
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none',
        WebkitTouchCallout: 'none',
      }}
      onClick={handleClick}
      whileTap={{ scale: 0.85 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      aria-label={`Open ${app.label}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(app.id);
        }
      }}
      {...(listeners ?? {})}
      {...(attributes ?? {})}
    >
      {/* Icon container */}
      <div
        className="rounded-[14px] flex items-center justify-center icon-shadow"
        style={{
          width: 60,
          height: 60,
          background: `linear-gradient(145deg, ${app.color}, ${adjustColor(app.color, -20)})`,
        }}
      >
        <Icon size={28} strokeWidth={1.7} className="text-white/90" />
      </div>
      {/* Label */}
      <span className="text-[11px] font-medium text-white text-shadow-sm leading-tight text-center max-w-[72px] truncate">
        {app.label}
      </span>
    </motion.button>
  );
}

/** Darken a hex color by a given amount */
function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
