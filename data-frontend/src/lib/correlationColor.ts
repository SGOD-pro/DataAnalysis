export function correlationColor(value: number) {
  // Clamp between -1 and 1
  value = Math.max(-1, Math.min(1, value));

  // Map [-1, 1] to [0, 1]
  const t = (value + 1) / 2;

  // Aurora-based gradient
  const colors = [
    [58, 41, 255],   // -1: Deep Aurora Blue (#3A29FF)
    [200, 200, 255], // -0.5: Light bluish-white
    [255, 255, 255], // 0: White
    [255, 200, 200], // 0.5: Light reddish-white
    [255, 50, 50]    // +1: Bright Aurora Red (#FF3232)
  ];

  // Interpolate
  const steps = colors.length - 1;
  const idx = Math.floor(t * steps);
  const frac = t * steps - idx;

  const c1 = colors[idx];
  const c2 = colors[Math.min(idx + 1, steps)];

  const r = Math.round(c1[0] + (c2[0] - c1[0]) * frac);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * frac);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * frac);

  return `rgb(${r}, ${g}, ${b})`;
}
