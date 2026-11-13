import useCopy from "../hooks/useCopy";
import CopyStatusIcon from "./CopyStatusIcon";

const HEX_COPY_VARIANTS = {
  primary: {
    button: "font-semibold",
    icon: "desktop:opacity-0 desktop:group-hover/copy:opacity-100",
  },
  secondary: {
    button:
      "mobile:hidden opacity-0 group-hover/shade:opacity-70 transition-opacity duration-150",
    icon: "",
  },
};

export default function HexCopy({ hex, variant = "primary" }) {
  const [copied, copy] = useCopy();
  const classes = HEX_COPY_VARIANTS[variant];
  return (
    <button
      onClick={() => copy(hex)}
      className={`group/copy flex items-center gap-2 tracking-wide tabular-nums cursor-pointer ${classes.button}`}
    >
      {hex.slice(1)}
      <CopyStatusIcon copied={copied} className={classes.icon} />
    </button>
  );
}
