import { useState } from "react";

const COPY_DURATION_MS = 1500;

export default function useCopy() {
  const [copied, setCopied] = useState(false);

  function copy(text) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_DURATION_MS);
  }

  return [copied, copy];
}
