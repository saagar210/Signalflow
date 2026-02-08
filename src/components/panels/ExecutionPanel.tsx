import { useExecutionStore } from "../../stores/executionStore";
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
        {logs.length === 0 ? (
          <p className="py-4 text-center text-xs text-text-secondary">
            Run a flow to see execution logs
          </p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {logs.map((log, i) => {
              const Icon = LEVEL_ICONS[log.level];
              return (
                <div key={i} className="flex items-start gap-1.5 px-1 py-0.5">
                  <Icon size={12} className={`mt-0.5 shrink-0 ${LEVEL_COLORS[log.level]}`} />
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
