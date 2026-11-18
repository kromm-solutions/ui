import { cn } from "cn";
import * as React from "react";

export type PaperProps = React.ComponentProps<"div"> & {
  width?: number | string;
  height?: number | string;
  foldSize?: number;
  radius?: number;
  backgroundColor?: string;
  foldColor?: string;
  borderColor?: string;
};

function roundedPath(points: [number, number][], radius: number) {
  if (radius === 0) {
    return `M${points.map(([x, y]) => `${x} ${y}`).join("L")}Z`;
  }

  const segments = points.map((point, index) => {
    const previous = points[(index - 1 + points.length) % points.length];
    const next = points[(index + 1) % points.length];
    const before = Math.hypot(previous[0] - point[0], previous[1] - point[1]);
    const after = Math.hypot(next[0] - point[0], next[1] - point[1]);
    const offset = Math.min(radius, before / 2, after / 2);
    const start: [number, number] = [
      point[0] + ((previous[0] - point[0]) / before) * offset,
      point[1] + ((previous[1] - point[1]) / before) * offset,
    ];
    const end: [number, number] = [
      point[0] + ((next[0] - point[0]) / after) * offset,
      point[1] + ((next[1] - point[1]) / after) * offset,
    ];
    return { point, start, end };
  });

  return (
    `M${segments[0].end.join(" ")}` +
    segments
      .map(({ point, start, end }, index) => {
        const next = segments[(index + 1) % segments.length];
        return `L${next.start.join(" ")}Q${next.point.join(" ")} ${next.end.join(" ")}`;
      })
      .join("") +
    "Z"
  );
}

export function Paper({
  width = 220,
  height = 260,
  foldSize = 44,
  radius = 0,
  backgroundColor = "#f8f8f8",
  foldColor = "#e8e8e8",
  borderColor = "#e4e4e4",
  className,
  children,
  style,
  ...props
}: PaperProps) {
  const viewWidth = typeof width === "number" && width > 0 ? width : 220;
  const viewHeight = typeof height === "number" && height > 0 ? height : 260;
  const fold = Math.max(0, Math.min(foldSize, viewWidth, viewHeight));
  const rounding = Math.max(0, Math.min(radius, viewWidth / 2, viewHeight / 2));

  const outline = roundedPath(
    [
      [0.5, 0.5],
      [viewWidth - fold - 0.5, 0.5],
      [viewWidth - 0.5, fold + 0.5],
      [viewWidth - 0.5, viewHeight - 0.5],
      [0.5, viewHeight - 0.5],
    ],
    rounding
  );

  const corner = fold > 0
    ? roundedPath(
        [
          [viewWidth - fold - 0.5, 0.5],
          [viewWidth - fold - 0.5, fold + 0.5],
          [viewWidth - 0.5, fold + 0.5],
        ],
        rounding
      )
    : null;

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width, height, ...style }}
      {...props}
    >
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 size-full"
        fill="none"
        aria-hidden="true"
      >
        <path d={outline} fill={backgroundColor} stroke={borderColor} />
        {corner && (
          <path d={corner} fill={foldColor} stroke={borderColor} />
        )}
      </svg>
      <div className="relative size-full">{children}</div>
    </div>
  );
}
