import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface KeyValueFieldProps {
  label: string;
  value: string; // JSON string of Record<string, string>
  onChange: (value: string) => void;
}

function parseKV(json: string): Array<[string, string]> {
  try {
    const obj = JSON.parse(json) as Record<string, string>;
    return Object.entries(obj);
  } catch {
    return [];
  }
}

function toJSON(pairs: Array<[string, string]>): string {
  const obj: Record<string, string> = {};
  for (const [k, v] of pairs) {
    if (k.trim()) obj[k.trim()] = v;
  }
  return JSON.stringify(obj);
}

export function KeyValueField({ label, value, onChange }: KeyValueFieldProps) {
  const [pairs, setPairs] = useState<Array<[string, string]>>(() => parseKV(value));

  const update = (newPairs: Array<[string, string]>) => {
    setPairs(newPairs);
    onChange(toJSON(newPairs));
  };

  const addRow = () => update([...pairs, ["", ""]]);

  const removeRow = (index: number) =>
    update(pairs.filter((_, i) => i !== index));

  const updateKey = (index: number, key: string) =>
    update(pairs.map((p, i) => (i === index ? [key, p[1]] : p)));

  const updateValue = (index: number, val: string) =>
    update(pairs.map((p, i) => (i === index ? [p[0], val] : p)));

  return (
    <div>
      <label className="mb-0.5 flex items-center justify-between text-[10px] text-text-secondary">
        <span>{label}</span>
        <button
          onClick={addRow}
          className="text-text-secondary hover:text-text-primary"
          aria-label="Add header"
        >
          <Plus size={12} />
        </button>
      </label>
      <div className="space-y-1">
        {pairs.map(([k, v], i) => (
          <div key={i} className="flex gap-1">
            <input
              type="text"
              className="flex-1 rounded border border-panel-border bg-canvas-bg px-1.5 py-0.5 text-[10px] text-text-primary focus:border-accent focus:outline-none"
              placeholder="Key"
              value={k}
              onChange={(e) => updateKey(i, e.target.value)}
            />
            <input
              type="text"
              className="flex-1 rounded border border-panel-border bg-canvas-bg px-1.5 py-0.5 text-[10px] text-text-primary focus:border-accent focus:outline-none"
              placeholder="Value"
              value={v}
              onChange={(e) => updateValue(i, e.target.value)}
            />
            <button
              onClick={() => removeRow(i)}
              className="shrink-0 text-text-secondary hover:text-red-400"
              aria-label="Remove row"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        {pairs.length === 0 && (
          <p className="text-[10px] text-text-secondary italic">No headers</p>
        )}
      </div>
    </div>
  );
}
