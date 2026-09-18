import { apps, type AppDefinition } from '../../data/apps';
import { AppIcon } from './AppIcon';
import { PHONE } from '../../utils/constants';

interface DockProps {
  dockOrder: string[];
  onOpenApp: (appId: string, rect?: DOMRect) => void;
}

export function Dock({ dockOrder, onOpenApp }: DockProps) {
  const orderedApps = dockOrder
    .map((id) => apps.find((a) => a.id === id))
    .filter((a): a is AppDefinition => !!a);

  return (
    <div
      className="absolute bottom-0 left-0 right-0 glass-dock flex items-center justify-around"
      style={{
        height: PHONE.dock.height,
        paddingLeft: PHONE.dock.paddingX,
        paddingRight: PHONE.dock.paddingX,
        paddingBottom: PHONE.dock.paddingBottom,
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {orderedApps.map((app) => (
        <AppIcon key={app.id} app={app} onOpen={onOpenApp} />
      ))}
    </div>
  );
}
