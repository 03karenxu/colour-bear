import { RotateCcw } from "lucide-react";
import { IconButton } from "./Button";
import CommitInput from "./CommitInput";

const TYPES = {
  hue: {
    label: "Hue",
    min: 0,
    max: 360,
    track: ({ min }) =>
      `linear-gradient(to right, ${[0, 1, 2, 3, 4, 5, 6]
        .map((i) => `hsl(${min + i * 60} 90% 55%)`)
        .join(", ")})`,
  },
  saturation: {
    label: "Saturation",
    min: 0,
    max: 100,
    track: ({ hue }) =>
      `linear-gradient(to right, hsl(${hue} 0% 55%), hsl(${hue} 100% 55%))`,
  },
  lightness: {
    label: "Lightness",
    min: 0,
    max: 100,
    track: () => "linear-gradient(to right, #000, #fff)",
  },
  temperature: {
    label: "Temperature",
    min: -100,
    max: 100,
    track: () =>
      "linear-gradient(to right, hsl(210 80% 60%), hsl(0 0% 90%), hsl(35 90% 55%))",
  },
};

export default function Slider({
  type,
  hue,
  value,
  min = TYPES[type].min,
  max = TYPES[type].max,
  disabled,
  defaultValue,
  onChange,
}) {
  const { label, track } = TYPES[type];

  function parse(text) {
    const number = Math.round(Number(text));
    if (text.trim() === "" || isNaN(number)) return null;
    return Math.min(max, Math.max(min, number));
  }

  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex items-baseline justify-between">
        <span>{label}</span>
        <div className="flex items-center gap-2">
          <CommitInput
            inputMode="numeric"
            savedValue={value}
            disabled={disabled}
            parse={parse}
            onCommit={onChange}
            className="w-11 text-right"
          />
          <IconButton
            label={`Reset ${label}`}
            icon={RotateCcw}
            className="-my-0.5 -mr-2"
            disabled={disabled || value === defaultValue}
            onClick={() => onChange(defaultValue)}
          />
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider h-1"
        style={{ background: track({ min, hue }) }}
      />
    </div>
  );
}
