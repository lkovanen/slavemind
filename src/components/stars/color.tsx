type RGB = {
  r: number,
  g: number,
  b: number
};

const HSVtoRGB = (h: number, s: number, v: number): RGB => {
  let r = 0, g = 0, b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
    default: break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

const RGBtoColor = (color: RGB) => `rgb(${color.r}, ${color.g}, ${color.b})`;

export const HSVtoColor = (h: number, s: number, v: number): string => RGBtoColor(HSVtoRGB(h, s, v));