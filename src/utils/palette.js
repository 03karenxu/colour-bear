import { hslToRgb, rgbToHsl } from "./colours.js";

const MAX_QUANTIZATION_DEPTH = 8;
const SAMPLE_EVERY_NTH_PIXEL = 4;
const SIMILAR_DISTANCE = 24;
const MIN_SHARE = 0.003;
const CHANNELS = ["r", "g", "b"];

const toRgbValues = (data) => {
  const values = [];
  for (let i = 0; i < data.length; i += 4 * SAMPLE_EVERY_NTH_PIXEL) {
    values.push({ r: data[i], g: data[i + 1], b: data[i + 2] });
  }
  return values;
};

const range = (values, channel) => {
  let min = 255;
  let max = 0;
  for (const value of values) {
    min = Math.min(min, value[channel]);
    max = Math.max(max, value[channel]);
  }
  return max - min;
};

const average = (values) =>
  Object.fromEntries(
    CHANNELS.map((channel) => [
      channel,
      Math.round(
        values.reduce((sum, value) => sum + value[channel], 0) / values.length,
      ),
    ]),
  );

const quantize = (values, depth = 0) => {
  if (values.length === 0) return [];
  if (depth >= MAX_QUANTIZATION_DEPTH || values.length === 1) {
    return [{ ...average(values), count: values.length }];
  }

  const ranges = CHANNELS.map((channel) => range(values, channel));
  const channel = CHANNELS[ranges.indexOf(Math.max(...ranges))];
  values.sort((a, b) => b[channel] - a[channel]);
  const mid = Math.floor(values.length / 2);

  return [
    ...quantize(values.slice(0, mid), depth + 1),
    ...quantize(values.slice(mid), depth + 1),
  ];
};

const distance = (a, b) =>
  (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2;

const isSimilar = (a, b) => distance(a, b) < SIMILAR_DISTANCE ** 2;

const mergeSimilar = (buckets) => {
  const groups = [];
  for (const bucket of buckets.sort((a, b) => b.count - a.count)) {
    const group = groups.find((g) => isSimilar(g, bucket));
    if (group) group.count += bucket.count;
    else groups.push({ ...bucket });
  }
  return groups;
};

export const extractPool = (data) => {
  const values = toRgbValues(data);
  return mergeSimilar(quantize(values))
    .filter((group) => group.count >= MIN_SHARE * values.length)
    .map(({ r, g, b }) => ({ r, g, b }));
};

export const pickColours = (pool, taken, count) => {
  const takenRgb = taken.map(hslToRgb);
  const available = pool.filter(
    (colour) => !takenRgb.some((t) => isSimilar(colour, t)),
  );
  const picked = [];
  while (picked.length < count && available.length > 0) {
    const [next] = available.splice(
      Math.floor(Math.random() * available.length),
      1,
    );
    picked.push(next);
  }
  return picked.map(rgbToHsl);
};
