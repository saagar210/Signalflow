import { memo } from "react";
import { useExecutionStore } from "../../stores/executionStore";

function formatPreview(data: unknown): string {
  if (data == null) return "";

  if (typeof data === "string") {
    return data.length > 80 ? data.slice(0, 80) + "..." : data;
  }

  if (typeof data === "number" || typeof data === "boolean") {
    return String(data);
  }

  if (Array.isArray(data)) {
    const items = data.slice(0, 2).map((item) =>
      typeof item === "string" ? item.slice(0, 30) : JSON.stringify(item)
    );
    const suffix = data.length > 2 ? ", ..." : "";
    return `Array[${data.length}]: [${items.join(", ")}${suffix}]`;
  }

  if (typeof data === "object") {
    const keys = Object.keys(data);
    // If it's an output map with a single key, show that value's preview
    if (keys.length === 1) {
      return formatPreview((data as Record<string, unknown>)[keys[0]]);
    }
    const preview = keys.slice(0, 2).join(", ");
    const suffix = keys.length > 2 ? ", ..." : "";
    return `{${preview}${suffix}}`;
  }

  return String(data);
}

export const DataPreview = memo(function DataPreview({
  nodeId,
}: {
  nodeId: string;
}) {
  const output = useExecutionStore((s) => s.nodeOutputs[nodeId]);
  const error = useExecutionStore((s) => s.nodeErrors[nodeId]);

  if (error) {
    return (
      <div className="mt-1 rounded bg-red-500/10 px-2 py-1 text-[10px] text-red-400 truncate">
        {error.slice(0, 60)}
      </div>
    );
  }

  if (output == null) return null;

  const text = formatPreview(output);
  if (!text) return null;

  return (
    <div className="mt-1 rounded bg-green-500/10 px-2 py-1 text-[10px] text-green-400 truncate">
      {text}
    </div>
  );
});
