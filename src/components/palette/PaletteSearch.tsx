import { Search } from "lucide-react";

interface PaletteSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function PaletteSearch({ value, onChange }: PaletteSearchProps) {
  return (
    <div className="relative">
      <Search
        size={12}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-text-secondary"
      />
      <input
        type="text"
        className="w-full rounded border border-panel-border bg-canvas-bg py-1.5 pl-7 pr-2 text-xs text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none"
        placeholder="Search nodes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
