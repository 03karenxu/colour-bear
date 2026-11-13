import { Lock, LockOpen, Pencil, Shuffle, SwatchBook, X } from "lucide-react";
import { useRef } from "react";
import { IconButton } from "./Button";
import SwatchEditor from "./SwatchEditor";

export default function SwatchToolbar({
  colour,
  palette,
  isPicking,
  isEditing,
  setIsEditing,
  onTogglePicking,
  className,
}) {
  const editPopoverRef = useRef(null);
  const { id, locked } = colour;
  const canRemove = !locked && palette.colours.length > 1;
  const anchor = `--edit-${id}`;

  return (
    <div className={`flex items-center ${className}`}>
      <IconButton
        label={locked ? "Unlock" : "Lock"}
        icon={locked ? Lock : LockOpen}
        active={locked}
        onClick={() => palette.toggleLock(id)}
      />
      <IconButton
        label="Shuffle"
        icon={Shuffle}
        disabled={locked}
        onClick={() => palette.shuffleColour(id)}
      />
      <IconButton
        label="Edit"
        icon={Pencil}
        active={isEditing}
        popoverTarget={`edit-${id}`}
        style={{ anchorName: anchor }}
      />
      <IconButton
        label="Tailwind shades"
        icon={SwatchBook}
        active={colour.shaded}
        onClick={() => palette.toggleShades(id)}
      />
      <IconButton
        label="Remove"
        icon={X}
        disabled={!canRemove}
        onClick={() => palette.removeColour(id)}
      />
      <div
        ref={editPopoverRef}
        id={`edit-${id}`}
        popover="auto"
        onBeforeToggle={(e) => setIsEditing(e.newState === "open")}
        style={{ positionAnchor: anchor }}
        className="edit-popover p-6 pb-7 rounded-xl bg-white border border-line-light shadow-sm"
      >
        {isEditing && (
          <SwatchEditor
            colour={colour.hsl}
            onChange={(hsl) => palette.editColour(id, hsl)}
            isPicking={isPicking}
            onPickFromImage={() => {
              editPopoverRef.current.hidePopover();
              onTogglePicking();
            }}
          />
        )}
      </div>
    </div>
  );
}
