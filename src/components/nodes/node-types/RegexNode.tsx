import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "../BaseNode";
import { useExecutionStore } from "../../../stores/executionStore";

export function RegexNode({ id, type, selected, data }: NodeProps) {
  const status = useExecutionStore((s) => s.nodeStatuses[id] ?? "idle");
  const pattern = (data.pattern as string) ?? "";
  const mode = (data.mode as string) ?? "match";

  return (
    <BaseNode id={id} type={type} selected={selected} status={status}>
      <div className="flex items-center gap-1.5">
        <span className="shrink-0 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
          {mode}
        </span>
        {pattern ? (
          <span className="font-mono text-[10px] text-text-secondary truncate">
            /{pattern}/
          </span>
        ) : (
          <span className="text-[10px] text-text-secondary italic">No pattern</span>
        )}
      </div>
    </BaseNode>
  );
}
