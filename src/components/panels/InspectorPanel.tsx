import { useUiStore } from "../../stores/uiStore";
import { useFlowStore } from "../../stores/flowStore";
import { useExecutionStore } from "../../stores/executionStore";
import { getNodeDefinition } from "../../lib/nodeRegistry";

function ConfigFields({
  nodeId,
  nodeType,
  data,
}: {
  nodeId: string;
  nodeType: string;
  data: Record<string, unknown>;
}) {
  const updateNodeConfig = useFlowStore((s) => s.updateNodeConfig);
  const definition = getNodeDefinition(nodeType);
  if (!definition) return null;

  const entries = Object.entries(definition.defaultConfig);
  if (entries.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
        Configuration
      </p>
      {entries.map(([key, defaultVal]) => {
        const currentVal = data[key] ?? defaultVal;

        if (typeof defaultVal === "boolean" || typeof currentVal === "boolean") {
          return (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(currentVal)}
                onChange={(e) =>
                  updateNodeConfig(nodeId, { [key]: e.target.checked })
                }
                className="rounded border-panel-border"
              />
              <span className="text-xs text-text-primary">{key}</span>
            </label>
          );
        }

        if (typeof defaultVal === "number" || typeof currentVal === "number") {
          return (
            <div key={key}>
              <label className="mb-0.5 block text-[10px] text-text-secondary">
                {key}
              </label>
              <input
                type="number"
                className="w-full rounded border border-panel-border bg-canvas-bg px-2 py-1 text-xs text-text-primary focus:border-accent focus:outline-none"
                value={Number(currentVal) || 0}
                onChange={(e) =>
                  updateNodeConfig(nodeId, {
                    [key]: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          );
        }

        const isLong =
          key === "template" ||
          key === "code" ||
          key === "systemPrompt" ||
          key === "headers";
        return (
          <div key={key}>
            <label className="mb-0.5 block text-[10px] text-text-secondary">
              {key}
            </label>
            {isLong ? (
              <textarea
                className="w-full resize-none rounded border border-panel-border bg-canvas-bg px-2 py-1 text-xs text-text-primary focus:border-accent focus:outline-none"
                rows={3}
                value={String(currentVal ?? "")}
                onChange={(e) =>
                  updateNodeConfig(nodeId, { [key]: e.target.value })
                }
              />
            ) : (
              <input
                type="text"
                className="w-full rounded border border-panel-border bg-canvas-bg px-2 py-1 text-xs text-text-primary focus:border-accent focus:outline-none"
                value={String(currentVal ?? "")}
                onChange={(e) =>
                  updateNodeConfig(nodeId, { [key]: e.target.value })
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function InspectorPanel() {
  const selectedNodeId = useUiStore((s) => s.selectedNodeId);
  const nodes = useFlowStore((s) => s.nodes);
  const nodeOutputs = useExecutionStore((s) => s.nodeOutputs);
  const nodeErrors = useExecutionStore((s) => s.nodeErrors);

  const selectedNode = selectedNodeId
    ? nodes.find((n) => n.id === selectedNodeId)
    : null;

  if (!selectedNode) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-panel-border px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Inspector
          </span>
        </div>
        <div className="flex-1 p-3">
          <p className="text-xs text-text-secondary">
            Select a node to inspect
          </p>
        </div>
      </div>
    );
  }

  const definition = getNodeDefinition(selectedNode.type ?? "");
  const output = selectedNodeId ? nodeOutputs[selectedNodeId] : undefined;
  const error = selectedNodeId ? nodeErrors[selectedNodeId] : undefined;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-panel-border px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Inspector
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-3">
          <p className="text-xs font-medium text-text-primary">
            {definition?.label ?? selectedNode.type}
          </p>
          <p className="mt-0.5 text-[10px] text-text-secondary">
            {definition?.description}
          </p>
          <p className="mt-1 text-[10px] text-text-secondary">
            ID: {selectedNode.id}
          </p>
        </div>

        <ConfigFields
          nodeId={selectedNode.id}
          nodeType={selectedNode.type ?? ""}
          data={selectedNode.data as Record<string, unknown>}
        />

        {output != null ? (
          <div className="mt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
              Output
            </p>
            <pre className="mt-1 max-h-32 overflow-auto rounded border border-panel-border bg-canvas-bg p-2 text-[10px] text-green-400">
              {typeof output === "string"
                ? output
                : JSON.stringify(output, null, 2)}
            </pre>
          </div>
        ) : null}

        {error != null ? (
          <div className="mt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-red-400">
              Error
            </p>
            <pre className="mt-1 rounded border border-red-400/30 bg-red-400/10 p-2 text-[10px] text-red-400">
              {error}
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}
