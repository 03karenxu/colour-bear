import { GetColorName } from "hex-color-to-color-name";
import { X } from "lucide-react";
import { useState } from "react";
import { hslToHex } from "../utils/colours";
import { generateShades } from "../utils/shades";
import useCopy from "../hooks/useCopy";
import Button, { IconButton } from "./Button";
import CopyStatusIcon from "./CopyStatusIcon";

const FORMATS = [
  { label: "CSS", wrapper: ":root", prefix: "--" },
  { label: "Tailwind", wrapper: "@theme", prefix: "--color-" },
];

export default function ExportModal({ colours }) {
  const [format, setFormat] = useState(FORMATS[0]);
  const [copied, copy] = useCopy();

  const name2Count = {};
  const lines = [];
  for (const colour of colours) {
    const hex = hslToHex(colour.hsl);
    const baseName = GetColorName(hex)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    name2Count[baseName] = (name2Count[baseName] ?? 0) + 1;
    const name =
      name2Count[baseName] > 1
        ? `${baseName}-${name2Count[baseName]}`
        : baseName;
    lines.push(`  ${format.prefix}${name}: ${hex};`);
    if (colour.shaded) {
      for (const { shade, hsl } of generateShades(colour.hsl)) {
        lines.push(`  ${format.prefix}${name}-${shade}: ${hslToHex(hsl)};`);
      }
    }
  }
  const code = `${format.wrapper} {\n${lines.join("\n")}\n}`;

  return (
    <div
      id="export-palette"
      popover="auto"
      className="m-auto p-0 rounded-xl bg-white border border-line-light shadow-sm backdrop:bg-black/30"
    >
      <div className="flex flex-col gap-4 w-md max-w-[calc(100vw-4rem)] p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Export palette</h2>
          <IconButton
            label="Close"
            icon={X}
            popoverTarget="export-palette"
            popoverTargetAction="hide"
          />
        </div>
        <div className="flex gap-1">
          {FORMATS.map((option) => (
            <Button
              key={option.label}
              active={option === format}
              onClick={() => setFormat(option)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <pre className="max-h-80 overflow-auto p-4 rounded-lg bg-surface text-sm leading-relaxed">
          {code}
        </pre>
        <Button variant="primary" autoFocus onClick={() => copy(code)}>
          Copy
          <CopyStatusIcon copied={copied} />
        </Button>
      </div>
    </div>
  );
}
