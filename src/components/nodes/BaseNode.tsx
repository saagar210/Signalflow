import { memo, type ReactNode } from "react";
import { Position } from "@xyflow/react";
import { NodeHandle } from "./NodeHandle";
import { NodeStatusBadge, type NodeStatus } from "./NodeStatusBadge";
import { DataPreview } from "./DataPreview";
import { getNodeDefinition } from "../../lib/nodeRegistry";

interface BaseNodeProps {
  id: string;
  type: string;
  label?: string;
  status?: NodeStatus;
  selected?: boolean;
  warning?: string;
  children?: ReactNode;
}

export const BaseNode = memo(function BaseNode({
  id,
  type,
  label,
  status = "idle",
  selected,
  warning,
  children,
}: BaseNodeProps) {
  const definition = getNodeDefinition(type);
  if (!definition) return null;

  const displayLabel = label ?? definition.label;

  let borderClass = "border-panel-border";
  if (selected) {
    borderClass = "border-accent ring-1 ring-accent/30";
  } else if (warning) {
    borderClass = "border-amber-500/50";
  }

  return (
    <div
      className={`min-w-[180px] max-w-[260px] rounded-lg border bg-panel-bg shadow-lg ${borderClass}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-lg border-b border-panel-border bg-panel-border/30 px-3 py-1.5">
        <span className="text-xs font-medium text-text-primary">
          {displayLabel}
        </span>
        <NodeStatusBadge status={status} />
      </div>

      {/* Ports */}
      <div className="flex justify-between gap-4 px-2 py-2">
        {/* Input Ports */}
        <div className="flex flex-col gap-0.5">
          {definition.inputs.map((port) => (
            <NodeHandle
              key={port.id}
              port={port}
              type="target"
              position={Position.Left}
            />
          ))}
        </div>

        {/* Output Ports */}
        <div className="flex flex-col items-end gap-0.5">
          {definition.outputs.map((port) => (
            <NodeHandle
              key={port.id}
              port={port}
              type="source"
              position={Position.Right}
            />
          ))}
        </div>
      </div>

      {/* Custom Content */}
      {children && (
        <div className="border-t border-panel-border px-3 py-2">
          {children}
        </div>
      )}

      {/* Inline Data Preview */}
      <div className="px-3 pb-2">
        <DataPreview nodeId={id} />
      </div>
    </div>
  );
});
