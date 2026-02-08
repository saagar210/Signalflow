import { useCallback, useRef } from "react";
import { useFlowStore } from "../stores/flowStore";
import { useProjectStore } from "../stores/projectStore";
import { saveFlow, type FlowDocument } from "../lib/tauri";

export function useSaveFlow() {
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const flowId = useProjectStore((s) => s.currentFlowId);
  const flowName = useProjectStore((s) => s.currentFlowName);
  const markSaved = useProjectStore((s) => s.markSaved);
  const isSaving = useRef(false);

  const save = useCallback(async () => {
    if (isSaving.current || nodes.length === 0) return;
    isSaving.current = true;

    const flow: FlowDocument = {
      id: flowId,
      name: flowName,
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type ?? "unknown",
        position: n.position,
        data: (n.data ?? {}) as Record<string, unknown>,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle ?? null,
        targetHandle: e.targetHandle ?? null,
      })),
      viewport: { x: 0, y: 0, zoom: 1 },
    };

    try {
      const id = await saveFlow(flow);
      markSaved(id);
    } catch (e) {
      // isDirty remains true so user knows save failed
      console.error("Failed to save flow:", e);
    } finally {
      isSaving.current = false;
    }
  }, [nodes, edges, flowId, flowName, markSaved]);

  return { save };
}
