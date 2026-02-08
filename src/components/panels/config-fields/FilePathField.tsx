import { open, save } from "@tauri-apps/plugin-dialog";
import { FolderOpen } from "lucide-react";

interface FilePathFieldProps {
  label: string;
  value: string;
  mode: "open" | "save";
  onChange: (value: string) => void;
}

export function FilePathField({ label, value, mode, onChange }: FilePathFieldProps) {
  const handleBrowse = async () => {
    try {
      if (mode === "open") {
        const result = await open({ multiple: false, directory: false });
        if (result) {
          onChange(result);
        }
      } else {
        const result = await save({});
        if (result) {
          onChange(result);
        }
      }
    } catch {
      // User cancelled dialog
    }
  };

  return (
    <div>
      <label className="mb-0.5 block text-[10px] text-text-secondary">
        {label}
      </label>
      <div className="flex gap-1">
        <input
          type="text"
          className="flex-1 rounded border border-panel-border bg-canvas-bg px-2 py-1 text-xs text-text-primary focus:border-accent focus:outline-none"
          value={value}
          placeholder="/path/to/file"
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          onClick={handleBrowse}
          className="shrink-0 rounded border border-panel-border bg-canvas-bg px-1.5 py-1 text-text-secondary hover:text-text-primary hover:bg-white/5"
          aria-label="Browse file"
        >
          <FolderOpen size={14} />
        </button>
      </div>
    </div>
  );
}
