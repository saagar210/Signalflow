import { create } from "zustand";
import type { FlowSummary } from "../lib/tauri";

export interface ProjectState {
  currentFlowId: string | null;
  currentFlowName: string;
  isDirty: boolean;
  lastSavedAt: string | null;
  recentFlows: FlowSummary[];
  loading: boolean;

  setCurrentFlow: (id: string | null, name: string) => void;
  markDirty: () => void;
  markSaved: (id: string) => void;
  setRecentFlows: (flows: FlowSummary[]) => void;
  setFlowName: (name: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useProjectStore = create<ProjectState>()((set) => ({
  currentFlowId: null,
  currentFlowName: "Untitled Flow",
  isDirty: false,
  lastSavedAt: null,
  recentFlows: [],
  loading: true,

  setCurrentFlow: (id, name) =>
    set({ currentFlowId: id, currentFlowName: name, isDirty: false }),

  markDirty: () => set({ isDirty: true }),

  markSaved: (id) =>
    set({
      currentFlowId: id,
      isDirty: false,
      lastSavedAt: new Date().toISOString(),
    }),

  setRecentFlows: (flows) => set({ recentFlows: flows }),

  setFlowName: (name) => set({ currentFlowName: name, isDirty: true }),

  setLoading: (loading) => set({ loading }),
}));
