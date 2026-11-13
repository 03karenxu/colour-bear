import { useState } from "react";

export default function CommitInput({
  savedValue,
  parse,
  onCommit,
  className = "",
  ...props
}) {
  const [draft, setDraft] = useState(null);

  function submit() {
    const next = parse(draft);
    if (next !== null && next !== savedValue) onCommit(next);
    setDraft(null);
  }

  return (
    <input
      type="text"
      value={draft ?? savedValue}
      onFocus={(e) => {
        setDraft(String(savedValue));
        e.target.select();
      }}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={submit}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.target.blur();
      }}
      className={`h-8 px-2 rounded-md border border-line-light text-sm tabular-nums disabled:opacity-40 bg-white ${className}`}
      {...props}
    />
  );
}
