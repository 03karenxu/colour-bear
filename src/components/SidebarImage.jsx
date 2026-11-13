import { useEffect, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { adjustPixels, rgbToHsl } from "../utils/colours";

const MAX_INPUT_DIMENSION = 600;

export default function SidebarImage({
  onImageLoad,
  inputRef,
  adjustments,
  picking,
  onPick,
  onHoverColour,
  onCancelPick,
}) {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const originalRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [failed, setFailed] = useState(false);

  // get hsl of the current pixel
  function pixelAt(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scale = Math.max(
      canvas.width / rect.width,
      canvas.height / rect.height,
    );
    const x = Math.floor(
      (e.clientX - rect.left - rect.width / 2) * scale + canvas.width / 2,
    );
    const y = Math.floor(
      (e.clientY - rect.top - rect.height / 2) * scale + canvas.height / 2,
    );
    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return null;
    const i = (y * canvas.width + x) * 4;
    const { data } = originalRef.current;
    return rgbToHsl({ r: data[i], g: data[i + 1], b: data[i + 2] });
  }

  // cancel colour picking if user clicks outside of the image container
  useEffect(() => {
    if (!picking) return;
    function handlePointerDown(e) {
      if (!boxRef.current.contains(e.target)) onCancelPick();
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [picking, onCancelPick]);

  // redraw image with user's adjustments
  useEffect(() => {
    const original = originalRef.current;
    if (!original) return;
    const data = new Uint8ClampedArray(original.data);
    adjustPixels(data, adjustments);
    canvasRef.current
      .getContext("2d")
      .putImageData(new ImageData(data, original.width, original.height), 0, 0);
  }, [adjustments]);

  async function handleFile(file) {
    if (!file) return;
    try {
      const img = await createImageBitmap(file);
      const canvas = canvasRef.current;
      const scale = Math.min(
        1,
        MAX_INPUT_DIMENSION / Math.max(img.width, img.height),
      );
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      originalRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      onImageLoad(originalRef.current.data);
      setHasImage(true);
      setFailed(false);
    } catch (error) {
      console.error(error);
      setFailed(true);
    }
  }

  let boxColours = "border-transparent";
  if (dragging || picking) {
    boxColours = "border-neutral-500";
  } else if (!hasImage) {
    boxColours = "border-neutral-300 hover:border-neutral-500";
  }

  return (
    <div
      ref={boxRef}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
      className={`relative flex-1 min-h-100 desktop:min-h-0 bg-surface rounded-lg overflow-hidden border border-dashed transition-colors ${boxColours}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files[0]);
          e.target.value = ""; // reset even if same image is chosen again
        }}
      />

      <canvas
        ref={canvasRef}
        onClick={(e) => {
          const hsl = pixelAt(e);
          if (picking && hsl) onPick(hsl);
        }}
        onPointerMove={(e) => picking && onHoverColour(pixelAt(e))}
        onPointerLeave={() => picking && onHoverColour(null)}
        className={`absolute inset-0 size-full object-contain ${picking ? "cursor-crosshair" : ""}`}
      />

      {!hasImage && (
        <button
          className="absolute inset-0 flex flex-col gap-2 items-center justify-center text-sm text-neutral-500 hover:text-black transition-colors"
          onClick={() => inputRef.current.click()}
        >
          <ImagePlus size={28} />
          Browse or drop an image
        </button>
      )}

      <button
        onClick={() => setFailed(false)}
        title="Dismiss"
        className={`absolute inset-x-0 bottom-4 mx-auto w-fit px-3 py-2 rounded-lg backdrop-blur-xs shadow-sm bg-red-700/80 border border-white/40 text-sm font-semibold text-white cursor-pointer transition-[opacity,translate,visibility] duration-300 ease-snappy ${failed ? "visible" : "invisible opacity-0 translate-y-2"}`}
      >
        Couldn't load that image
      </button>
    </div>
  );
}
