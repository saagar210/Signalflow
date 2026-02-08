import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "../BaseNode";
import { useExecutionStore } from "../../../stores/executionStore";

export function ConditionalNode({ id, type, selected, data }: NodeProps) {
  const status = useExecutionStore((s) => s.nodeStatuses[id] ?? "idle");
  const expression = (data.expression as string) ?? "input !== null";

  return (
    <BaseNode id={id} type={type} selected={selected} status={status}>
      <p className="font-mono text-[10px] text-text-secondary truncate">
        {expression}
      </p>
    </BaseNode>
  );
}
