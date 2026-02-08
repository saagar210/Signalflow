interface TextareaFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  rows?: number;
  monospace?: boolean;
  onChange: (value: string) => void;
}

export function TextareaField({
  label,
  value,
  placeholder,
  rows = 3,
  monospace,
  onChange,
}: TextareaFieldProps) {
  return (
    <div>
      <label className="mb-0.5 block text-[10px] text-text-secondary">
        {label}
      </label>
      <textarea
        className={`w-full resize-none rounded border border-panel-border bg-canvas-bg px-2 py-1 text-xs text-text-primary focus:border-accent focus:outline-none ${monospace ? "font-mono" : ""}`}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
