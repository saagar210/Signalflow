import { useProjectStore } from "../../stores/projectStore";
import { useFlowManager } from "../../hooks/useFlowManager";
import { Plus, FileText } from "lucide-react";
import type { FlowSummary } from "../../lib/tauri";

function formatRelativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(isoDate).toLocaleDateString();
}

function FlowListItem({
  flow,
  onOpen,
}: {
  flow: FlowSummary;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onOpen(flow.id)}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-white/5 transition-colors"
    >
      <FileText size={16} className="shrink-0 text-text-secondary" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary truncate">{flow.name}</p>
        <p className="text-[11px] text-text-secondary">
          {formatRelativeTime(flow.updated_at)}
        </p>
      </div>
    </button>
  );
}

export function WelcomeScreen() {
  const recentFlows = useProjectStore((s) => s.recentFlows);
  const { openFlow, newFlow } = useFlowManager();

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-auto bg-canvas-bg/80 backdrop-blur-sm">
      <div className="w-[380px] rounded-xl border border-panel-border bg-panel-bg p-6 shadow-2xl">
        <h1 className="text-lg font-bold text-text-primary">SignalFlow</h1>
        <p className="mt-1 text-xs text-text-secondary">
          Visual dataflow programming
        </p>

        <button
          onClick={newFlow}
          className="mt-5 flex w-full items-center gap-2 rounded-lg bg-accent px-3 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
        >
          <Plus size={16} />
          New Flow
        </button>

        {recentFlows.length > 0 && (
          <div className="mt-5">
            <h2 className="px-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              Recent Flows
            </h2>
            <div className="mt-2 -mx-1 max-h-[240px] overflow-y-auto">
              {recentFlows.map((flow) => (
                <FlowListItem key={flow.id} flow={flow} onOpen={openFlow} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
