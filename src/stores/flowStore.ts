import { create } from "zustand";
import { temporal } from "zundo";
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";

let pasteCounter = 0;

function generatePasteId(): string {
  return `paste_${Date.now()}_${++pasteCounter}`;
}

export interface FlowState {
  nodes: Node[];
  edges: Edge[];
  clipboard: { nodes: Node[]; edges: Edge[] } | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  removeNode: (id: string) => void;
  updateNodeConfig: (id: string, config: Record<string, unknown>) => void;
  setFlow: (nodes: Node[], edges: Edge[]) => void;
  clear: () => void;
  copySelected: () => void;
  pasteClipboard: () => void;
  duplicateSelected: () => void;
  selectAll: () => void;
}

export const useFlowStore = create<FlowState>()(
  temporal(
    (set, get) => ({
      nodes: [],
      edges: [],
      clipboard: null,

      onNodesChange: (changes) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) });
      },

      onEdgesChange: (changes) => {
        set({ edges: applyEdgeChanges(changes, get().edges) });
      },

      onConnect: (connection) => {
        set({ edges: addEdge(connection, get().edges) });
      },

      addNode: (node) => {
        set({ nodes: [...get().nodes, node] });
      },

      removeNode: (id) => {
        set({
          nodes: get().nodes.filter((n) => n.id !== id),
          edges: get().edges.filter(
            (e) => e.source !== id && e.target !== id
          ),
        });
      },

      updateNodeConfig: (id, config) => {
        set({
          nodes: get().nodes.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, ...config } } : n
          ),
        });
      },

      setFlow: (nodes, edges) => {
        set({ nodes, edges });
      },

      clear: () => {
        set({ nodes: [], edges: [] });
      },

      copySelected: () => {
        const { nodes, edges } = get();
        const selectedNodes = nodes.filter((n) => n.selected);
        const selectedIds = new Set(selectedNodes.map((n) => n.id));
        const selectedEdges = edges.filter(
          (e) => selectedIds.has(e.source) && selectedIds.has(e.target)
        );
        if (selectedNodes.length > 0) {
          set({ clipboard: { nodes: selectedNodes, edges: selectedEdges } });
        }
      },

      pasteClipboard: () => {
        const { clipboard, nodes, edges } = get();
        if (!clipboard || clipboard.nodes.length === 0) return;

        const idMap = new Map<string, string>();
        const offset = 40;

        const newNodes = clipboard.nodes.map((n) => {
          const newId = generatePasteId();
          idMap.set(n.id, newId);
          return {
            ...n,
            id: newId,
            position: { x: n.position.x + offset, y: n.position.y + offset },
            selected: true,
          };
        });

        const newEdges = clipboard.edges
          .filter((e) => idMap.has(e.source) && idMap.has(e.target))
          .map((e) => ({
            ...e,
            id: generatePasteId(),
            source: idMap.get(e.source)!,
            target: idMap.get(e.target)!,
          }));

        // Deselect existing nodes
        const deselected = nodes.map((n) => ({ ...n, selected: false }));

        set({
          nodes: [...deselected, ...newNodes],
          edges: [...edges, ...newEdges],
        });
      },

      duplicateSelected: () => {
        get().copySelected();
        get().pasteClipboard();
      },

      selectAll: () => {
        set({
          nodes: get().nodes.map((n) => ({ ...n, selected: true })),
          edges: get().edges.map((e) => ({ ...e, selected: true })),
        });
      },
    }),
    {
      limit: 50,
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
      }),
    }
  )
);
