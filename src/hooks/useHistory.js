import { useState, useRef } from "react";

const MERGE_CHANGES_WITHIN_MS = 500;

const resolve = (update, state) =>
  typeof update === "function" ? update(state) : update;

export default function useHistory(initial) {
  const lastChange = useRef(0);
  const [history, setHistory] = useState({
    past: [],
    present: initial,
    future: [],
  });

  function set(update) {
    const now = Date.now();
    const isNewStep = now - lastChange.current >= MERGE_CHANGES_WITHIN_MS;
    lastChange.current = now;
    setHistory((current) => ({
      past: isNewStep ? [...current.past, current.present] : current.past,
      present: resolve(update, current.present),
      future: [],
    }));
  }

  function undo() {
    lastChange.current = 0;
    setHistory((current) =>
      current.past.length
        ? {
            past: current.past.slice(0, -1),
            present: current.past.at(-1),
            future: [current.present, ...current.future],
          }
        : current,
    );
  }

  function redo() {
    lastChange.current = 0;
    setHistory((current) =>
      current.future.length
        ? {
            past: [...current.past, current.present],
            present: current.future[0],
            future: current.future.slice(1),
          }
        : current,
    );
  }

  function reset(state) {
    lastChange.current = 0;
    setHistory({ past: [], present: state, future: [] });
  }

  return {
    current: history.present,
    set,
    reset,
    undo,
    redo,
    canUndo: history.past.length !== 0,
    canRedo: history.future.length !== 0,
  };
}
