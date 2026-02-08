export type PortType =
  | "string"
  | "number"
  | "boolean"
  | "array"
  | "object"
  | "file"
  | "any";

export interface PortDefinition {
  id: string;
  label: string;
  type: PortType;
  required: boolean;
}

export const PORT_COLORS: Record<PortType, string> = {
  string: "#22c55e",
  number: "#3b82f6",
  boolean: "#f59e0b",
  array: "#a855f7",
  object: "#ec4899",
  file: "#6b7280",
  any: "#e2e4e9",
};

export function areTypesCompatible(
  source: PortType,
  target: PortType
): boolean {
  if (source === target) return true;
  if (source === "any" || target === "any") return true;
  // Number can connect to string (will be coerced)
  if (source === "number" && target === "string") return true;
  if (source === "boolean" && target === "string") return true;
  return false;
}
