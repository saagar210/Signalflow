interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: SliderFieldProps) {
  return (
    <div>
      <label className="mb-0.5 flex items-center justify-between text-[10px] text-text-secondary">
        <span>{label}</span>
        <span className="font-mono text-text-primary">{value.toFixed(1)}</span>
      </label>
      <input
        type="range"
        className="w-full accent-accent"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}
