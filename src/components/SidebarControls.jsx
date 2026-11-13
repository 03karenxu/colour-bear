import {
  ImagePlus,
  RefreshCw,
  Redo,
  SlidersHorizontal,
  SwatchBook,
  Undo,
} from "lucide-react";
import { IconButton } from "./Button";

export default function SidebarControls({
  palette,
  onNewImage,
  adjustOpen,
  onToggleAdjust,
}) {
  const { hasImage } = palette;
  return (
    <div className="flex flex-col desktop:flex-row items-center gap-1 self-stretch desktop:mt-1">
      <IconButton
        label="New image"
        icon={ImagePlus}
        className="desktop:-ml-2"
        onClick={onNewImage}
        disabled={!hasImage}
      />
      <IconButton
        label="Regenerate colours"
        icon={RefreshCw}
        onClick={palette.regenerate}
        disabled={!hasImage}
      />
      <IconButton
        label="Tailwind shades"
        icon={SwatchBook}
        onClick={palette.toggleAllShades}
        disabled={!hasImage}
        active={palette.allShaded}
      />
      <IconButton
        label="Adjust"
        icon={SlidersHorizontal}
        onClick={onToggleAdjust}
        disabled={!hasImage}
        active={adjustOpen}
      />
      <IconButton
        label="Undo"
        icon={Undo}
        className="mobile:mt-auto desktop:ml-auto"
        onClick={palette.undo}
        disabled={!palette.canUndo}
      />
      <IconButton
        label="Redo"
        icon={Redo}
        className="desktop:-mr-2"
        onClick={palette.redo}
        disabled={!palette.canRedo}
      />
    </div>
  );
}
