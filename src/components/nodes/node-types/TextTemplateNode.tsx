import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "../BaseNode";
import { useFlowStore } from "../../../stores/flowStore";
import { useExecutionStore } from "../../../stores/executionStore";

export function TextTemplateNode({ id, type, selected, data }: NodeProps) {
  const updateNodeConfig = useFlowStore((s) => s.updateNodeConfig);
  const status = useExecutionStore((s) => s.nodeStatuses[id] ?? "idle");

  return (
    <BaseNode id={id} type={type} selected={selected} status={status}>
      <textarea
        className="nodrag nowheel w-full resize-none rounded border border-panel-border bg-canvas-bg px-2 py-1 text-xs text-text-primary focus:border-accent focus:outline-none"
        rows={2}
        value={(data.template as string) ?? "Hello, {{name}}!"}
        onChange={(e) => updateNodeConfig(id, { template: e.target.value })}
        placeholder="Hello, {{name}}!"
      />
    </BaseNode>
  );
}
