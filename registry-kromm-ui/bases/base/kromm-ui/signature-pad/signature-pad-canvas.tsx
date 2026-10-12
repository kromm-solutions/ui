"use client";

import { cn } from "cn";
import * as React from "react";

import { distance, getCanvasPoint } from "./core/geometry";
import { useSignaturePad } from "./signature-pad-context";

export type SignaturePadCanvasProps = React.ComponentProps<"canvas">;

export function SignaturePadCanvas({
  className,
  style,
  "aria-label": ariaLabel = "Área para firmar",
  ...props
}: SignaturePadCanvasProps) {
  const { canvasRef, value, setValue, redraw, disabled, readOnly, pen } =
    useSignaturePad();

  const drawing = React.useRef(false);

  const currentStroke = React.useRef<ReturnType<typeof getCanvasPoint>[]>([]);

  const lastPoint = React.useRef<ReturnType<typeof getCanvasPoint> | null>(
    null
  );

  const animationFrame = React.useRef<number | null>(null);

  const drawSegment = React.useCallback((canvasEl: HTMLCanvasElement, from: ReturnType<typeof getCanvasPoint>, to: ReturnType<typeof getCanvasPoint>) => {
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;
    const rect = canvasEl.getBoundingClientRect();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = pen.color;
    ctx.lineWidth = pen.width;
    ctx.beginPath();
    ctx.moveTo(from.x * rect.width, from.y * rect.height);
    ctx.lineTo(to.x * rect.width, to.y * rect.height);
    ctx.stroke();
  }, [pen]);

  React.useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.max(1, Math.round(rect.width * dpr));

      canvas.height = Math.max(1, Math.round(rect.height * dpr));

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      redraw();
    };

    const observer = new ResizeObserver(resize);

    observer.observe(canvas);

    resize();

    return () => {
      observer.disconnect();
    };
  }, [canvasRef, redraw]);

  React.useEffect(() => {
    redraw();
  }, [value, redraw]);

  const commitStroke = React.useCallback(() => {
    const points = currentStroke.current;

    if (points.length === 0) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();

    setValue((previous) => ({
      height: rect.height,
      strokes: [
        ...(previous?.strokes ?? []),
        {
          points: [...points],
        },
      ],
      version: 1,
      width: rect.width,
    }));

    currentStroke.current = [];
    lastPoint.current = null;
  }, [canvasRef, setValue]);

  const stopDrawing = React.useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawing.current) {
        return;
      }

      drawing.current = false;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      commitStroke();

      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
    },
    [commitStroke]
  );

  return (
    <canvas
      ref={canvasRef}
      data-slot="signature-pad-canvas"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      className={cn(
        "h-40 w-full touch-none select-none",
        "cursor-crosshair",
        "focus-visible:outline-none",
        disabled && "cursor-not-allowed",
        readOnly && "cursor-default",
        className
      )}
      style={{
        touchAction: "none",
        ...style,
      }}
      onPointerDown={(event) => {
        if (disabled || readOnly) {
          return;
        }

        event.currentTarget.setPointerCapture(event.pointerId);

        drawing.current = true;

        // ensure canvas is in sync with committed value before drawing
        redraw();

        const point = getCanvasPoint(event.nativeEvent, event.currentTarget);

        currentStroke.current = [point];
        lastPoint.current = point;
      }}
      onPointerMove={(event) => {
        if (!drawing.current || disabled || readOnly) {
          return;
        }

        const point = getCanvasPoint(event.nativeEvent, event.currentTarget);

        if (lastPoint.current && distance(point, lastPoint.current) < 0.005) {
          return;
        }

        const prev = lastPoint.current;
        currentStroke.current.push(point);
        lastPoint.current = point;

        // real-time draw
        if (prev) {
          drawSegment(event.currentTarget, prev, point);
        }
      }}
      onPointerUp={stopDrawing}
      onPointerCancel={stopDrawing}
      {...props}
    />
  );
}
