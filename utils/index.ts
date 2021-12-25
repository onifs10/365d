export * from "./load";
export * from "./stringify";
export * from "./vector";
export * from "./canvas";

export function shuffle<T>(arr: T[]): T[] {
  const array = arr.slice(0);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
export function range(to: number) {
  return new Array(to).fill(0).map((_, i) => i);
}
export function random(max = 1, min = 0) {
  return Math.random() * (max - min) + min;
}
export function hslToRgb(
  h: number,
  s: number,
  l: number
): [number, number, number] {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export const clamp = (num: number, a: number, b: number) =>
  Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));

export const timestamp = () => {
  return Date.now();
};
