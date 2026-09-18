import { type ReactNode, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from './AppHeader';
import { useWindowContext } from '../../context/WindowContext';

interface AppWindowProps {
  title: string;
  onBack: () => void;
  children: ReactNode;
  rightAction?: ReactNode;
  noPadding?: boolean;
}

const TOP_BAR_HEIGHT = 38;
const DOCK_AREA_HEIGHT = 90;
const PADDING = 10;
const MIN_WIDTH = 340;
const MIN_HEIGHT = 220;

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export function AppWindow({
  title,
  onBack,
  children,
  rightAction,
  noPadding,
}: AppWindowProps) {
  const windowContext = useWindowContext();

  const [localPosition, setLocalPosition] = useState({
    x: windowContext?.window.position.x ?? 100,
    y: windowContext?.window.position.y ?? 100,
  });
  const [localSize, setLocalSize] = useState({
    width: windowContext?.window.size.width ?? 680,
    height: windowContext?.window.size.height ?? 540,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [activeCursor, setActiveCursor] = useState<string | null>(null);

  const latestPositionRef = useRef(localPosition);
  const latestSizeRef = useRef(localSize);

  latestPositionRef.current = localPosition;
  latestSizeRef.current = localSize;

  const winPos = windowContext?.window.position;
  const winSize = windowContext?.window.size;
  const winMaximized = windowContext?.window.isMaximized;

  // Synchronize with window manager when not actively dragging or resizing
  useEffect(() => {
    if (winPos && winSize && !isDragging && !isResizing) {
      setLocalPosition(winPos);
      setLocalSize(winSize);
      latestPositionRef.current = winPos;
      latestSizeRef.current = winSize;
    }
  }, [
    winPos?.x,
    winPos?.y,
    winSize?.width,
    winSize?.height,
    winMaximized,
    isDragging,
    isResizing,
  ]);

  if (windowContext) {
    const { window: currentWindow, isActive, focus, close, updateBounds } = windowContext;

    if (currentWindow.isMinimized) {
      return null;
    }

    // Titlebar Dragging
    const handleDragStart = (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      focus();

      const startPointerX = e.clientX;
      const startPointerY = e.clientY;
      const startX = latestPositionRef.current.x;
      const startY = latestPositionRef.current.y;

      setIsDragging(true);
      setActiveCursor('grabbing');

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const dx = moveEvent.clientX - startPointerX;
        const dy = moveEvent.clientY - startPointerY;

        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        const currentW = latestSizeRef.current.width;
        const currentH = latestSizeRef.current.height;

        const minX = PADDING;
        const maxX = Math.max(minX, screenW - currentW - PADDING);
        const minY = TOP_BAR_HEIGHT;
        const maxY = Math.max(minY, screenH - currentH - DOCK_AREA_HEIGHT);

        const newX = Math.min(Math.max(minX, startX + dx), maxX);
        const newY = Math.min(Math.max(minY, startY + dy), maxY);

        const updatedPos = { x: Math.round(newX), y: Math.round(newY) };
        latestPositionRef.current = updatedPos;
        setLocalPosition(updatedPos);
      };

      const handlePointerUp = () => {
        setIsDragging(false);
        setActiveCursor(null);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);

        updateBounds({
          position: latestPositionRef.current,
          size: latestSizeRef.current,
        });
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    };

    // 8-Directional Resizing
    const handleResizeStart = (
      e: React.PointerEvent<HTMLDivElement>,
      direction: ResizeDirection
    ) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      focus();

      const startPointerX = e.clientX;
      const startPointerY = e.clientY;
      const startX = latestPositionRef.current.x;
      const startY = latestPositionRef.current.y;
      const startWidth = latestSizeRef.current.width;
      const startHeight = latestSizeRef.current.height;

      setIsResizing(true);
      setActiveCursor(`${direction}-resize`);

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const dx = moveEvent.clientX - startPointerX;
        const dy = moveEvent.clientY - startPointerY;

        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        let newX = startX;
        let newY = startY;
        let newW = startWidth;
        let newH = startHeight;

        // Horizontal resizing
        if (direction.includes('e')) {
          const maxW = Math.max(MIN_WIDTH, screenW - startX - PADDING);
          newW = Math.min(Math.max(MIN_WIDTH, startWidth + dx), maxW);
        } else if (direction.includes('w')) {
          const maxLeft = startX + startWidth - MIN_WIDTH;
          const minLeft = PADDING;
          newX = Math.min(Math.max(minLeft, startX + dx), maxLeft);
          newW = startX + startWidth - newX;
        }

        // Vertical resizing
        if (direction.includes('s')) {
          const maxH = Math.max(MIN_HEIGHT, screenH - startY - DOCK_AREA_HEIGHT);
          newH = Math.min(Math.max(MIN_HEIGHT, startHeight + dy), maxH);
        } else if (direction.includes('n')) {
          const maxTop = startY + startHeight - MIN_HEIGHT;
          const minTop = TOP_BAR_HEIGHT;
          newY = Math.min(Math.max(minTop, startY + dy), maxTop);
          newH = startY + startHeight - newY;
        }

        const updatedPos = { x: Math.round(newX), y: Math.round(newY) };
        const updatedSize = { width: Math.round(newW), height: Math.round(newH) };

        latestPositionRef.current = updatedPos;
        latestSizeRef.current = updatedSize;
        setLocalPosition(updatedPos);
        setLocalSize(updatedSize);
      };

      const handlePointerUp = () => {
        setIsResizing(false);
        setActiveCursor(null);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);

        updateBounds({
          position: latestPositionRef.current,
          size: latestSizeRef.current,
        });
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    };

    return (
      <>
        {/* Fullscreen transparent overlay while dragging or resizing to maintain cursor and prevent iframe/pointer glitches */}
        {activeCursor && (
          <div
            className="fixed inset-0 select-none z-[99999]"
            style={{ cursor: activeCursor }}
          />
        )}

        <motion.div
          className="fixed flex flex-col rounded-2xl pointer-events-auto select-none"
          style={{
            left: localPosition.x,
            top: localPosition.y,
            width: localSize.width,
            height: localSize.height,
            zIndex: currentWindow.zIndex,
            transition:
              isDragging || isResizing
                ? 'none'
                : 'left 0.32s cubic-bezier(0.16, 1, 0.3, 1), top 0.32s cubic-bezier(0.16, 1, 0.3, 1), width 0.32s cubic-bezier(0.16, 1, 0.3, 1), height 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          onPointerDown={() => {
            if (!isActive) focus();
          }}
        >
          {/* Inner Window Frame with rounded corners, glass border and smooth shadow */}
          <div
            className={`relative w-full h-full rounded-2xl glass-panel border overflow-hidden flex flex-col transition-all duration-200 ${
              isActive
                ? 'border-white/20 shadow-[0_25px_65px_rgba(0,0,0,0.85)]'
                : 'border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.65)]'
            }`}
          >
            <AppHeader
              title={title}
              onBack={close}
              rightAction={rightAction}
              onStartDrag={!currentWindow.isMaximized ? handleDragStart : undefined}
            />
            <div
              className={`flex-1 overflow-y-auto app-scroll ${
                noPadding ? '' : 'p-5 sm:p-6'
              } bg-black/60`}
            >
              {children}
            </div>
          </div>

          {/* 8 Resize Handles (Placed outside the overflow-hidden frame so they are never clipped) */}
          {!currentWindow.isMaximized && (
            <>
              {/* Edge Handles */}
              <div
                onPointerDown={(e) => handleResizeStart(e, 'n')}
                className="absolute -top-2 left-5 right-5 h-3.5 cursor-n-resize touch-none z-40"
                title="Resize Top"
              />
              <div
                onPointerDown={(e) => handleResizeStart(e, 's')}
                className="absolute -bottom-2 left-5 right-5 h-3.5 cursor-s-resize touch-none z-40"
                title="Resize Bottom"
              />
              <div
                onPointerDown={(e) => handleResizeStart(e, 'w')}
                className="absolute -left-2 top-5 bottom-5 w-3.5 cursor-w-resize touch-none z-40"
                title="Resize Left"
              />
              <div
                onPointerDown={(e) => handleResizeStart(e, 'e')}
                className="absolute -right-2 top-5 bottom-5 w-3.5 cursor-e-resize touch-none z-40"
                title="Resize Right"
              />

              {/* Corner Handles */}
              <div
                onPointerDown={(e) => handleResizeStart(e, 'nw')}
                className="absolute -top-2.5 -left-2.5 w-6 h-6 cursor-nw-resize touch-none z-50"
                title="Resize Top-Left"
              />
              <div
                onPointerDown={(e) => handleResizeStart(e, 'ne')}
                className="absolute -top-2.5 -right-2.5 w-6 h-6 cursor-ne-resize touch-none z-50"
                title="Resize Top-Right"
              />
              <div
                onPointerDown={(e) => handleResizeStart(e, 'sw')}
                className="absolute -bottom-2.5 -left-2.5 w-6 h-6 cursor-sw-resize touch-none z-50"
                title="Resize Bottom-Left"
              />
              <div
                onPointerDown={(e) => handleResizeStart(e, 'se')}
                className="absolute -bottom-2.5 -right-2.5 w-6 h-6 cursor-se-resize touch-none z-50"
                title="Resize Bottom-Right"
              />
            </>
          )}
        </motion.div>
      </>
    );
  }

  // Fallback if rendered outside WindowContext
  return (
    <motion.div
      className="fixed z-50 w-full max-w-xl md:max-w-2xl lg:max-w-3xl h-[580px] max-h-[84vh] rounded-2xl glass-panel border border-white/15 overflow-hidden flex flex-col shadow-2xl"
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
    >
      <AppHeader title={title} onBack={onBack} rightAction={rightAction} />
      <div
        className={`flex-1 overflow-y-auto app-scroll ${
          noPadding ? '' : 'p-5 sm:p-6'
        } bg-black/60`}
      >
        {children}
      </div>
    </motion.div>
  );
}
