const SHADE_LIGHTNESS = {
  50: 97,
  100: 93,
  200: 85,
  300: 75,
  400: 65,
  500: 55,
  600: 45,
  700: 35,
  800: 25,
  900: 15,
  950: 8,
};

const LIGHTEST = SHADE_LIGHTNESS[50];
const DARKEST = SHADE_LIGHTNESS[950];

const fraction = (part, whole) => (whole === 0 ? 0 : part / whole);

const chromaOf = (s, l) => (1 - Math.abs((2 * l) / 100 - 1)) * s;

export const generateShades = ({ h, s, l }) => {
  const targets = Object.values(SHADE_LIGHTNESS);
  const distances = targets.map((target) => Math.abs(target - l));
  const anchor = targets[distances.indexOf(Math.min(...distances))];
  const top = Math.max(LIGHTEST, l);
  const bottom = Math.min(DARKEST, l);
  const lightnessAt = (target) =>
    target >= anchor
      ? l + fraction(target - anchor, LIGHTEST - anchor) * (top - l)
      : l - fraction(anchor - target, anchor - DARKEST) * (l - bottom);
  const chroma = chromaOf(s, l);

  return Object.keys(SHADE_LIGHTNESS).map((shade, i) => {
    const shadeL = lightnessAt(targets[i]);
    const room = chromaOf(100, shadeL);
    return {
      shade,
      hsl: {
        h,
        s: Math.round(Math.min(100, room ? (chroma / room) * 100 : 0)),
        l: Math.round(shadeL),
      },
    };
  });
};
