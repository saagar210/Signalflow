import { create } from "zustand";

export interface UiState {
  selectedNodeId: string | null;
  isPaletteOpen: boolean;
  isInspectorOpen: boolean;
  isExecutionPanelOpen: boolean;
  theme: "dark" | "light";
  selectNode: (id: string | null) => void;
  togglePalette: () => void;
  toggleInspector: () => void;
  toggleExecutionPanel: () => void;
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  selectedNodeId: null,
  isPaletteOpen: true,
  isInspectorOpen: true,
  isExecutionPanelOpen: false,
  theme: "dark",

  selectNode: (id) => set({ selectedNodeId: id }),
  togglePalette: () => set((s) => ({ isPaletteOpen: !s.isPaletteOpen })),
  toggleInspector: () => set((s) => ({ isInspectorOpen: !s.isInspectorOpen })),
  toggleExecutionPanel: () =>
    set((s) => ({ isExecutionPanelOpen: !s.isExecutionPanelOpen })),
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
}));

// Sync theme to DOM outside store (side-effect subscriber)
let prevTheme = useUiStore.getState().theme;
useUiStore.subscribe((state) => {
  if (state.theme !== prevTheme) {
    prevTheme = state.theme;
    document.documentElement.classList.toggle("light", state.theme === "light");
  }
});
