import { create } from "zustand";
import type { NodeStatus } from "../components/nodes/NodeStatusBadge";

export interface LogEntry {
  timestamp: number;
  nodeId?: string;
  level: "info" | "warn" | "error";
  message: string;
}

export interface ExecutionState {
  status: "idle" | "running" | "complete" | "error" | "cancelled";
  nodeStatuses: Record<string, NodeStatus>;
  nodeOutputs: Record<string, unknown>;
  nodeErrors: Record<string, string>;
  logs: LogEntry[];
  duration: number | null;

  startExecution: () => void;
  setNodeStatus: (nodeId: string, status: NodeStatus) => void;
  setNodeOutput: (nodeId: string, output: unknown) => void;
  setNodeError: (nodeId: string, error: string) => void;
  addLog: (entry: Omit<LogEntry, "timestamp">) => void;
  completeExecution: (duration: number) => void;
  failExecution: (error: string) => void;
  cancelExecution: () => void;
  reset: () => void;
}

export const useExecutionStore = create<ExecutionState>()((set) => ({
  status: "idle",
  nodeStatuses: {},
  nodeOutputs: {},
  nodeErrors: {},
  logs: [],
  duration: null,

  startExecution: () =>
    set({
      status: "running",
      nodeStatuses: {},
      nodeOutputs: {},
      nodeErrors: {},
      logs: [],
      duration: null,
    }),

  setNodeStatus: (nodeId, status) =>
    set((s) => ({
      nodeStatuses: { ...s.nodeStatuses, [nodeId]: status },
    })),

  setNodeOutput: (nodeId, output) =>
    set((s) => ({
      nodeOutputs: { ...s.nodeOutputs, [nodeId]: output },
    })),

  setNodeError: (nodeId, error) =>
    set((s) => ({
      nodeErrors: { ...s.nodeErrors, [nodeId]: error },
      nodeStatuses: { ...s.nodeStatuses, [nodeId]: "error" },
    })),

  addLog: (entry) =>
    set((s) => ({
      logs: [...s.logs, { ...entry, timestamp: Date.now() }],
    })),

  completeExecution: (duration) =>
    set({ status: "complete", duration }),

  failExecution: (error) =>
    set((s) => ({
      status: "error",
      logs: [
        ...s.logs,
        { timestamp: Date.now(), level: "error", message: error },
      ],
    })),

  cancelExecution: () => set({ status: "cancelled" }),

  reset: () =>
    set({
      status: "idle",
      nodeStatuses: {},
      nodeOutputs: {},
      nodeErrors: {},
      logs: [],
      duration: null,
    }),
}));
