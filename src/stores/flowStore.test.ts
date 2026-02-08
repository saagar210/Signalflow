import { describe, it, expect, beforeEach } from "vitest";
import { useFlowStore } from "./flowStore";
import type { Node } from "@xyflow/react";

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

  it("clears all nodes and edges", () => {
    const store = useFlowStore.getState();
    store.addNode(makeNode("n1"));
    store.addNode(makeNode("n2"));
    store.clear();
    expect(useFlowStore.getState().nodes).toHaveLength(0);
    expect(useFlowStore.getState().edges).toHaveLength(0);
  });
});
