import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "../BaseNode";
import { useExecutionStore } from "../../../stores/executionStore";

export function CodeNode({ id, type, selected, data }: NodeProps) {
  const status = useExecutionStore((s) => s.nodeStatuses[id] ?? "idle");
  const code = (data.code as string) ?? "return input;";
  const preview = code.length > 60 ? code.slice(0, 60) + "..." : code;

  return (
    <BaseNode id={id} type={type} selected={selected} status={status}>
      <pre className="font-mono text-[10px] text-text-secondary whitespace-pre-wrap line-clamp-3">
        {preview}
      </pre>
    </BaseNode>
  );
}
