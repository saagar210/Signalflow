import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "../BaseNode";
import { useFlowStore } from "../../../stores/flowStore";
import { useExecutionStore } from "../../../stores/executionStore";

export function TextInputNode({ id, type, selected, data }: NodeProps) {
  const updateNodeConfig = useFlowStore((s) => s.updateNodeConfig);
  const status = useExecutionStore((s) => s.nodeStatuses[id] ?? "idle");

  return (
    <BaseNode id={id} type={type} selected={selected} status={status}>
      <textarea
        className="nodrag nowheel w-full resize-none rounded border border-panel-border bg-canvas-bg px-2 py-1 text-xs text-text-primary focus:border-accent focus:outline-none"
        rows={2}
        value={(data.value as string) ?? ""}
        onChange={(e) => updateNodeConfig(id, { value: e.target.value })}
        placeholder="Enter text..."
      />
    </BaseNode>
  );
}
