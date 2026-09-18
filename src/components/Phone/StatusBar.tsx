import { useEffect, useState } from 'react';
import { Battery, Signal, Wifi } from 'lucide-react';

export function StatusBar() {
  const [time, setTime] = useState(getTime());

  useEffect(() => {
    const interval = setInterval(() => setTime(getTime()), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 z-40 pointer-events-none select-none"
      style={{ height: 54 }}
    >
      {/* Left: Time */}
      <span className="text-[15px] font-semibold tracking-tight text-white">
        {time}
      </span>

      {/* Right: Status icons */}
      <div className="flex items-center gap-[6px]">
        <Signal size={16} strokeWidth={2} className="text-white" />
        <Wifi size={16} strokeWidth={2} className="text-white" />
        <Battery size={18} strokeWidth={2} className="text-white" />
      </div>
    </div>
  );
}

function getTime(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}
