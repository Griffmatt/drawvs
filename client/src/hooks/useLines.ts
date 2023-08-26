import { type Dispatch, type SetStateAction, useState, useEffect } from "react";
import type { Lines } from "~/assets/types/types";

export const useLines = (
  currentLine: number,
  setCurrentLine: Dispatch<SetStateAction<number>>,
  width: number,
  height: number,
  ctx?: CanvasRenderingContext2D | null
) => {
  const [lines, setLines] = useState<Lines>([]);

  const handleLines = (updatedLines: Lines) => {
    setLines([...updatedLines]);
    setCurrentLine(0);
  };

  const linesSlice = lines.slice(
    0,
    lines.length - Math.min(currentLine, lines.length)
  );

  useEffect(() => {
    if (currentLine > lines.length) {
      setCurrentLine(lines.length);
    }
  }, [currentLine, lines.length, setCurrentLine]);

  //fixed opacity issue need to fix click to make cirlce issue still and also add transparent image to background canvas for animation
  useEffect(() => {
    const reDraw = () => {
      if (ctx) {
        ctx.clearRect(0, 0, width, height);

        linesSlice.forEach((line) => {
          const firstDot = line[0];

          if (firstDot) {
            ctx.beginPath();
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.globalAlpha = firstDot.opacity / 100;
            ctx.strokeStyle = firstDot.color;
            ctx.lineWidth = firstDot.width;
            if (line.length === 1) {
              ctx.fillStyle = firstDot.color;
              ctx.arc(firstDot.x, firstDot.y, firstDot.width / 2, 0, 2 * Math.PI);
              ctx.fill();
            } else {
              ctx.moveTo(firstDot.x, firstDot.y);
              line.forEach((dot) => {
                ctx.lineTo(dot.x, dot.y);
              });
              ctx.stroke();
            }
          }
        });
      }
    };
    reDraw();
  }, [ctx, currentLine, height, linesSlice, width]);

  const clearLines = () => {
    setLines([]);
    setCurrentLine(0);
    ctx?.clearRect(0, 0, width, height);
  };

  return { linesSlice, handleLines, clearLines };
};
