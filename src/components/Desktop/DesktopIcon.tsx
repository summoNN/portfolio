import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { AppDefinition } from '../../data/apps';
import {
  type IconPosition,
  getUsableBounds,
  ICON_WIDTH,
} from '../../data/desktopIcons';

interface DesktopIconProps {
  app: AppDefinition;
  position?: IconPosition;
  isSelected?: boolean;
  isDraggingAny?: boolean;
  onSelect?: () => void;
  onOpen?: () => void;
  onDragStart?: () => void;
  onDragEnd?: (finalPos: IconPosition) => void;
  badgeLabel?: string;
  previewImage?: string;
  isStatic?: boolean; // For mobile responsive grid fallback
}

const DRAG_THRESHOLD = 5; // Pixels of movement before initiating drag


export function DesktopIcon({
  app,
  position,
  isSelected = false,
  isDraggingAny = false,
  onSelect,
  onOpen,
  onDragStart,
  onDragEnd,
  badgeLabel,
  previewImage,
  isStatic = false,
}: DesktopIconProps) {
  const Icon = app.icon;

  const [livePos, setLivePos] = useState<IconPosition | null>(position ?? null);
  const [isDragging, setIsDragging] = useState(false);

  const startPointerRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });
  const latestPosRef = useRef<IconPosition>({ x: 0, y: 0 });
  const isPointerDownRef = useRef(false);
  const hasExceededThresholdRef = useRef(false);


  // Synchronize with external position changes when not dragging
  useEffect(() => {
    if (position && !isDragging) {
      setLivePos(position);
      latestPosRef.current = position;
    }
  }, [position, isDragging]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only primary mouse button or touch
    if (e.button !== 0 || isStatic) return;

    // Prevent text selection or image ghosting
    e.preventDefault();
    e.stopPropagation();

    isPointerDownRef.current = true;
    hasExceededThresholdRef.current = false;
    startPointerRef.current = { x: e.clientX, y: e.clientY };

    const currentX = livePos?.x ?? position?.x ?? 0;
    const currentY = livePos?.y ?? position?.y ?? 0;
    startPosRef.current = { x: currentX, y: currentY };
    latestPosRef.current = { x: currentX, y: currentY };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!isPointerDownRef.current) return;

      const dx = moveEvent.clientX - startPointerRef.current.x;
      const dy = moveEvent.clientY - startPointerRef.current.y;

      if (!hasExceededThresholdRef.current) {
        if (Math.hypot(dx, dy) >= DRAG_THRESHOLD) {
          hasExceededThresholdRef.current = true;
          setIsDragging(true);
          onDragStart?.();
        }
      }

      if (hasExceededThresholdRef.current) {
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const { minX, maxX, minY, maxY } = getUsableBounds(screenW, screenH);

        const rawX = startPosRef.current.x + dx;
        const rawY = startPosRef.current.y + dy;

        const clampedX = Math.min(Math.max(minX, rawX), maxX);
        const clampedY = Math.min(Math.max(minY, rawY), maxY);

        const updatedPos = { x: Math.round(clampedX), y: Math.round(clampedY) };
        latestPosRef.current = updatedPos;
        setLivePos(updatedPos);
      }
    };

    const handlePointerUp = () => {
      isPointerDownRef.current = false;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);

      if (hasExceededThresholdRef.current) {
        // Finished dragging: snap and persist
        setIsDragging(false);
        onDragEnd?.(latestPosRef.current);
      } else {
        // Not dragged: single click -> open application
        setIsDragging(false);
        onOpen?.();
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  // Static mode (for responsive fallback grid)
  const handleStaticClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen?.();
  };

  const iconContent = (
    <motion.div
      className="flex flex-col items-center gap-2 cursor-pointer select-none touch-none"
      style={{ width: 88 }}
      onClick={isStatic ? handleStaticClick : undefined}
      whileHover={
        !isDragging
          ? { scale: 1.08, y: -4, transition: { type: 'spring', stiffness: 420, damping: 22 } }
          : undefined
      }
      whileTap={!isDragging ? { scale: 0.96 } : undefined}
    >
      {/* ── Liquid Glass Icon Body ── */}
      <div
        className={`relative flex items-center justify-center overflow-hidden transition-all duration-200 ${
          isSelected ? 'liquid-glass-icon-selected' : 'liquid-glass-icon'
        }`}
        style={{
          width: 72,
          height: 72,
          borderRadius: 18,
        }}
      >
        {/* App-color tint layer — subtle colored wash behind glass */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 40% 35%, ${app.color}2e 0%, transparent 70%)`,
          }}
        />

        {/* Main icon — centered Lucide SVG */}
        {previewImage ? (
          <img
            src={previewImage}
            alt={app.label}
            className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity pointer-events-none"
          />
        ) : (
          <Icon
            size={30}
            strokeWidth={1.6}
            className={`relative z-10 transition-all duration-200 ${
              isSelected
                ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.75)]'
                : 'text-white/85'
            }`}
          />
        )}

        {/* Top specular highlight — primary reflection strip */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: '48%',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.10) 55%, transparent 100%)',
            borderRadius: '18px 18px 40% 40%',
          }}
        />

        {/* Left rim light */}
        <div
          className="absolute inset-y-0 left-0 w-px pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.06) 60%, transparent 100%)',
          }}
        />

        {/* Bottom inner shadow — depth */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: '30%',
            background:
              'linear-gradient(0deg, rgba(0,0,0,0.18) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* ── Label / Badge ── */}
      {isSelected && badgeLabel ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: -3 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="px-2.5 py-0.5 rounded-full border text-[11px] font-semibold tracking-tight shadow-md flex items-center gap-1 pointer-events-none"
          style={{
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderColor: 'rgba(255,255,255,0.30)',
            color: 'rgba(255,255,255,0.95)',
            textShadow: '0 1px 3px rgba(0,0,0,0.6)',
          }}
        >
          <span>{badgeLabel}</span>
        </motion.div>
      ) : (
        <span
          className="text-[11px] font-medium tracking-tight text-center leading-tight pointer-events-none"
          style={{
            color: isSelected ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.80)',
            textShadow: '0 1px 4px rgba(0,0,0,0.75)',
          }}
        >
          {app.label}
        </span>
      )}
    </motion.div>
  );


  // If in static mode (mobile grid)
  if (isStatic || !position) {
    return iconContent;
  }

  const currentX = livePos?.x ?? position.x;
  const currentY = livePos?.y ?? position.y;

  return (
    <div
      onPointerDown={handlePointerDown}
      style={{
        position: 'absolute',
        left: `${currentX}px`,
        top: `${currentY}px`,
        width: `${ICON_WIDTH}px`,
        zIndex: isDragging ? 20 : isSelected ? 10 : 1,
        transition: isDragging
          ? 'none'
          : 'left 0.24s cubic-bezier(0.16, 1, 0.3, 1), top 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: isDragging ? 'grabbing' : 'pointer',
      }}
      className={`pointer-events-auto select-none ${
        isDraggingAny && !isDragging ? 'pointer-events-none' : ''
      }`}
    >
      {iconContent}
    </div>
  );
}
