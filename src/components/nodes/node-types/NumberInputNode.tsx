import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "../BaseNode";
import { useFlowStore } from "../../../stores/flowStore";
import { useExecutionStore } from "../../../stores/executionStore";

export function NumberInputNode({ id, type, selected, data }: NodeProps) {
  const updateNodeConfig = useFlowStore((s) => s.updateNodeConfig);
  const status = useExecutionStore((s) => s.nodeStatuses[id] ?? "idle");

  return (
    <BaseNode id={id} type={type} selected={selected} status={status}>
      <input
        type="number"
        className="nodrag nowheel w-full rounded border border-panel-border bg-canvas-bg px-2 py-1 text-xs text-text-primary focus:border-accent focus:outline-none"
        value={(data.value as number) ?? 0}
        onChange={(e) =>
          {
            const val = parseFloat(e.target.value);
            updateNodeConfig(id, { value: Number.isNaN(val) ? 0 : val });
          }
        }
      />
    </BaseNode>
  );
}
