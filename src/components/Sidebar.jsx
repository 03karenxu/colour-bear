import { ArrowLeftToLine, Forward } from "lucide-react";
import { useRef, useState } from "react";
import AnimatedLogo from "./AnimatedLogo";
import Button, { IconButton } from "./Button";
import ExportModal from "./ExportModal";
import SidebarImage from "./SidebarImage";
import SidebarControls from "./SidebarControls";
import SidebarAdjust from "./SidebarAdjust";

export default function Sidebar({ palette, isOpen, onCollapse }) {
  const fileInputRef = useRef(null);
  const [adjustOpen, setAdjustOpen] = useState(false);

  const exportButton = (className) => (
    <Button
      variant="primary"
      className={className}
      disabled={palette.colours.length === 0}
      popoverTarget="export-palette"
    >
      Export <Forward size={18} className="mobile:size-4" />
    </Button>
  );

  return (
    <aside
      inert={!isOpen}
      className={`mobile:contents desktop:flex desktop:justify-end desktop:overflow-hidden desktop:transition-[width] desktop:duration-300 desktop:ease-snappy ${isOpen ? "desktop:w-sidebar" : "desktop:w-0"}`}
    >
      <div className="mobile:contents desktop:flex desktop:flex-col desktop:gap-4 desktop:w-sidebar desktop:shrink-0 desktop:p-6 desktop:border-r border-line-light desktop:overflow-y-auto">
        <div className="mobile:sticky mobile:top-0 mobile:z-10 flex flex-col gap-4 mobile:p-4 mobile:bg-white mobile:border-b border-line-light">
          <header className="flex items-center justify-between h-8 mobile:h-9">
            <h1 className="flex items-center gap-2 font-logo text-2xl tracking-wider">
              <AnimatedLogo colours={palette.colours} />
              colour bear
            </h1>
            <IconButton
              label="Hide controls"
              icon={ArrowLeftToLine}
              className="mobile:hidden -mr-2"
              onClick={onCollapse}
            />
            {exportButton("desktop:hidden")}
          </header>
          <SidebarControls
            palette={palette}
            onNewImage={() => fileInputRef.current.click()}
            adjustOpen={adjustOpen}
            onToggleAdjust={() => setAdjustOpen(!adjustOpen)}
          />
        </div>

        <div className="flex flex-col gap-8 mobile:p-4 mobile:border-b border-line-light desktop:flex-1 desktop:min-h-0">
          {adjustOpen && (
            <SidebarAdjust palette={palette} className="desktop:-mt-1" />
          )}
          <SidebarImage
            onImageLoad={palette.loadImage}
            inputRef={fileInputRef}
            adjustments={palette.adjustments}
            picking={palette.pickingId !== null}
            onPick={palette.pick}
            onHoverColour={palette.setPreview}
            onCancelPick={palette.stopPicking}
          />
        </div>
        {exportButton("mobile:hidden")}
        <ExportModal colours={palette.colours} />
      </div>
    </aside>
  );
}
