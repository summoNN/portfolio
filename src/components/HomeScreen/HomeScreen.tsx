import { motion } from 'framer-motion';
import { AppGrid } from './AppGrid';
import { Dock } from './Dock';
import { config } from '../../data/config';
import { PHONE } from '../../utils/constants';

interface HomeScreenProps {
  gridOrder: string[];
  dockOrder: string[];
  onReorder: (newOrder: string[]) => void;
  onOpenApp: (appId: string, rect?: DOMRect) => void;
}

export function HomeScreen({
  gridOrder,
  dockOrder,
  onReorder,
  onOpenApp,
}: HomeScreenProps) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {/* Wallpaper */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${config.wallpaper})` }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* App grid area */}
      <div
        className="relative flex-1 overflow-hidden"
        style={{
          paddingTop: PHONE.statusBarHeight + 12,
          paddingBottom: PHONE.dock.height,
        }}
      >
        <AppGrid
          gridOrder={gridOrder}
          onReorder={onReorder}
          onOpenApp={onOpenApp}
        />
      </div>

      {/* Dock */}
      <Dock dockOrder={dockOrder} onOpenApp={onOpenApp} />
    </motion.div>
  );
}
