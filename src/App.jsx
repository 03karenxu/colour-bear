import { ArrowRightToLine } from "lucide-react";
import { useState } from "react";
import { EdgeButton } from "./components/Button";
import Palette from "./components/Palette";
import Sidebar from "./components/Sidebar";
import usePalette from "./hooks/usePalette";

function App() {
  const palette = usePalette();
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <main className="flex flex-col desktop:flex-row min-h-dvh desktop:h-dvh">
      <Sidebar
        palette={palette}
        isOpen={panelOpen}
        onCollapse={() => setPanelOpen(false)}
      />
      {!panelOpen && (
        <EdgeButton
          label="Open sidebar"
          icon={ArrowRightToLine}
          onClick={() => setPanelOpen(true)}
          className="mobile:hidden pt-6 border-r border-line-light"
        />
      )}
      <Palette
        palette={palette}
        onTogglePicking={(id) => {
          setPanelOpen(true);
          palette.togglePicking(id);
        }}
      />
    </main>
  );
}

export default App;
