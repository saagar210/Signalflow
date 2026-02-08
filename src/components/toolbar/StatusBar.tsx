import { useFlowStore } from "../../stores/flowStore";
import { useExecutionStore } from "../../stores/executionStore";
import { useProjectStore } from "../../stores/projectStore";

function formatSavedAgo(isoDate: string | null): string {
  if (!isoDate) return "";
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 5) return "Saved just now";
  if (diffSec < 60) return `Saved ${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Saved ${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `Saved ${diffHr}h ago`;
}

export function StatusBar() {
  const nodeCount = useFlowStore((s) => s.nodes.length);
  const edgeCount = useFlowStore((s) => s.edges.length);
  const execStatus = useExecutionStore((s) => s.status);
  const duration = useExecutionStore((s) => s.duration);
  const flowName = useProjectStore((s) => s.currentFlowName);
  const isDirty = useProjectStore((s) => s.isDirty);
  const lastSavedAt = useProjectStore((s) => s.lastSavedAt);

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

  const savedText = formatSavedAgo(lastSavedAt);

  return (
    <div className="flex h-6 items-center justify-between border-t border-panel-border bg-panel-bg px-3">
      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <span className="font-medium text-text-primary">
          {flowName}
          {isDirty && (
            <span className="ml-1 text-amber-400" title="Unsaved changes">
              *
            </span>
          )}
        </span>
        <span>
          {nodeCount} node{nodeCount !== 1 ? "s" : ""} · {edgeCount} edge
          {edgeCount !== 1 ? "s" : ""}
        </span>
        {savedText && <span>{savedText}</span>}
      </div>
      <span className="text-xs text-text-secondary">{statusText}</span>
    </div>
  );
}
