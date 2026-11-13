import logoUrl from "../assets/logo.svg";
import { hslToHex } from "../utils/colours";

export default function AnimatedLogo({ colours }) {
  return (
    <span
      className="relative h-7 aspect-531/439 bg-black"
      style={{ mask: `url(${logoUrl}) center / contain no-repeat` }}
    >
      <span className="absolute -inset-2">
        <span className="flex w-max min-w-[200%] h-full blur-sm animate-scroll">
          {[...colours, ...colours].map((colour, i) => (
            <span
              key={i}
              className="flex-1 min-w-6 transition-colors duration-300"
              style={{ backgroundColor: hslToHex(colour.hsl) }}
            />
          ))}
        </span>
      </span>
    </span>
  );
}
