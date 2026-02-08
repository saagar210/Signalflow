import { memo, type DragEvent } from "react";
import type { NodeDefinitionMeta } from "../../lib/nodeRegistry";

interface PaletteItemProps {
  definition: NodeDefinitionMeta;
}

export const PaletteItem = memo(function PaletteItem({ definition }: PaletteItemProps) {
  const onDragStart = (event: DragEvent) => {
    event.dataTransfer.setData(
      "application/signalflow-node",
      definition.type
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="cursor-grab rounded border border-panel-border bg-canvas-bg px-2.5 py-1.5 text-xs text-text-primary transition-colors hover:border-accent/50 hover:bg-panel-border/50 active:cursor-grabbing"
      draggable
      onDragStart={onDragStart}
      title={definition.description}
    >
      {definition.label}
    </div>
  );
});
