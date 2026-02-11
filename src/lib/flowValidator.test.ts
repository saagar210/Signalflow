import { describe, it, expect } from "vitest";
import { validateFlow } from "./flowValidator";
import type { Node, Edge } from "@xyflow/react";

describe("flowValidator", () => {
  it("returns empty array for valid flow", () => {
    const nodes: Node[] = [
      { id: "1", type: "textInput", position: { x: 0, y: 0 }, data: { value: "hello" } },
      { id: "2", type: "debug", position: { x: 200, y: 0 }, data: {} },
    ];
    const edges: Edge[] = [
      { id: "e1", source: "1", target: "2", sourceHandle: "value", targetHandle: "input" },
    ];

    const warnings = validateFlow(nodes, edges);
    expect(warnings).toHaveLength(0);
  });

  it("catches disconnected required input", () => {
    const nodes: Node[] = [
      { id: "1", type: "debug", position: { x: 0, y: 0 }, data: {} },
    ];
    const edges: Edge[] = [];

    const warnings = validateFlow(nodes, edges);
    expect(warnings.some((w) => w.message.includes("not connected"))).toBe(true);
  });

  it("catches empty path on fileRead", () => {
    const nodes: Node[] = [
      { id: "1", type: "fileRead", position: { x: 0, y: 0 }, data: { path: "" } },
      { id: "2", type: "debug", position: { x: 200, y: 0 }, data: {} },
    ];
    const edges: Edge[] = [
      { id: "e1", source: "1", target: "2", sourceHandle: "content", targetHandle: "input" },
    ];

    const warnings = validateFlow(nodes, edges);
    expect(warnings.some((w) => w.message.includes("empty"))).toBe(true);
  });

  it("catches empty url on httpRequest", () => {
    const nodes: Node[] = [
      { id: "1", type: "httpRequest", position: { x: 0, y: 0 }, data: { url: "", method: "GET", headers: "{}" } },
      { id: "2", type: "debug", position: { x: 200, y: 0 }, data: {} },
    ];
    const edges: Edge[] = [
      { id: "e1", source: "1", target: "2", sourceHandle: "response", targetHandle: "input" },
    ];

    const warnings = validateFlow(nodes, edges);
    expect(warnings.some((w) => w.message.includes("URL") && w.message.includes("empty"))).toBe(true);
  });

  it("catches whitespace-only required expression on map", () => {
    const nodes: Node[] = [
      { id: "1", type: "numberInput", position: { x: 0, y: 0 }, data: { value: 1 } },
      { id: "2", type: "map", position: { x: 200, y: 0 }, data: { expression: "   " } },
      { id: "3", type: "debug", position: { x: 400, y: 0 }, data: {} },
    ];
    const edges: Edge[] = [
      { id: "e1", source: "1", target: "2", sourceHandle: "value", targetHandle: "input" },
      { id: "e2", source: "2", target: "3", sourceHandle: "output", targetHandle: "input" },
    ];

    const warnings = validateFlow(nodes, edges);
    expect(warnings.some((w) => w.message.includes("Map") && w.message.includes("Expression") && w.message.includes("empty"))).toBe(true);
  });

  it("catches missing required code config", () => {
    const nodes: Node[] = [
      { id: "1", type: "textInput", position: { x: 0, y: 0 }, data: { value: "hello" } },
      { id: "2", type: "code", position: { x: 200, y: 0 }, data: { code: "" } },
      { id: "3", type: "debug", position: { x: 400, y: 0 }, data: {} },
    ];
    const edges: Edge[] = [
      { id: "e1", source: "1", target: "2", sourceHandle: "value", targetHandle: "input" },
      { id: "e2", source: "2", target: "3", sourceHandle: "output", targetHandle: "input" },
    ];

    const warnings = validateFlow(nodes, edges);
    expect(warnings.some((w) => w.message.includes("Code") && w.message.includes("empty"))).toBe(true);
  });

  it("catches orphan nodes", () => {
    const nodes: Node[] = [
      { id: "1", type: "textInput", position: { x: 0, y: 0 }, data: { value: "hello" } },
      { id: "2", type: "debug", position: { x: 200, y: 0 }, data: {} },
    ];
    const edges: Edge[] = []; // No connections between them

    const warnings = validateFlow(nodes, edges);
    expect(warnings.some((w) => w.message.includes("no connections"))).toBe(true);
  });
});
