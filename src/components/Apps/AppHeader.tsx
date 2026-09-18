import React from 'react';
import { X, Minus, Maximize2 } from 'lucide-react';
import { useWindowContext } from '../../context/WindowContext';

interface AppHeaderProps {
  title: string;
  onBack: () => void;
  rightAction?: React.ReactNode;
  onStartDrag?: (e: React.PointerEvent) => void;
}

export function AppHeader({
  title,
  onBack,
  rightAction,
  onStartDrag,
}: AppHeaderProps) {
  const windowContext = useWindowContext();
  const isActive = windowContext ? windowContext.isActive : true;
  const isMaximized = windowContext ? windowContext.window.isMaximized : false;

  const handlePointerDown = (e: React.PointerEvent) => {
    // Bring window to front on click/drag
    windowContext?.focus();

    // Start dragging if not maximized
    if (!isMaximized && onStartDrag) {
      onStartDrag(e);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (windowContext) {
      windowContext.close();
    } else {
      onBack();
    }
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (windowContext) {
      windowContext.minimize();
    } else {
      onBack();
    }
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (windowContext) {
      windowContext.maximize();
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      style={{ touchAction: 'none' }}
      className={`flex items-center justify-between px-4 h-10 select-none flex-shrink-0 transition-colors border-b ${
        isMaximized ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
      } ${
        isActive
          ? 'glass-panel border-white/15 bg-white/[0.04]'
          : 'bg-black/60 border-white/5'
      }`}
    >
      {/* Desktop Window Controls (Traffic Lights) - Stop propagation so button clicks don't drag */}
      <div
        className={`flex items-center gap-2 group/dots transition-opacity ${
          isActive ? 'opacity-100' : 'opacity-50 hover:opacity-90'
        }`}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] flex items-center justify-center cursor-pointer outline-none transition-transform hover:scale-110 active:scale-95"
          title="Close Window"
          aria-label="Close Window"
        >
          <X
            size={8}
            className="text-black/70 opacity-0 group-hover/dots:opacity-100 transition-opacity"
          />
        </button>
        <button
          onClick={handleMinimize}
          className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] flex items-center justify-center cursor-pointer outline-none transition-transform hover:scale-110 active:scale-95"
          title="Minimize"
          aria-label="Minimize"
        >
          <Minus
            size={8}
            className="text-black/70 opacity-0 group-hover/dots:opacity-100 transition-opacity"
          />
        </button>
        <button
          onClick={handleMaximize}
          className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] flex items-center justify-center cursor-pointer outline-none transition-transform hover:scale-110 active:scale-95"
          title={isMaximized ? 'Restore' : 'Maximize'}
          aria-label={isMaximized ? 'Restore' : 'Maximize'}
        >
          <Maximize2
            size={7}
            className="text-black/70 opacity-0 group-hover/dots:opacity-100 transition-opacity"
          />
        </button>
      </div>

      {/* Window Title (pointer-events-none so click/drag passes through to header) */}
      <span
        className={`text-[13px] font-semibold tracking-tight pointer-events-none transition-colors ${
          isActive ? 'text-white/90' : 'text-white/50'
        }`}
      >
        {title}
      </span>

      {/* Right Action (Stop propagation so action buttons remain directly clickable) */}
      <div
        className="min-w-[60px] flex justify-end"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {rightAction}
      </div>
    </div>
  );
}
