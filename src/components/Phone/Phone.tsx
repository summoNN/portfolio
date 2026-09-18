import { type ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PHONE } from '../../utils/constants';
import { PhoneScreen } from './PhoneScreen';
import { DynamicIsland } from './DynamicIsland';
import { StatusBar } from './StatusBar';
import { HomeIndicator } from './HomeIndicator';

interface PhoneProps {
  children: ReactNode;
  onGoHome: () => void;
}

export function Phone({ children, onGoHome }: PhoneProps) {
  // ESC to go home
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onGoHome();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onGoHome]);

  return (
    <div className="flex items-center justify-center w-full h-full p-4">
      <motion.div
        className="relative flex-shrink-0"
        style={{
          width: PHONE.width,
          height: PHONE.height,
          maxHeight: '95vh',
          maxWidth: '95vw',
          aspectRatio: `${PHONE.width} / ${PHONE.height}`,
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.1 }}
      >
        {/* Phone outer frame */}
        <div
          className="absolute inset-0 phone-shadow"
          style={{
            borderRadius: PHONE.borderRadius,
            background: `linear-gradient(145deg, #3a3a3a 0%, ${PHONE.bezel}px, #1a1a1a 100%)`,
            padding: PHONE.bezel,
          }}
        >
          {/* Reflective highlight on top edge */}
          <div
            className="absolute top-0 left-[15%] right-[15%] h-[1px] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
              borderRadius: PHONE.borderRadius,
            }}
          />

          {/* Inner screen area */}
          <PhoneScreen>
            <DynamicIsland />
            <StatusBar />
            {children}
            <HomeIndicator onGoHome={onGoHome} />
          </PhoneScreen>
        </div>
      </motion.div>
    </div>
  );
}
