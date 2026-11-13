import { GetColorName } from "hex-color-to-color-name";
import { Lock, Astroid } from "lucide-react";
import { useState } from "react";
import { hslToHex, isLight } from "../utils/colours";
import { generateShades } from "../utils/shades";
import HexCopy from "./HexCopy";
import SwatchToolbar from "./SwatchToolbar";

// determines text colour (white or black) from background
const textOn = (hsl) =>
  isLight(hsl) ? "var(--color-black)" : "var(--color-white)";

export default function Swatch({ colour, palette, onTogglePicking }) {
  const [isEditing, setIsEditing] = useState(false);
  const isPicking = palette.pickingId === colour.id;
  const shades = colour.shaded && generateShades(colour.hsl);
  const hex = hslToHex(colour.hsl);

  return (
    <div
      data-active={isPicking || isEditing || undefined}
      className="group grid grid-cols-[1fr_auto] content-start desktop:flex desktop:flex-col flex-1 min-w-0 mobile:min-h-28 overflow-hidden transition-[flex-grow,background-color] duration-500 ease-snappy desktop:hover:grow-2 desktop:data-active:grow-2"
      style={{ backgroundColor: hex, color: textOn(colour.hsl) }}
    >
      <SwatchToolbar
        colour={colour}
        palette={palette}
        isPicking={isPicking}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onTogglePicking={onTogglePicking}
        className="col-start-2 row-start-1 self-start desktop:self-center p-2 desktop:opacity-0 desktop:group-hover:opacity-100 desktop:group-data-active:opacity-100 transition-opacity duration-300"
      />

      {shades && (
        <div className="col-span-2 row-start-2 flex desktop:flex-col rounded-lg overflow-hidden mobile:h-16 desktop:flex-1 desktop:min-h-0 mx-4 desktop:mx-6 mobile:mb-4">
          {shades.map(({ shade, hsl }) => (
            <div
              key={shade}
              className="group/shade flex-1 flex items-center justify-between min-w-0 desktop:min-h-0 desktop:px-4 text-xs leading-none overflow-hidden transition-colors duration-500"
              style={{ backgroundColor: hslToHex(hsl), color: textOn(hsl) }}
            >
              <span className="mobile:hidden opacity-0 group-hover/shade:opacity-70 transition-opacity duration-150">
                {shade}
              </span>
              <HexCopy hex={hslToHex(hsl)} variant="secondary" />
            </div>
          ))}
        </div>
      )}

      <div className="col-start-1 row-start-1 flex flex-col mobile:flex-col-reverse desktop:gap-1 min-w-0 p-4 desktop:p-6 mobile:pt-2 desktop:mt-auto">
        <span className="text-sm font-semibold opacity-70 truncate">
          {GetColorName(hex)}
        </span>
        <div className="flex items-center gap-2 mobile:h-9">
          <HexCopy hex={hex} />
          <span className="flex items-center gap-1 opacity-60 desktop:ml-auto mr-1">
            {colour.locked && <Lock size={18} />}
            {colour.custom && (
              <span title="Custom colour">
                <Astroid size={18} />
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
