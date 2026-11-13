import { Pipette } from "lucide-react";
import { useState } from "react";
import { hexToHsl, hslToHex, hslToHsv, hsvToHsl } from "../utils/colours";
import { IconButton } from "./Button";
import CommitInput from "./CommitInput";
import Slider from "./Slider";

const parseHex = (text) => {
  const hex = text.trim().replace(/^#?/, "#").toUpperCase();
  return /^#[0-9A-F]{6}$/.test(hex) ? hex : null;
};

const clamp = (n) => Math.min(1, Math.max(0, n));

function ColourSquare({ hsv, hex, onChange }) {
  function handlePointer(e) {
    if (e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    onChange({
      ...hsv,
      s: clamp((e.clientX - rect.left) / rect.width),
      v: clamp(1 - (e.clientY - rect.top) / rect.height),
    });
  }

  return (
    <div
      onPointerDown={handlePointer}
      onPointerMove={handlePointer}
      className="relative h-36 rounded-lg cursor-crosshair touch-none"
      style={{
        background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hsv.h} 100% 50%))`,
      }}
    >
      <div
        className="absolute size-4 -translate-1/2 rounded-full border-2 border-white ring-1 ring-black/20 pointer-events-none"
        style={{
          left: `${hsv.s * 100}%`,
          top: `${(1 - hsv.v) * 100}%`,
          backgroundColor: hex,
        }}
      />
    </div>
  );
}

export default function SwatchEditor({
  colour,
  onChange,
  isPicking,
  onPickFromImage,
}) {
  const [hsv, setHsv] = useState(() => hslToHsv(colour));
  const [original] = useState(colour);
  const hex = hslToHex(colour);

  function commit(hsl, nextHsv = hslToHsv(hsl)) {
    setHsv(nextHsv);
    onChange(hsl);
  }

  return (
    <div className="flex flex-col gap-4 w-50">
      <ColourSquare
        hsv={hsv}
        hex={hex}
        onChange={(next) => commit(hsvToHsl(next), next)}
      />
      <div className="flex items-center gap-2">
        <CommitInput
          placeholder="Hex"
          spellCheck={false}
          savedValue={hex}
          parse={parseHex}
          onCommit={(next) => commit(hexToHsl(next))}
          className="flex-1 min-w-0"
        />
        <IconButton
          label="Pick from image"
          icon={Pipette}
          className="-my-0.5 -mr-2"
          active={isPicking}
          onClick={onPickFromImage}
        />
      </div>
      {[
        { key: "h", type: "hue" },
        { key: "s", type: "saturation" },
        { key: "l", type: "lightness" },
      ].map(({ key, type }) => (
        <Slider
          key={key}
          type={type}
          hue={colour.h}
          value={colour[key]}
          defaultValue={original[key]}
          onChange={(next) => commit({ ...colour, [key]: next })}
        />
      ))}
    </div>
  );
}
