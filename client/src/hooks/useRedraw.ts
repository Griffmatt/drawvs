import { useEffect, useRef } from "react";
import type { Lines } from "~/assets/types";

export const useRedraw = (
  lines: Lines | null,
  width: number,
  height: number
) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = canvasRef.current?.getContext("2d");

  useEffect(() => {
    const reDraw = () => {
      if (ctx && lines) {
        ctx.clearRect(0, 0, width, height);

        lines.forEach((line) => {
          let previous: { x: null; y: null } | { x: number; y: number } = {
            x: null,
            y: null,
          };
          line.forEach((dot) => {
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.strokeStyle = dot.color;
            ctx.lineWidth = dot.width;
            ctx.beginPath();
            ctx.moveTo(previous.x ?? dot.x, previous.y ?? dot.y);
            ctx.lineTo(dot.x, dot.y);
            ctx.stroke();
            previous = { x: dot.x, y: dot.y };
          });
          previous = {
            x: null,
            y: null,
          };
        });
      }
    };
    reDraw();
  }, [ctx, height, lines, width]);

  return { canvasRef };
};
