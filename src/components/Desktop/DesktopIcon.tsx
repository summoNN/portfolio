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
const DOUBLE_CLICK_DELAY = 350; // Milliseconds for double click detection

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
  const lastClickTimeRef = useRef(0);

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
        // Not dragged: distinguish single click vs double click
        setIsDragging(false);
        const now = Date.now();
        if (now - lastClickTimeRef.current < DOUBLE_CLICK_DELAY) {
          // Double click -> open application
          lastClickTimeRef.current = 0;
          onOpen?.();
        } else {
          // Single click -> select icon
          lastClickTimeRef.current = now;
          onSelect?.();
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  // Static mode (for responsive fallback grid)
  const handleStaticClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();
    if (now - lastClickTimeRef.current < DOUBLE_CLICK_DELAY) {
      lastClickTimeRef.current = 0;
      onOpen?.();
    } else {
      lastClickTimeRef.current = now;
      onSelect?.();
    }
  };

  const iconContent = (
    <div
      className="flex flex-col items-center gap-1.5 cursor-pointer select-none group w-24 sm:w-28 touch-none"
      onClick={isStatic ? handleStaticClick : undefined}
    >
      {/* Floating Card / Preview container with subtle monochrome glass aesthetic */}
      <div
        className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-200 ${
          isSelected
            ? 'ring-1 ring-white/50 shadow-[0_0_22px_rgba(255,255,255,0.22),0_10px_25px_rgba(0,0,0,0.7)] bg-white/20'
            : 'bg-black/40 hover:bg-white/10 glass-card shadow-lg hover:shadow-2xl border border-white/5'
        }`}
      >
        {previewImage ? (
          <img
            src={previewImage}
            alt={app.label}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center transition-colors"
            style={{
              background: isSelected
                ? 'radial-gradient(circle at center, rgba(255,255,255,0.22) 0%, rgba(20,20,20,0.7) 100%)'
                : `radial-gradient(circle at center, ${app.color}33 0%, rgba(0,0,0,0.6) 100%)`,
            }}
          >
            <Icon
              size={24}
              strokeWidth={1.8}
              className={`transition-all ${
                isSelected
                  ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                  : 'text-white/80 group-hover:text-white'
              }`}
            />
          </div>
        )}

        {/* Subtle glass reflection highlight */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
      </div>

      {/* Label or Active Badge */}
      {isSelected && badgeLabel ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -2 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-white text-[11px] font-semibold tracking-tight shadow-md flex items-center gap-1"
        >
          <span>{badgeLabel}</span>
        </motion.div>
      ) : (
        <span
          className={`text-[11px] sm:text-[12px] font-medium tracking-tight text-center leading-tight transition-all drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${
            isSelected
              ? 'text-white bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/25 shadow-sm'
              : 'text-white/80 group-hover:text-white'
          }`}
        >
          {app.label}
        </span>
      )}
    </div>
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
