interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function NumberField({ label, value, onChange }: NumberFieldProps) {
  return (
    <div>
      <label className="mb-0.5 block text-[10px] text-text-secondary">
        {label}
      </label>
      <input
        type="number"
        className="w-full rounded border border-panel-border bg-canvas-bg px-2 py-1 text-xs text-text-primary focus:border-accent focus:outline-none"
        value={value}
        onChange={(e) => {
          const parsed = parseFloat(e.target.value);
          onChange(Number.isNaN(parsed) ? 0 : parsed);
        }}
      />
    </div>
  );
}
