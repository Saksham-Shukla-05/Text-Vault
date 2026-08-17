const WIDTH = 1080;
const HEIGHT = 1920;
const FONT_STACK = "ui-sans-serif, system-ui, -apple-system, sans-serif";
const BRAND = "#4f46e5";
const INK = "#18181b";
const MUTED = "#71717a";
const HAIRLINE = "#e4e4e7";

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Finds the largest font size (within bounds) whose wrapped text fits maxLines. */
function fitMessage(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
) {
  let fontSize = 76;
  const minFontSize = 40;

  while (fontSize > minFontSize) {
    ctx.font = `700 ${fontSize}px ${FONT_STACK}`;
    const lines = wrapText(ctx, text, maxWidth);
    if (lines.length <= maxLines) {
      return { fontSize, lines };
    }
    fontSize -= 4;
  }

  ctx.font = `700 ${minFontSize}px ${FONT_STACK}`;
  return { fontSize: minFontSize, lines: wrapText(ctx, text, maxWidth) };
}

/**
 * Renders a message onto a portrait, Instagram Story-sized (1080x1920)
 * branded card and resolves with a PNG Blob ready to share or download.
 */
export function generateShareImage(
  content: string,
  username: string,
  origin: string
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error("Canvas not supported"));

  const marginX = 96;
  const contentWidth = WIDTH - marginX * 2;

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Logo mark
  const logoSize = 72;
  const logoY = 140;
  ctx.fillStyle = BRAND;
  roundRect(ctx, marginX, logoY, logoSize, logoSize, 18);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 40px ${FONT_STACK}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("T", marginX + logoSize / 2, logoY + logoSize / 2 + 2);

  ctx.fillStyle = INK;
  ctx.font = `600 40px ${FONT_STACK}`;
  ctx.textAlign = "left";
  ctx.fillText("Text Vault", marginX + logoSize + 24, logoY + logoSize / 2);

  // Large quote mark
  ctx.fillStyle = `${BRAND}33`;
  ctx.font = `800 180px Georgia, serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("“", marginX - 12, 460);

  // Message, vertically centered in the middle band
  const { fontSize, lines } = fitMessage(ctx, content, contentWidth, 8);
  const lineHeight = fontSize * 1.28;
  const blockHeight = lines.length * lineHeight;
  const centerY = HEIGHT / 2 + 40;
  const startY = centerY - blockHeight / 2 + lineHeight / 2;

  ctx.fillStyle = INK;
  ctx.font = `700 ${fontSize}px ${FONT_STACK}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  lines.forEach((line, i) => {
    ctx.fillText(line, marginX, startY + i * lineHeight);
  });

  // Footer: divider + CTA
  const footerY = HEIGHT - 260;
  ctx.strokeStyle = HAIRLINE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(marginX, footerY);
  ctx.lineTo(WIDTH - marginX, footerY);
  ctx.stroke();

  ctx.fillStyle = MUTED;
  ctx.font = `500 32px ${FONT_STACK}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("Someone sent me this anonymously", marginX, footerY + 64);

  ctx.fillStyle = BRAND;
  ctx.font = `700 40px ${FONT_STACK}`;
  ctx.fillText(
    `Send yours → ${origin.replace(/^https?:\/\//, "")}/u/${username}`,
    marginX,
    footerY + 118
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to generate image"));
    }, "image/png");
  });
}
