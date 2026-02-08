import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "../BaseNode";
import { useExecutionStore } from "../../../stores/executionStore";

export function FileWriteNode({ id, type, selected, data }: NodeProps) {
  const status = useExecutionStore((s) => s.nodeStatuses[id] ?? "idle");
  const path = (data.path as string) ?? "";
  const append = Boolean(data.append);

  return (
    <BaseNode id={id} type={type} selected={selected} status={status}>
      {path ? (
        <p className="text-[10px] text-text-secondary truncate" title={path}>
          {append ? "[append] " : ""}{path}
        </p>
      ) : (
        <p className="text-[10px] text-text-secondary italic">No path set</p>
      )}
    </BaseNode>
  );
}
