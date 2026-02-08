import { useCallback, type DragEvent } from "react";
import { useReactFlow } from "@xyflow/react";
import { useFlowStore } from "../stores/flowStore";
import { getNodeDefinition } from "../lib/nodeRegistry";

let nodeIdCounter = 0;

export function generateNodeId(): string {
  return `node_${Date.now()}_${++nodeIdCounter}`;
}

export function useDragAndDrop() {
  const reactFlow = useReactFlow();
  const addNode = useFlowStore((s) => s.addNode);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData("application/signalflow-node");
      if (!nodeType) return;

      const definition = getNodeDefinition(nodeType);
      if (!definition) return;

      const position = reactFlow.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode({
        id: generateNodeId(),
        type: nodeType,
        position,
        data: { ...definition.defaultConfig },
      });
    },
    [reactFlow, addNode]
  );

  return { onDragOver, onDrop };
}
