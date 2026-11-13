import { Check, Copy } from "lucide-react";

export default function CopyStatusIcon({ copied, className = "" }) {
  return (
    <span className="grid shrink-0 *:col-start-1 *:row-start-1">
      <Copy
        size={18}
        className={`transition-opacity duration-150 ${copied ? "opacity-0" : className}`}
      />
      <Check
        size={18}
        className={`${copied ? "" : "opacity-0 translate-y-1"} transition-[opacity,translate] duration-150`}
      />
    </span>
  );
}
