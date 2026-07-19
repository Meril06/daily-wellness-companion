import NumberTicker from "./NumberTicker";

interface GlowSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  gradient?: string;
}

export default function GlowSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  gradient = "linear-gradient(90deg, #8b7dff, #4f8dff)",
}: GlowSliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        <span className="font-display text-lg font-semibold text-gradient-primary">
          <NumberTicker value={value} duration={0.35} />
          {unit}
        </span>
      </div>
      <div className="relative flex items-center">
        <div
          className="pointer-events-none absolute h-2 w-full rounded-full bg-base-700/80"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute h-2 rounded-full"
          style={{ width: `${pct}%`, background: gradient }}
          aria-hidden
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="glow-slider-input relative w-full appearance-none bg-transparent"
          aria-label={label}
        />
      </div>
      <style>{`
        .glow-slider-input {
          height: 24px;
        }
        .glow-slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(139,125,255,0.35), 0 0 16px 2px rgba(139,125,255,0.6);
          cursor: pointer;
          margin-top: -9px;
        }
        .glow-slider-input::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border: none;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(139,125,255,0.35), 0 0 16px 2px rgba(139,125,255,0.6);
          cursor: pointer;
        }
        .glow-slider-input::-webkit-slider-runnable-track {
          height: 2px;
          background: transparent;
        }
        .glow-slider-input::-moz-range-track {
          height: 2px;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
