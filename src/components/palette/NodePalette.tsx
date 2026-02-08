import { useMemo, useState } from "react";
import {
  NODE_CATEGORIES,
  NODE_DEFINITIONS,
  getNodesByCategory,
} from "../../lib/nodeRegistry";
import { PaletteCategory } from "./PaletteCategory";
import { PaletteSearch } from "./PaletteSearch";

export function NodePalette() {
  const [search, setSearch] = useState("");

  const filteredByCategory = useMemo(() => {
    const lower = search.toLowerCase();
    return NODE_CATEGORIES.map((cat) => ({
      ...cat,
      nodes: getNodesByCategory(cat.id).filter(
        (n) =>
          !search ||
          n.label.toLowerCase().includes(lower) ||
          n.description.toLowerCase().includes(lower)
      ),
    }));
  }, [search]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-panel-border px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Nodes
        </span>
      </div>
      <div className="px-3 pt-2">
        <PaletteSearch value={search} onChange={setSearch} />
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {filteredByCategory.map((cat) => (
          <PaletteCategory
            key={cat.id}
            label={cat.label}
            nodes={cat.nodes}
          />
        ))}
        {filteredByCategory.every((c) => c.nodes.length === 0) && (
          <p className="py-4 text-center text-xs text-text-secondary">
            No nodes match "{search}"
          </p>
        )}
      </div>
      <div className="border-t border-panel-border px-3 py-1.5">
        <p className="text-[10px] text-text-secondary">
          {NODE_DEFINITIONS.length} nodes available
        </p>
      </div>
    </div>
  );
}
