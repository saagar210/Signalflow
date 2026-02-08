interface SelectFieldProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

export function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <div>
      <label className="mb-0.5 block text-[10px] text-text-secondary">
        {label}
      </label>
      <select
        className="w-full rounded border border-panel-border bg-canvas-bg px-2 py-1 text-xs text-text-primary focus:border-accent focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
