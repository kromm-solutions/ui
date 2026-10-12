import type { SignaturePoint } from "./types";

export function getCanvasPoint(
  event: PointerEvent,
  canvas: HTMLCanvasElement
): SignaturePoint {
  const rect = canvas.getBoundingClientRect();

  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  return {
    pressure: event.pressure || undefined,
    timestamp: event.timeStamp,
    x: clamp(x),
    y: clamp(y),
  };
}

export function distance(
  first: SignaturePoint,
  second: SignaturePoint
): number {
  const dx = first.x - second.x;
  const dy = first.y - second.y;

  return Math.sqrt(dx * dx + dy * dy);
}

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}
