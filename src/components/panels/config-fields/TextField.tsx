interface TextFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function TextField({ label, value, placeholder, onChange }: TextFieldProps) {
  return (
    <div>
      <label className="mb-0.5 block text-[10px] text-text-secondary">
        {label}
      </label>
      <input
        type="text"
        className="w-full rounded border border-panel-border bg-canvas-bg px-2 py-1 text-xs text-text-primary focus:border-accent focus:outline-none"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
