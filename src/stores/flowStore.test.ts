import { describe, it, expect, beforeEach } from "vitest";
import { useFlowStore } from "./flowStore";
import type { Node } from "@xyflow/react";
import { useProjectStore } from "./projectStore";

function makeNode(id: string): Node {
  return {
    id,
    type: "default",
    position: { x: 0, y: 0 },
    data: {},
  };
}

describe("flowStore", () => {
  beforeEach(() => {
    useFlowStore.getState().clear();
    useProjectStore.setState({
      currentFlowId: null,
      currentFlowName: "Untitled Flow",
      isDirty: false,
      lastSavedAt: null,
      recentFlows: [],
      loading: true,
      activeScreen: "welcome",
    });
  });

  it("starts with empty nodes and edges", () => {
    const state = useFlowStore.getState();
    expect(state.nodes).toEqual([]);
    expect(state.edges).toEqual([]);
  });

  it("adds a node", () => {
    useFlowStore.getState().addNode(makeNode("n1"));
    expect(useFlowStore.getState().nodes).toHaveLength(1);
    expect(useFlowStore.getState().nodes[0].id).toBe("n1");
  });

  it("removes a node and its connected edges", () => {
    const store = useFlowStore.getState();
    store.addNode(makeNode("n1"));
    store.addNode(makeNode("n2"));
    store.onConnect({
      source: "n1",
      target: "n2",
      sourceHandle: null,
      targetHandle: null,
    });
    expect(useFlowStore.getState().edges).toHaveLength(1);

    useFlowStore.getState().removeNode("n1");
    expect(useFlowStore.getState().nodes).toHaveLength(1);
    expect(useFlowStore.getState().edges).toHaveLength(0);
  });

  it("updates node config", () => {
    useFlowStore.getState().addNode(makeNode("n1"));
    useFlowStore.getState().updateNodeConfig("n1", { value: "hello" });
    expect(useFlowStore.getState().nodes[0].data).toEqual({ value: "hello" });
  });

  it("loads an existing flow without marking the project dirty", () => {
    useProjectStore.getState().markDirty();

    useFlowStore
      .getState()
      .setFlow(
        [makeNode("saved-node")],
        [],
        { x: 20, y: 30, zoom: 1.25 },
        { persistedViewport: true },
      );
    useProjectStore.getState().setCurrentFlow("flow-1", "Saved Flow");

    const state = useFlowStore.getState();
    expect(state.nodes).toHaveLength(1);
    expect(state.viewport).toEqual({ x: 20, y: 30, zoom: 1.25 });
    expect(state.hasPersistedViewport).toBe(true);
    expect(useProjectStore.getState().isDirty).toBe(false);
  });

  it("does not mark dirty when viewport updates are restoration-only", () => {
    useFlowStore
      .getState()
      .setViewport({ x: 100, y: 200, zoom: 1.5 }, { markDirty: false });

    expect(useFlowStore.getState().viewport).toEqual({
      x: 100,
      y: 200,
      zoom: 1.5,
    });
    expect(useProjectStore.getState().isDirty).toBe(false);
  });

  it("marks dirty when viewport changes after user interaction", () => {
    useFlowStore.getState().setViewport({ x: 10, y: 15, zoom: 0.9 });

    expect(useProjectStore.getState().isDirty).toBe(true);
  });

  it("clears all nodes and edges", () => {
    const store = useFlowStore.getState();
    store.addNode(makeNode("n1"));
    store.addNode(makeNode("n2"));
    store.clear();
    expect(useFlowStore.getState().nodes).toHaveLength(0);
    expect(useFlowStore.getState().edges).toHaveLength(0);
  });
});
