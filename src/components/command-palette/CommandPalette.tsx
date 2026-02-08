import { Command } from "cmdk";
import { useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { useFlowStore } from "../../stores/flowStore";
import { useProjectStore } from "../../stores/projectStore";
import { useUiStore } from "../../stores/uiStore";
import { useExecution } from "../../hooks/useExecution";
import { useSaveFlow } from "../../hooks/useSaveFlow";
import { useFlowManager } from "../../hooks/useFlowManager";
import { NODE_DEFINITIONS } from "../../lib/nodeRegistry";
import { generateNodeId } from "../../hooks/useDragAndDrop";
import { ConfirmDialog } from "../shared/ConfirmDialog";

type SubView = "none" | "open-flow" | "save-as" | "delete-flow";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [subView, setSubView] = useState<SubView>("none");
  const [saveAsName, setSaveAsName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const reactFlow = useReactFlow();
  const addNode = useFlowStore((s) => s.addNode);
  const isDirty = useProjectStore((s) => s.isDirty);
  const recentFlows = useProjectStore((s) => s.recentFlows);
  const togglePalette = useUiStore((s) => s.togglePalette);
  const toggleInspector = useUiStore((s) => s.toggleInspector);
  const toggleExecutionPanel = useUiStore((s) => s.toggleExecutionPanel);
  const { run, stop, status } = useExecution();
  const { save } = useSaveFlow();
  const { openFlow, newFlow, removeFlow, saveAs, refreshFlowList } =
    useFlowManager();

  const [showNewFlowConfirm, setShowNewFlowConfirm] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
        setSubView("none");
      }
      if (e.key === "Escape") {
        if (subView !== "none") {
          setSubView("none");
        } else {
          setOpen(false);
        }
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [subView]);

  const handleAddNode = (type: string) => {
    const def = NODE_DEFINITIONS.find((d) => d.type === type);
    if (!def) return;
    const position = reactFlow.screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    addNode({
      id: generateNodeId(),
      type,
      position,
      data: { ...def.defaultConfig },
    });
    setOpen(false);
  };

  const handleNewFlow = () => {
    if (isDirty) {
      setOpen(false);
      setShowNewFlowConfirm(true);
    } else {
      newFlow();
      setOpen(false);
    }
  };

  const handleOpenFlowView = async () => {
    await refreshFlowList();
    setSubView("open-flow");
  };

  const handleDeleteFlowView = async () => {
    await refreshFlowList();
    setSubView("delete-flow");
  };

  const handleSaveAs = async () => {
    const name = saveAsName.trim();
    if (name) {
      await saveAs(name);
      setSaveAsName("");
      setSubView("none");
      setOpen(false);
    }
  };

  if (!open && !showNewFlowConfirm && !confirmDelete) return null;

  return (
    <>
      {/* New Flow confirmation */}
      <ConfirmDialog
        open={showNewFlowConfirm}
        title="Unsaved changes"
        message="You have unsaved changes. Creating a new flow will discard them. Continue?"
        confirmLabel="Discard & Create New"
        variant="danger"
        onConfirm={() => {
          setShowNewFlowConfirm(false);
          newFlow();
        }}
        onCancel={() => setShowNewFlowConfirm(false)}
      />

      {/* Delete flow confirmation */}
      <ConfirmDialog
        open={confirmDelete !== null}
        title="Delete flow"
        message={`Are you sure you want to delete "${confirmDelete?.name ?? ""}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={async () => {
          if (confirmDelete) {
            await removeFlow(confirmDelete.id);
          }
          setConfirmDelete(null);
          setSubView("none");
          setOpen(false);
        }}
        onCancel={() => setConfirmDelete(null)}
      />

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <Command
            className="relative w-[500px] overflow-hidden rounded-xl border border-panel-border bg-panel-bg shadow-2xl"
            label="Command Palette"
          >
            {subView === "save-as" ? (
              <div className="p-3">
                <p className="mb-2 text-xs text-text-secondary">
                  Save as new flow:
                </p>
                <input
                  className="w-full rounded-lg border border-panel-border bg-canvas-bg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
                  placeholder="Flow name..."
                  autoFocus
                  value={saveAsName}
                  onChange={(e) => setSaveAsName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveAs();
                    if (e.key === "Escape") setSubView("none");
                  }}
                />
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setSubView("none")}
                    className="rounded px-2 py-1 text-xs text-text-secondary hover:text-text-primary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAs}
                    className="rounded bg-accent px-2 py-1 text-xs text-white hover:bg-accent/90"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Command.Input
                  className="w-full border-b border-panel-border bg-transparent px-4 py-3 text-sm text-text-primary placeholder-text-secondary outline-none"
                  placeholder={
                    subView === "open-flow"
                      ? "Search flows..."
                      : subView === "delete-flow"
                        ? "Select flow to delete..."
                        : "Type a command..."
                  }
                />
                <Command.List className="max-h-[300px] overflow-y-auto p-2">
                  <Command.Empty className="px-4 py-6 text-center text-xs text-text-secondary">
                    No results found.
                  </Command.Empty>

                  {subView === "open-flow" && (
                    <Command.Group
                      heading="Open Flow"
                      className="[&>[cmdk-group-heading]]:px-2 [&>[cmdk-group-heading]]:py-1.5 [&>[cmdk-group-heading]]:text-[10px] [&>[cmdk-group-heading]]:font-semibold [&>[cmdk-group-heading]]:uppercase [&>[cmdk-group-heading]]:tracking-wider [&>[cmdk-group-heading]]:text-text-secondary"
                    >
                      {recentFlows.map((flow) => (
                        <CommandItem
                          key={flow.id}
                          onSelect={async () => {
                            await openFlow(flow.id);
                            setSubView("none");
                            setOpen(false);
                          }}
                        >
                          {flow.name}
                        </CommandItem>
                      ))}
                      {recentFlows.length === 0 && (
                        <p className="px-3 py-4 text-center text-xs text-text-secondary">
                          No saved flows yet
                        </p>
                      )}
                    </Command.Group>
                  )}

                  {subView === "delete-flow" && (
                    <Command.Group
                      heading="Delete Flow"
                      className="[&>[cmdk-group-heading]]:px-2 [&>[cmdk-group-heading]]:py-1.5 [&>[cmdk-group-heading]]:text-[10px] [&>[cmdk-group-heading]]:font-semibold [&>[cmdk-group-heading]]:uppercase [&>[cmdk-group-heading]]:tracking-wider [&>[cmdk-group-heading]]:text-text-secondary"
                    >
                      {recentFlows.map((flow) => (
                        <CommandItem
                          key={flow.id}
                          onSelect={() => {
                            setConfirmDelete({ id: flow.id, name: flow.name });
                          }}
                        >
                          {flow.name}
                        </CommandItem>
                      ))}
                      {recentFlows.length === 0 && (
                        <p className="px-3 py-4 text-center text-xs text-text-secondary">
                          No saved flows
                        </p>
                      )}
                    </Command.Group>
                  )}

                  {subView === "none" && (
                    <>
                      <Command.Group
                        heading="Flow"
                        className="[&>[cmdk-group-heading]]:px-2 [&>[cmdk-group-heading]]:py-1.5 [&>[cmdk-group-heading]]:text-[10px] [&>[cmdk-group-heading]]:font-semibold [&>[cmdk-group-heading]]:uppercase [&>[cmdk-group-heading]]:tracking-wider [&>[cmdk-group-heading]]:text-text-secondary"
                      >
                        <CommandItem onSelect={handleNewFlow}>
                          New Flow
                        </CommandItem>
                        <CommandItem onSelect={handleOpenFlowView}>
                          Open Flow...
                        </CommandItem>
                        <CommandItem onSelect={save}>Save Flow</CommandItem>
                        <CommandItem onSelect={() => setSubView("save-as")}>
                          Save As...
                        </CommandItem>
                        <CommandItem onSelect={handleDeleteFlowView}>
                          Delete Flow...
                        </CommandItem>
                      </Command.Group>

                      <Command.Group
                        heading="Actions"
                        className="[&>[cmdk-group-heading]]:px-2 [&>[cmdk-group-heading]]:py-1.5 [&>[cmdk-group-heading]]:text-[10px] [&>[cmdk-group-heading]]:font-semibold [&>[cmdk-group-heading]]:uppercase [&>[cmdk-group-heading]]:tracking-wider [&>[cmdk-group-heading]]:text-text-secondary"
                      >
                        <CommandItem
                          onSelect={run}
                          disabled={status === "running"}
                        >
                          Run Flow
                        </CommandItem>
                        <CommandItem
                          onSelect={stop}
                          disabled={status !== "running"}
                        >
                          Stop Execution
                        </CommandItem>
                        <CommandItem
                          onSelect={() => {
                            reactFlow.fitView({ duration: 200 });
                            setOpen(false);
                          }}
                        >
                          Fit View
                        </CommandItem>
                        <CommandItem
                          onSelect={() => {
                            reactFlow.zoomTo(1, { duration: 200 });
                            setOpen(false);
                          }}
                        >
                          Reset Zoom
                        </CommandItem>
                        <CommandItem
                          onSelect={() => {
                            togglePalette();
                            setOpen(false);
                          }}
                        >
                          Toggle Node Palette
                        </CommandItem>
                        <CommandItem
                          onSelect={() => {
                            toggleInspector();
                            setOpen(false);
                          }}
                        >
                          Toggle Inspector
                        </CommandItem>
                        <CommandItem
                          onSelect={() => {
                            toggleExecutionPanel();
                            setOpen(false);
                          }}
                        >
                          Toggle Execution Panel
                        </CommandItem>
                        <CommandItem
                          onSelect={() => {
                            useFlowStore.temporal.getState().undo();
                            setOpen(false);
                          }}
                        >
                          Undo
                        </CommandItem>
                        <CommandItem
                          onSelect={() => {
                            useFlowStore.temporal.getState().redo();
                            setOpen(false);
                          }}
                        >
                          Redo
                        </CommandItem>
                      </Command.Group>

                      <Command.Group
                        heading="Add Node"
                        className="[&>[cmdk-group-heading]]:px-2 [&>[cmdk-group-heading]]:py-1.5 [&>[cmdk-group-heading]]:text-[10px] [&>[cmdk-group-heading]]:font-semibold [&>[cmdk-group-heading]]:uppercase [&>[cmdk-group-heading]]:tracking-wider [&>[cmdk-group-heading]]:text-text-secondary"
                      >
                        {NODE_DEFINITIONS.map((def) => (
                          <CommandItem
                            key={def.type}
                            onSelect={() => handleAddNode(def.type)}
                          >
                            {`Add ${def.label}`}
                          </CommandItem>
                        ))}
                      </Command.Group>
                    </>
                  )}
                </Command.List>
              </>
            )}
          </Command>
        </div>
      )}
    </>
  );
}

function CommandItem({
  children,
  onSelect,
  disabled,
}: {
  children: string;
  onSelect: () => void;
  disabled?: boolean;
}) {
  return (
    <Command.Item
      className="cursor-pointer rounded px-3 py-2 text-xs text-text-primary aria-selected:bg-accent/20 aria-selected:text-accent aria-disabled:opacity-40"
      onSelect={disabled ? undefined : onSelect}
      disabled={disabled}
    >
      {children}
    </Command.Item>
  );
}
