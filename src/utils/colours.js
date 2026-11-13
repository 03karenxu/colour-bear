const LIGHT_LUMINANCE_THRESHOLD = 0.179;
const TEMPERATURE_STRENGTH = 0.5;

const unitRgbToHsl = (r, g, b) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;
  if (delta === 0) return [0, 0, l];

  const s = delta / (1 - Math.abs(2 * l - 1));
  let h;
  if (max === r) h = ((g - b) / delta) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h *= 60;
  return [h < 0 ? h + 360 : h, s, l];
};

const hslToUnitRgb = (h, s, l) => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let rgb;
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return rgb.map((value) => value + m);
};

export const rgbToHsl = ({ r, g, b }) => {
  const [h, s, l] = unitRgbToHsl(r / 255, g / 255, b / 255);
  return {
    h: Math.round(h) % 360,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

export const hslToRgb = ({ h, s, l }) => {
  const [r, g, b] = hslToUnitRgb(h, s / 100, l / 100);
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

export const hslToHex = (hsl) => {
  const { r, g, b } = hslToRgb(hsl);
  const toHex = (value) => value.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

const getRelativeLuminance = ({ r, g, b }) => {
  const linearize = (value) => {
    value /= 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
};

export const isLight = (hsl) =>
  getRelativeLuminance(hslToRgb(hsl)) > LIGHT_LUMINANCE_THRESHOLD;

const scale = (value, amount) =>
  amount > 0 ? value + (1 - value) * amount : value * (1 + amount);

export const adjustPixels = (
  data,
  { h: hueShift, s: saturation, l: lightness, temperature },
) => {
  const warmth = temperature * TEMPERATURE_STRENGTH;
  for (let i = 0; i < data.length; i += 4) {
    const [h, s, l] = unitRgbToHsl(
      data[i] / 255,
      data[i + 1] / 255,
      data[i + 2] / 255,
    );
    const [r, g, b] = hslToUnitRgb(
      (h + hueShift + 360) % 360,
      scale(s, saturation / 100),
      scale(l, lightness / 100),
    );
    data[i] = r * 255 + warmth;
    data[i + 1] = g * 255;
    data[i + 2] = b * 255 - warmth;
  }
};

export const adjustHsl = (hsl, adjustments) => {
  const { r, g, b } = hslToRgb(hsl);
  const data = new Uint8ClampedArray([r, g, b, 255]);
  adjustPixels(data, adjustments);
  return rgbToHsl({ r: data[0], g: data[1], b: data[2] });
};

export const hexToHsl = (hex) => {
  const value = parseInt(hex.replace("#", ""), 16);
  return rgbToHsl({ r: value >> 16, g: (value >> 8) & 255, b: value & 255 });
};

export const hslToHsv = ({ h, s, l }) => {
  s /= 100;
  l /= 100;
  const v = l + s * Math.min(l, 1 - l);
  return { h, s: v === 0 ? 0 : 2 * (1 - l / v), v };
};

export const hsvToHsl = ({ h, s, v }) => {
  const l = v * (1 - s / 2);
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
  return { h: Math.round(h), s: Math.round(sl * 100), l: Math.round(l * 100) };
};
