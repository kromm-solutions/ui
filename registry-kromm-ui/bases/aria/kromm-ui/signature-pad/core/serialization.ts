import type {
  SignatureData,
  SignatureDataUrlOptions,
  SignatureSvgOptions,
} from "./types";

export function signatureToSVG(
  data: SignatureData,
  options: SignatureSvgOptions = {}
): string {
  const width = options.width ?? data.width;
  const height = options.height ?? data.height;

  const paths = data.strokes
    .filter((stroke) => stroke.points.length > 0)
    .map((stroke) => {
      const path = stroke.points
        .map((point, index) => {
          const x = point.x * width;
          const y = point.y * height;

          return `${index === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ");

      return `<path d="${path}" fill="none" />`;
    })
    .join("");

  const background = options.background
    ? `<rect width="100%" height="100%" fill="${options.background}" />`
    : "";

  return [
    `<svg`,
    `xmlns="http://www.w3.org/2000/svg"`,
    `width="${width}"`,
    `height="${height}"`,
    `viewBox="0 0 ${width} ${height}">`,
    background,
    paths,
    `</svg>`,
  ].join("");
}

export function signatureToDataURL(
  data: SignatureData,
  penColor: string,
  penWidth: number,
  options: SignatureDataUrlOptions = {}
): string | null {
  if (data.strokes.length === 0) {
    return null;
  }

  const canvas = document.createElement("canvas");

  canvas.width = data.width;
  canvas.height = data.height;

  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  context.lineCap = "round";
  context.lineJoin = "round";
  context.strokeStyle = penColor;
  context.lineWidth = penWidth;

  if (options.background) {
    context.fillStyle = options.background;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  for (const stroke of data.strokes) {
    if (stroke.points.length === 0) {
      continue;
    }

    context.beginPath();

    stroke.points.forEach((point, index) => {
      const x = point.x * canvas.width;
      const y = point.y * canvas.height;

      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });

    context.stroke();
  }

  return canvas.toDataURL(options.type ?? "image/png", options.quality ?? 0.92);
}
