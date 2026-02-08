import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "../BaseNode";
import { useExecutionStore } from "../../../stores/executionStore";

export function HttpRequestNode({ id, type, selected, data }: NodeProps) {
  const status = useExecutionStore((s) => s.nodeStatuses[id] ?? "idle");
  const method = (data.method as string) ?? "GET";
  const url = (data.url as string) ?? "";

  return (
    <BaseNode id={id} type={type} selected={selected} status={status}>
      <div className="flex items-center gap-1.5">
        <span className="shrink-0 rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold text-accent">
          {method}
        </span>
        {url ? (
          <span className="text-[10px] text-text-secondary truncate" title={url}>
            {url}
          </span>
        ) : (
          <span className="text-[10px] text-text-secondary italic">No URL</span>
        )}
      </div>
    </BaseNode>
  );
}
