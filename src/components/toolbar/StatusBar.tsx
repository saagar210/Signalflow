import { useFlowStore } from "../../stores/flowStore";
import { useExecutionStore } from "../../stores/executionStore";

export function StatusBar() {
  const nodeCount = useFlowStore((s) => s.nodes.length);
  const edgeCount = useFlowStore((s) => s.edges.length);
  const execStatus = useExecutionStore((s) => s.status);
  const duration = useExecutionStore((s) => s.duration);

  const statusText = (() => {
    switch (execStatus) {
      case "running":
        return "Running...";
      case "complete":
        return `Completed in ${duration}ms`;
      case "error":
        return "Failed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Ready";
    }
  })();

  return (
    <div className="flex h-6 items-center justify-between border-t border-panel-border bg-panel-bg px-3">
      <span className="text-xs text-text-secondary">
        {nodeCount} node{nodeCount !== 1 ? "s" : ""} · {edgeCount} edge
        {edgeCount !== 1 ? "s" : ""}
      </span>
      <span className="text-xs text-text-secondary">{statusText}</span>
    </div>
  );
}
