import Slider from "./Slider";

export default function SidebarAdjust({ palette }) {
  const { adjustments, hasImage } = palette;
  return (
    <div className="flex flex-col gap-4 mb-2">
      {[
        { key: "h", type: "hue", min: -180, max: 180 },
        { key: "s", type: "saturation", min: -100, max: 100 },
        { key: "l", type: "lightness", min: -100, max: 100 },
        { key: "temperature", type: "temperature" },
      ].map(({ key, type, min, max }) => (
        <Slider
          key={key}
          type={type}
          hue={adjustments.h}
          min={min}
          max={max}
          value={adjustments[key]}
          defaultValue={0}
          disabled={!hasImage}
          onChange={(next) =>
            palette.updateAdjustments({ ...adjustments, [key]: next })
          }
        />
      ))}
    </div>
  );
}
