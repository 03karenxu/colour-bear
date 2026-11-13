import { useState } from "react";
import { adjustHsl } from "../utils/colours";
import { extractPool, pickColours } from "../utils/palette";
import useHistory from "./useHistory";

const MAX_COLOURS = 10;
const N_INITIAL_COLOURS = 6;

const INITIAL_STATE = {
  colours: [],
  adjustments: { h: 0, s: 0, l: 0, temperature: 0 },
};

const makeColour = (hsl) => ({
  id: crypto.randomUUID(),
  hsl,
  locked: false,
  shaded: false,
  custom: false,
});

const randomBetween = (min, max) =>
  min + Math.floor(Math.random() * (max - min + 1));

const randomHsl = () => ({
  h: randomBetween(0, 359),
  s: randomBetween(25, 75),
  l: randomBetween(25, 75),
});

export default function usePalette() {
  const history = useHistory(INITIAL_STATE);
  const { colours, adjustments } = history.current;
  const [pool, setPool] = useState([]);
  const [pickingId, setPickingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const hsls = colours.map((colour) => colour.hsl);

  const updateAllColours = (update) =>
    history.set((state) => ({ ...state, colours: update(state.colours) }));

  const updateSingleColour = (id, update) =>
    updateAllColours((current) =>
      current.map((colour) =>
        colour.id === id ? { ...colour, ...update(colour) } : colour,
      ),
    );

  function fillColours(taken, count) {
    const fromImage = pickColours(pool, taken, count).map(makeColour);
    const random = Array.from({ length: count - fromImage.length }, () => ({
      ...makeColour(randomHsl()),
      custom: true,
    }));
    return [...fromImage, ...random];
  }

  function loadImage(pixels) {
    const colourPool = extractPool(pixels);
    setPool(colourPool);
    history.reset({
      ...INITIAL_STATE,
      colours: pickColours(colourPool, [], N_INITIAL_COLOURS).map(makeColour),
    });
  }

  function addColour() {
    const [colour] = fillColours(hsls, 1);
    updateAllColours((current) => [...current, colour]);
  }

  function removeColour(id) {
    updateAllColours((current) => current.filter((colour) => colour.id !== id));
  }

  function shuffleColour(id) {
    const [{ hsl, custom }] = fillColours(hsls, 1);
    updateSingleColour(id, () => ({ hsl, custom }));
  }

  function editColour(id, hsl) {
    updateSingleColour(id, () => ({ hsl, custom: true }));
  }

  function regenerate() {
    const locked = colours.filter((colour) => colour.locked);
    const fresh = fillColours(
      locked.map((colour) => colour.hsl),
      colours.length - locked.length,
    );
    const next = colours.map((colour) =>
      colour.locked ? colour : fresh.shift(),
    );
    updateAllColours(() => next);
  }

  function toggle(id, key) {
    updateSingleColour(id, (colour) => ({ [key]: !colour[key] }));
  }

  const allShaded =
    colours.length > 0 && colours.every((colour) => colour.shaded);

  function toggleAllShades() {
    updateAllColours((current) =>
      current.map((colour) => ({ ...colour, shaded: !allShaded })),
    );
  }

  function updateAdjustments(next) {
    history.set((state) => ({ ...state, adjustments: next }));
  }

  function togglePicking(id) {
    setPickingId((current) => (current === id ? null : id));
    setPreview(null);
  }

  function stopPicking() {
    setPickingId(null);
    setPreview(null);
  }

  function pick(hsl) {
    updateSingleColour(pickingId, () => ({ hsl, custom: false }));
    setPickingId(null);
  }

  return {
    colours: colours.map((colour) => {
      if (colour.id === pickingId && preview) {
        return { ...colour, hsl: adjustHsl(preview, adjustments) };
      }
      return colour.custom
        ? colour
        : { ...colour, hsl: adjustHsl(colour.hsl, adjustments) };
    }),
    adjustments,
    canAdd: pool.length > 0 && colours.length < MAX_COLOURS,
    allShaded,
    hasImage: pool.length > 0,
    pickingId,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    undo: history.undo,
    redo: history.redo,
    loadImage,
    regenerate,
    updateAdjustments,
    addColour,
    removeColour,
    shuffleColour,
    editColour,
    toggleLock: (id) => toggle(id, "locked"),
    toggleShades: (id) => toggle(id, "shaded"),
    toggleAllShades,
    togglePicking,
    stopPicking,
    pick,
    setPreview,
  };
}
