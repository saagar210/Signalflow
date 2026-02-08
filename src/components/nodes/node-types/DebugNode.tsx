import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "../BaseNode";
import { useExecutionStore } from "../../../stores/executionStore";
import { PREVIEW_TRUNCATE_LENGTH } from "../../../lib/constants";

export function DebugNode({ id, type, selected }: NodeProps) {
  const status = useExecutionStore((s) => s.nodeStatuses[id] ?? "idle");
  const output = useExecutionStore((s) => s.nodeOutputs[id]);
  const error = useExecutionStore((s) => s.nodeErrors[id]);

  const preview = error
    ? error
    : output
      ? typeof output === "string"
        ? output
        : JSON.stringify(output, null, 2)
      : null;

  const truncated =
    preview && preview.length > PREVIEW_TRUNCATE_LENGTH
      ? preview.slice(0, PREVIEW_TRUNCATE_LENGTH) + "..."
      : preview;

  return (
    <BaseNode id={id} type={type} selected={selected} status={status}>
      <div className="max-h-24 overflow-auto">
        {truncated ? (
          <pre
            className={`whitespace-pre-wrap text-[10px] ${error ? "text-red-400" : "text-text-secondary"}`}
          >
            {truncated}
          </pre>
        ) : (
          <p className="text-[10px] text-text-secondary italic">
            No data yet
          </p>
        )}
      </div>
    </BaseNode>
  );
}
