import { Command } from "cmdk";
import { useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { useFlowStore } from "../../stores/flowStore";
import { useUiStore } from "../../stores/uiStore";
import { useExecution } from "../../hooks/useExecution";
import { useSaveFlow } from "../../hooks/useSaveFlow";
import { NODE_DEFINITIONS } from "../../lib/nodeRegistry";
import { generateNodeId } from "../../hooks/useDragAndDrop";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const reactFlow = useReactFlow();
  const addNode = useFlowStore((s) => s.addNode);
  const togglePalette = useUiStore((s) => s.togglePalette);
  const toggleInspector = useUiStore((s) => s.toggleInspector);
  const toggleExecutionPanel = useUiStore((s) => s.toggleExecutionPanel);
  const { run, stop, status } = useExecution();
  const { save } = useSaveFlow();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />
      <Command
        className="relative w-[500px] overflow-hidden rounded-xl border border-panel-border bg-panel-bg shadow-2xl"
        label="Command Palette"
      >
        <Command.Input
          className="w-full border-b border-panel-border bg-transparent px-4 py-3 text-sm text-text-primary placeholder-text-secondary outline-none"
          placeholder="Type a command..."
        />
        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="px-4 py-6 text-center text-xs text-text-secondary">
            No results found.
          </Command.Empty>

          <Command.Group
            heading="Actions"
            className="[&>[cmdk-group-heading]]:px-2 [&>[cmdk-group-heading]]:py-1.5 [&>[cmdk-group-heading]]:text-[10px] [&>[cmdk-group-heading]]:font-semibold [&>[cmdk-group-heading]]:uppercase [&>[cmdk-group-heading]]:tracking-wider [&>[cmdk-group-heading]]:text-text-secondary"
          >
            <CommandItem onSelect={run} disabled={status === "running"}>
              Run Flow
            </CommandItem>
            <CommandItem
              onSelect={stop}
              disabled={status !== "running"}
            >
              Stop Execution
            </CommandItem>
            <CommandItem onSelect={save}>Save Flow</CommandItem>
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
        </Command.List>
      </Command>
    </div>
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
