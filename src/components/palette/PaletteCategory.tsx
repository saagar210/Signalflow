import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { NodeDefinitionMeta } from "../../lib/nodeRegistry";
import { PaletteItem } from "./PaletteItem";

interface PaletteCategoryProps {
  label: string;
  nodes: NodeDefinitionMeta[];
}

export function PaletteCategory({ label, nodes }: PaletteCategoryProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (nodes.length === 0) return null;

  return (
    <div>
      <button
        className="flex w-full items-center gap-1 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        {label}
      </button>
      {isOpen && (
        <div className="flex flex-col gap-1 pb-2 pl-1">
          {nodes.map((node) => (
            <PaletteItem key={node.type} definition={node} />
          ))}
        </div>
      )}
    </div>
  );
}
