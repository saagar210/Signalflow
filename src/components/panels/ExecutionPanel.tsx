import { useExecutionStore } from "../../stores/executionStore";
import { useUiStore } from "../../stores/uiStore";
import { AlertCircle, Info, AlertTriangle } from "lucide-react";

const LEVEL_ICONS = {
  info: Info,
  warn: AlertTriangle,
  error: AlertCircle,
};

const LEVEL_COLORS = {
  info: "text-text-secondary",
  warn: "text-yellow-400",
  error: "text-red-400",
};

export function ExecutionPanel() {
  const logs = useExecutionStore((s) => s.logs);
  const status = useExecutionStore((s) => s.status);
  const duration = useExecutionStore((s) => s.duration);
  const validationWarnings = useExecutionStore((s) => s.validationWarnings);
  const selectNode = useUiStore((s) => s.selectNode);

  const warningEntries = Object.entries(validationWarnings);
  const hasWarnings = warningEntries.length > 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-panel-border px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Execution
        </span>
        <div className="flex items-center gap-2">
          {status === "complete" && duration !== null && (
            <span className="text-[10px] text-green-400">
              Completed in {duration}ms
            </span>
          )}
          {status === "error" && (
            <span className="text-[10px] text-red-400">Failed</span>
          )}
          {status === "running" && (
            <span className="text-[10px] text-blue-400">Running...</span>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {/* Validation Warnings */}
        {hasWarnings && (
          <div className="mb-2 rounded border border-amber-500/20 bg-amber-500/5 p-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 mb-1">
              Validation Warnings
            </p>
            {warningEntries.map(([nodeId, messages]) =>
              messages.map((msg, i) => (
                <button
                  key={`${nodeId}-${i}`}
                  className="flex w-full items-start gap-1.5 px-1 py-0.5 text-left hover:bg-amber-500/10 rounded"
                  onClick={() => selectNode(nodeId)}
                >
                  <AlertTriangle
                    size={12}
                    className="mt-0.5 shrink-0 text-amber-400"
                  />
                  <span className="text-[11px] text-amber-400">{msg}</span>
                </button>
              ))
            )}
          </div>
        )}

        {/* Execution Logs */}
        {logs.length === 0 && !hasWarnings ? (
          <p className="py-4 text-center text-xs text-text-secondary">
            Run a flow to see execution logs
          </p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {logs.map((log, i) => {
              const Icon = LEVEL_ICONS[log.level];
              return (
                <div
                  key={i}
                  className={`flex items-start gap-1.5 px-1 py-0.5 ${log.nodeId ? "cursor-pointer hover:bg-white/5 rounded" : ""}`}
                  onClick={log.nodeId ? () => selectNode(log.nodeId!) : undefined}
                >
                  <Icon
                    size={12}
                    className={`mt-0.5 shrink-0 ${LEVEL_COLORS[log.level]}`}
                  />
                  <span className={`text-[11px] ${LEVEL_COLORS[log.level]}`}>
                    {log.message}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
