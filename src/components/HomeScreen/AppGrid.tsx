import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { apps, type AppDefinition } from '../../data/apps';
import { AppIcon } from './AppIcon';
import { PHONE } from '../../utils/constants';

interface AppGridProps {
  gridOrder: string[];
  onReorder: (newOrder: string[]) => void;
  onOpenApp: (appId: string, rect?: DOMRect) => void;
}

function SortableAppIcon({
  app,
  onOpen,
}: {
  app: AppDefinition;
  onOpen: (appId: string, rect?: DOMRect) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: app.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
  };

  return (
    <AppIcon
      app={app}
      onOpen={onOpen}
      isDragging={isDragging}
      style={style}
      listeners={listeners as unknown as Record<string, unknown>}
      attributes={attributes as unknown as Record<string, unknown>}
      setNodeRef={setNodeRef}
    />
  );
}

// Custom modifiers import
const modifiers = [restrictToParentElement];

export function AppGrid({ gridOrder, onReorder, onOpenApp }: AppGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  const orderedApps = gridOrder
    .map((id) => apps.find((a) => a.id === id))
    .filter((a): a is AppDefinition => !!a);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = gridOrder.indexOf(active.id as string);
      const newIndex = gridOrder.indexOf(over.id as string);
      onReorder(arrayMove(gridOrder, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={modifiers}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={gridOrder} strategy={rectSortingStrategy}>
        <div
          className="grid justify-items-center content-start"
          style={{
            gridTemplateColumns: `repeat(${PHONE.grid.columns}, 1fr)`,
            gap: PHONE.grid.gap,
            paddingLeft: PHONE.grid.paddingX,
            paddingRight: PHONE.grid.paddingX,
            paddingTop: PHONE.grid.paddingTop,
          }}
        >
          {orderedApps.map((app) => (
            <SortableAppIcon key={app.id} app={app} onOpen={onOpenApp} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
