import { Plus } from "lucide-react";
import { EdgeButton } from "./Button";
import Swatch from "./Swatch";

export default function Palette({ palette, onTogglePicking }) {
  return (
    <div className="flex-1 flex mobile:flex-col desktop:flex-row min-w-0">
      {palette.colours.map((colour) => (
        <Swatch
          key={colour.id}
          colour={colour}
          palette={palette}
          onTogglePicking={() => onTogglePicking(colour.id)}
        />
      ))}
      {palette.canAdd && (
        <EdgeButton
          label="Add colour"
          icon={Plus}
          onClick={palette.addColour}
          className="items-center mobile:h-12 mobile:border-t desktop:border-l border-line-dark bg-black text-white"
        />
      )}
    </div>
  );
}
