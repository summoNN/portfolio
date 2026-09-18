import { motion } from 'framer-motion';

export function DynamicIsland() {
  return (
    <div className="absolute top-0 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <motion.div
        className="mt-[11px] rounded-[20px] bg-black"
        style={{ width: 126, height: 37 }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Camera dot */}
        <div
          className="absolute right-[18px] top-1/2 -translate-y-1/2 w-[12px] h-[12px] rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #1a1a2e 0%, #0a0a0a 70%)',
            boxShadow: 'inset 0 0 2px rgba(255,255,255,0.05), 0 0 1px rgba(0,0,0,0.5)',
          }}
        />
      </motion.div>
    </div>
  );
}
