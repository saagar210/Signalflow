import type { Connection, Edge } from "@xyflow/react";
import { getNodeDefinition } from "./nodeRegistry";
import { areTypesCompatible, type PortType } from "./portTypes";

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export function isValidConnection(
  connection: Connection | Edge,
  nodes: { id: string; type?: string }[],
  edges: Edge[]
): ValidationResult {
  if (!connection.source || !connection.target) {
    return { valid: false, reason: "Missing source or target" };
  }

  if (connection.source === connection.target) {
    return { valid: false, reason: "Cannot connect node to itself" };
  }

  // Check for duplicate connections
  const duplicate = edges.some(
    (e) =>
      e.source === connection.source &&
      e.target === connection.target &&
      e.sourceHandle === connection.sourceHandle &&
      e.targetHandle === connection.targetHandle
  );
  if (duplicate) {
    return { valid: false, reason: "Connection already exists" };
  }

  // Check port type compatibility
  const sourceNode = nodes.find((n) => n.id === connection.source);
  const targetNode = nodes.find((n) => n.id === connection.target);
  if (!sourceNode?.type || !targetNode?.type) {
    return { valid: true };
  }

  const sourceDef = getNodeDefinition(sourceNode.type);
  const targetDef = getNodeDefinition(targetNode.type);
  if (!sourceDef || !targetDef) {
    // Allow connections for unknown node types (forward compatibility)
    return { valid: true };
  }

  const sourcePort = sourceDef.outputs.find(
    (p) => p.id === connection.sourceHandle
  );
  const targetPort = targetDef.inputs.find(
    (p) => p.id === connection.targetHandle
  );
  if (!sourcePort || !targetPort) {
    // Port not found — allow if handles are unspecified (default port)
    if (connection.sourceHandle && !sourcePort) {
      return { valid: false, reason: `Unknown output port: ${connection.sourceHandle}` };
    }
    if (connection.targetHandle && !targetPort) {
      return { valid: false, reason: `Unknown input port: ${connection.targetHandle}` };
    }
    return { valid: true };
  }

  if (!areTypesCompatible(sourcePort.type, targetPort.type)) {
    return {
      valid: false,
      reason: `Incompatible types: ${sourcePort.type} → ${targetPort.type}`,
    };
  }

  return { valid: true };
}

export function getPortType(
  nodeType: string,
  handleId: string,
  direction: "input" | "output"
): PortType | undefined {
  const def = getNodeDefinition(nodeType);
  if (!def) return undefined;
  const ports = direction === "input" ? def.inputs : def.outputs;
  return ports.find((p) => p.id === handleId)?.type;
}
