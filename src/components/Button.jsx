const VARIANTS = {
  primary: "bg-black text-white hover:bg-black/80",
  secondary: "text-current hover:bg-current/5",
};

export default function Button({
  children,
  variant = "secondary",
  active = false,
  square = false,
  className = "",
  ...props
}) {
  return (
    <button
      className={`flex items-center justify-center gap-2 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-100 disabled:opacity-40 disabled:pointer-events-none ${square ? "size-9" : "h-9 px-3"} ${VARIANTS[variant]} ${active ? "bg-current/15" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconButton({ label, icon: Icon, ...props }) {
  return (
    <Button square title={label} {...props}>
      <Icon size={18} />
    </Button>
  );
}

export function EdgeButton({ label, icon: Icon, className = "", ...props }) {
  return (
    <button
      title={label}
      className={`group flex justify-center overflow-hidden desktop:w-3 desktop:hover:w-14 cursor-pointer transition-[width] duration-300 ease-snappy ${className}`}
      {...props}
    >
      <Icon
        size={18}
        className="desktop:opacity-0 desktop:group-hover:opacity-100 transition-opacity duration-150 ease-snappy"
      />
    </button>
  );
}
