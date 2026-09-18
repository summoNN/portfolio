import { motion } from 'framer-motion';

interface HomeIndicatorProps {
  onGoHome: () => void;
}

export function HomeIndicator({ onGoHome }: HomeIndicatorProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center z-50">
      <motion.button
        className="mb-[8px] rounded-[3px] bg-white/40 cursor-pointer border-none outline-none"
        style={{ width: 134, height: 5 }}
        onClick={onGoHome}
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
        whileTap={{ backgroundColor: 'rgba(255,255,255,0.8)', scaleX: 1.05 }}
        aria-label="Go to home screen"
        role="button"
        tabIndex={0}
      />
    </div>
  );
}
