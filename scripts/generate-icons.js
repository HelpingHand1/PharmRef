const fs = require("fs");
const path = require("path");

const size = 512;
const pixels = [];

function setPixel(x, y, color) {
  const idx = (y * size + x) * 3;
  pixels[idx] = color[0];
  pixels[idx + 1] = color[1];
  pixels[idx + 2] = color[2];
}

function insideRoundedRect(x, y, left, top, width, height, radius) {
  const right = left + width;
  const bottom = top + height;

  if (x >= left + radius && x < right - radius && y >= top && y < bottom) return true;
  if (x >= left && x < right && y >= top + radius && y < bottom - radius) return true;

  const corners = [
    [left + radius, top + radius],
    [right - radius - 1, top + radius],
    [left + radius, bottom - radius - 1],
    [right - radius - 1, bottom - radius - 1],
  ];

  return corners.some(([cx, cy]) => {
    const dx = x - cx;
    const dy = y - cy;
    return dx * dx + dy * dy <= radius * radius;
  });
}

function insideCircle(x, y, cx, cy, radius) {
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= radius * radius;
}

const bg = [15, 37, 57];
const bgAlt = [15, 118, 110];
const cyan = [125, 211, 252];
const white = [241, 245, 249];
const slate = [203, 213, 225];
const amber = [245, 158, 11];

for (let y = 0; y < size; y += 1) {
  for (let x = 0; x < size; x += 1) {
    const blend = (x + y) / (size * 2);
    setPixel(x, y, [
      Math.round(bg[0] * (1 - blend) + bgAlt[0] * blend),
      Math.round(bg[1] * (1 - blend) + bgAlt[1] * blend),
      Math.round(bg[2] * (1 - blend) + bgAlt[2] * blend),
    ]);
  }
}

for (let y = 0; y < size; y += 1) {
  for (let x = 0; x < size; x += 1) {
    if (!insideRoundedRect(x, y, 24, 24, 464, 464, 112)) {
      setPixel(x, y, [255, 255, 255]);
      continue;
    }

    if (insideRoundedRect(x, y, 234, 112, 44, 208, 22) || insideRoundedRect(x, y, 152, 194, 208, 44, 22)) {
      setPixel(x, y, cyan);
    }
  }
}

for (let y = 0; y < size; y += 1) {
  for (let x = 0; x < size; x += 1) {
    const rx = x - 256;
    const ry = y - 340;
    const angle = (-28 * Math.PI) / 180;
    const unrotX = Math.cos(-angle) * rx - Math.sin(-angle) * ry + 256;
    const unrotY = Math.sin(-angle) * rx + Math.cos(-angle) * ry + 340;

    const inCapsule =
      (unrotX >= 152 && unrotX < 360 && unrotY >= 302 && unrotY < 378) ||
      insideCircle(unrotX, unrotY, 152, 340, 38) ||
      insideCircle(unrotX, unrotY, 360, 340, 38);

    if (!inCapsule) continue;

    if (unrotX >= 256) {
      setPixel(x, y, amber);
    } else if (Math.abs(unrotX - 256) <= 6) {
      setPixel(x, y, [160, 174, 192]);
    } else if ((unrotX + unrotY) % 9 === 0) {
      setPixel(x, y, slate);
    } else {
      setPixel(x, y, white);
    }
  }
}

let ppm = `P3\n${size} ${size}\n255\n`;
for (let i = 0; i < pixels.length; i += 3) {
  ppm += `${pixels[i]} ${pixels[i + 1]} ${pixels[i + 2]}\n`;
}

const outPath = path.resolve(__dirname, "..", "public", "pharmref-icon.ppm");
fs.writeFileSync(outPath, ppm);
console.log(`Wrote ${path.relative(process.cwd(), outPath)}`);
