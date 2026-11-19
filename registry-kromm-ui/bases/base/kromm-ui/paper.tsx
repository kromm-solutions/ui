import * as React from "react";
import { cn } from "@/lib/utils";

export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number;
  height?: number;
  foldSize?: number;
  children?: React.ReactNode;
}

export function Paper({ width = 220, height = 280, foldSize = 32, className, children, style, ...props }: PaperProps) {
  const fold = Math.max(8, Math.min(foldSize, width / 3, height / 3));
  return (
    <div className={cn("relative shrink-0", className)} style={{ width, height, ...style }} {...props}>
      <svg aria-hidden="true" viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 h-full w-full" fill="none">
        <path d={`M 1 1 H ${width - fold} L ${width - 1} ${fold} V ${height - 1} H 1 Z`} fill="white" stroke="#d1d5db" strokeWidth="1.5" strokeLinejoin="round" />
        <path d={`M ${width - fold} 1 V ${fold} H ${width - 1}`} fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <div className="relative h-full overflow-hidden" style={{ padding: 20, paddingTop: fold + 12 }}>{children}</div>
    </div>
  );
}
export default Paper;
