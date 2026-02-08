import { useState, memo } from "react";
import { ChevronRight, ChevronDown, Copy, Check } from "lucide-react";

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    string: "text-green-400",
    number: "text-blue-400",
    boolean: "text-amber-400",
    null: "text-text-secondary",
    array: "text-purple-400",
    object: "text-cyan-400",
  };
  return (
    <span className={`text-[9px] ${colors[type] ?? "text-text-secondary"}`}>
      {type}
    </span>
  );
}

function JsonValue({
  value,
  depth,
  maxDepth,
}: {
  value: unknown;
  depth: number;
  maxDepth: number;
}) {
  const [collapsed, setCollapsed] = useState(depth >= 2);

  if (value === null || value === undefined) {
    return (
      <span className="text-text-secondary italic">null</span>
    );
  }

  if (typeof value === "string") {
    const truncated = value.length > 200 ? value.slice(0, 200) + "..." : value;
    return <span className="text-green-400">"{truncated}"</span>;
  }

  if (typeof value === "number") {
    return <span className="text-blue-400">{value}</span>;
  }

  if (typeof value === "boolean") {
    return <span className="text-amber-400">{String(value)}</span>;
  }

  if (depth >= maxDepth) {
    if (Array.isArray(value)) {
      return <span className="text-text-secondary">Array[{value.length}]</span>;
    }
    return <span className="text-text-secondary">{"{...}"}</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-text-secondary">[]</span>;
    }

    return (
      <div>
        <button
          className="inline-flex items-center gap-0.5 text-text-secondary hover:text-text-primary"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
          <TypeBadge type="array" />
          <span className="text-[10px]">[{value.length}]</span>
        </button>
        {!collapsed && (
          <div className="ml-3 border-l border-panel-border pl-2">
            {value.map((item, i) => (
              <div key={i} className="flex gap-1">
                <span className="shrink-0 text-[10px] text-text-secondary">
                  {i}:
                </span>
                <JsonValue value={item} depth={depth + 1} maxDepth={maxDepth} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return <span className="text-text-secondary">{"{}"}</span>;
    }

    return (
      <div>
        <button
          className="inline-flex items-center gap-0.5 text-text-secondary hover:text-text-primary"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
          <TypeBadge type="object" />
          <span className="text-[10px]">{`{${entries.length}}`}</span>
        </button>
        {!collapsed && (
          <div className="ml-3 border-l border-panel-border pl-2">
            {entries.map(([key, val]) => (
              <div key={key} className="flex gap-1">
                <span className="shrink-0 text-[10px] text-cyan-300">
                  {key}:
                </span>
                <JsonValue value={val} depth={depth + 1} maxDepth={maxDepth} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return <span className="text-text-secondary">{String(value)}</span>;
}

export const DataInspector = memo(function DataInspector({
  data,
}: {
  data: unknown;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
          Output
        </p>
        <button
          onClick={handleCopy}
          className="text-text-secondary hover:text-text-primary"
          aria-label="Copy output"
        >
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
        </button>
      </div>
      <div className="mt-1 max-h-48 overflow-auto rounded border border-panel-border bg-canvas-bg p-2 text-[10px] font-mono">
        <JsonValue value={data} depth={0} maxDepth={5} />
      </div>
    </div>
  );
});
