import { describe, it, expect } from "vitest";
import { isValidConnection } from "./connectionValidator";
import type { Edge } from "@xyflow/react";

const nodes = [
  { id: "n1", type: "textInput" },
  { id: "n2", type: "debug" },
  { id: "n3", type: "numberInput" },
  { id: "n4", type: "filter" },
];

describe("isValidConnection", () => {
  it("accepts compatible string → any connection", () => {
    const result = isValidConnection(
      { source: "n1", target: "n2", sourceHandle: "value", targetHandle: "input" },
      nodes,
      []
    );
    expect(result.valid).toBe(true);
  });

  it("rejects self-connection", () => {
    const result = isValidConnection(
      { source: "n1", target: "n1", sourceHandle: "value", targetHandle: "input" },
      nodes,
      []
    );
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("itself");
  });

  it("rejects duplicate connection", () => {
    const existing: Edge[] = [
      { id: "e1", source: "n1", target: "n2", sourceHandle: "value", targetHandle: "input" },
    ];
    const result = isValidConnection(
      { source: "n1", target: "n2", sourceHandle: "value", targetHandle: "input" },
      nodes,
      existing
    );
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("exists");
  });

  it("rejects incompatible number → array connection", () => {
    const result = isValidConnection(
      { source: "n3", target: "n4", sourceHandle: "value", targetHandle: "input" },
      nodes,
      []
    );
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("Incompatible");
  });

  it("accepts number → string coercion (textInput debug)", () => {
    // number output → any input (debug accepts any)
    const result = isValidConnection(
      { source: "n3", target: "n2", sourceHandle: "value", targetHandle: "input" },
      nodes,
      []
    );
    expect(result.valid).toBe(true);
  });
});
