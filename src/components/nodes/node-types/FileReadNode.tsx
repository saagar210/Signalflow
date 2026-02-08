import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "../BaseNode";
import { useExecutionStore } from "../../../stores/executionStore";

export function FileReadNode({ id, type, selected, data }: NodeProps) {
  const status = useExecutionStore((s) => s.nodeStatuses[id] ?? "idle");
  const path = (data.path as string) ?? "";

  return (
    <BaseNode id={id} type={type} selected={selected} status={status}>
      {path ? (
        <p className="text-[10px] text-text-secondary truncate" title={path}>
          {path}
        </p>
      ) : (
        <p className="text-[10px] text-text-secondary italic">No path set</p>
      )}
    </BaseNode>
  );
}
