import type { Node, Edge } from "@xyflow/react";
import { getNodeDefinition } from "./nodeRegistry";

export interface ValidationWarning {
  nodeId: string;
  severity: "warning" | "error";
  message: string;
}

export function validateFlow(
  nodes: Node[],
  edges: Edge[]
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Build set of connected target handles for each node
  const connectedInputs = new Map<string, Set<string>>();
  for (const edge of edges) {
    const handle = edge.targetHandle ?? "input";
    if (!connectedInputs.has(edge.target)) {
      connectedInputs.set(edge.target, new Set());
    }
    connectedInputs.get(edge.target)?.add(handle);
  }

  // Build set of nodes that have any connections
  const connectedNodes = new Set<string>();
  for (const edge of edges) {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  }

  for (const node of nodes) {
    const def = getNodeDefinition(node.type ?? "");
    if (!def) continue;

    // 1. Check disconnected required inputs
    const nodeInputs = connectedInputs.get(node.id) ?? new Set();
    for (const input of def.inputs) {
      if (input.required && !nodeInputs.has(input.id)) {
        warnings.push({
          nodeId: node.id,
          severity: "warning",
          message: `${def.label}: required input "${input.label}" is not connected`,
        });
      }
    }

    // 2. Check empty required config values from schema metadata
    const data = (node.data ?? {}) as Record<string, unknown>;
    const schema = def.configSchema ?? [];

    for (const field of schema) {
      if (!field.required) {
        continue;
      }

      const value = data[field.key] ?? def.defaultConfig[field.key];
      const isEmptyString = typeof value === "string" && value.trim() === "";
      const isMissing = value === null || value === undefined;

      if (isMissing || isEmptyString) {
        warnings.push({
          nodeId: node.id,
          severity: "warning",
          message: `${def.label}: "${field.label}" is empty`,
        });
      }
    }

    // 3. Orphan nodes (no connections at all, except input nodes)
    if (!connectedNodes.has(node.id) && nodes.length > 1) {
      if (def.inputs.length > 0 || def.outputs.length > 0) {
        warnings.push({
          nodeId: node.id,
          severity: "warning",
          message: `${def.label}: node has no connections`,
        });
      }
    }
  }

  return warnings;
}
