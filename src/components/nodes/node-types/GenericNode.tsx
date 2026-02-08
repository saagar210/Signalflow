import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "../BaseNode";
import { useExecutionStore } from "../../../stores/executionStore";

export function GenericNode({ id, type, selected }: NodeProps) {
  const status = useExecutionStore((s) => s.nodeStatuses[id] ?? "idle");

  return <BaseNode id={id} type={type} selected={selected} status={status} />;
}
