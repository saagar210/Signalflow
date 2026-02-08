import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "../BaseNode";
import { useExecutionStore } from "../../../stores/executionStore";

export function LlmPromptNode({ id, type, selected, data }: NodeProps) {
  const status = useExecutionStore((s) => s.nodeStatuses[id] ?? "idle");
  const model = (data.model as string) ?? "llama3.2";
  const systemPrompt = (data.systemPrompt as string) ?? "";

  return (
    <BaseNode id={id} type={type} selected={selected} status={status}>
      <div className="space-y-1">
        <span className="inline-block rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-medium text-purple-400">
          {model}
        </span>
        {systemPrompt && (
          <p className="text-[10px] text-text-secondary truncate line-clamp-2">
            {systemPrompt}
          </p>
        )}
      </div>
    </BaseNode>
  );
}
