import { useState, useEffect } from 'react';
import { Wifi, Battery, Volume2, Search, Sparkles } from 'lucide-react';

interface TopBarProps {
  activeAppTitle?: string | null;
  onOpenApp?: (appId: string) => void;
}

export function TopBar({ activeAppTitle, onOpenApp }: TopBarProps) {
  const [time, setTime] = useState(formatTime());
  const [date, setDate] = useState(formatDate());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(formatTime());
      setDate(formatDate());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-8 px-4 z-[900] flex items-center justify-between text-[13px] text-white/90 glass-statusbar border-b border-white/5 select-none">
      {/* Left side: OS & Menu Items */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onOpenApp?.('about')}
          className="flex items-center gap-1.5 font-semibold text-white hover:text-white/80 transition-colors cursor-pointer outline-none"
          title="About System"
        >
          <Sparkles size={14} className="text-white/80" />
          <span>IlyasOS</span>
        </button>

        {activeAppTitle ? (
          <span className="font-semibold text-white/95">{activeAppTitle}</span>
        ) : (
          <span className="text-white/60 font-normal">Finder</span>
        )}

        {/* Desktop menu links */}
        <nav className="hidden sm:flex items-center gap-3 text-white/70">
          <button
            onClick={() => onOpenApp?.('projects')}
            className="hover:text-white transition-colors cursor-pointer outline-none"
          >
            Projects
          </button>
          <button
            onClick={() => onOpenApp?.('experience')}
            className="hover:text-white transition-colors cursor-pointer outline-none"
          >
            Experience
          </button>
          <button
            onClick={() => onOpenApp?.('contact')}
            className="hover:text-white transition-colors cursor-pointer outline-none"
          >
            Contact
          </button>
        </nav>
      </div>

      {/* Right side: Status and Time */}
      <div className="flex items-center gap-3 text-white/80">
        <div className="hidden md:flex items-center gap-2.5 text-white/60">
          <Search size={13} strokeWidth={2.2} />
          <Wifi size={14} strokeWidth={2} />
          <Volume2 size={14} strokeWidth={2} />
          <div className="flex items-center gap-1">
            <span className="text-[11px]">100%</span>
            <Battery size={15} strokeWidth={2} />
          </div>
        </div>

        <div className="flex items-center gap-2 pl-1 font-medium tracking-tight">
          <span className="hidden sm:inline text-white/60">{date}</span>
          <span className="text-white font-semibold">{time}</span>
        </div>
      </div>
    </header>
  );
}

function formatTime(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(): string {
  const now = new Date();
  return now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}
