import { useEffect, useState, useCallback } from "react";
import { checkOllama, listModels } from "../../../lib/tauri";
import { RefreshCw } from "lucide-react";

interface ModelSelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelectField({ label, value, onChange }: ModelSelectFieldProps) {
  const [models, setModels] = useState<string[]>([]);
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchModels = useCallback(async () => {
    setLoading(true);
    try {
      const status = await checkOllama();
      setAvailable(status.available);
      if (status.available) {
        const modelList = await listModels();
        setModels(modelList.map((m) => m.name));
      }
    } catch {
      setAvailable(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  if (!available) {
    return (
      <div>
        <label className="mb-0.5 block text-[10px] text-text-secondary">
          {label}
        </label>
        <div className="flex items-center gap-2 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1.5">
          <span className="text-[10px] text-amber-400">
            Ollama not available
          </span>
          <button
            onClick={fetchModels}
            className="ml-auto text-amber-400 hover:text-amber-300"
            aria-label="Retry connection"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="mb-0.5 flex items-center justify-between text-[10px] text-text-secondary">
        <span>{label}</span>
        <button
          onClick={fetchModels}
          className="text-text-secondary hover:text-text-primary"
          aria-label="Refresh models"
          disabled={loading}
        >
          <RefreshCw size={10} className={loading ? "animate-spin" : ""} />
        </button>
      </label>
      <select
        className="w-full rounded border border-panel-border bg-canvas-bg px-2 py-1 text-xs text-text-primary focus:border-accent focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {models.length === 0 && (
          <option value={value}>{value || "No models found"}</option>
        )}
        {models.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
}
