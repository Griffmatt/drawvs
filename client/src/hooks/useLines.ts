import { type Dispatch, type SetStateAction, useState, useEffect } from "react";

type lines = {
  x: number;
  y: number;
  color: string;
  width: number;
}[][];

export const useLines = (
  currentLine: number,
  setCurrentLine: Dispatch<SetStateAction<number>>,
  width: number,
  height: number,
  ctx?: CanvasRenderingContext2D | null
) => {
  const [lines, setLines] = useState<lines>([]);

  const handleLines = (
    updatedLines: {
      x: number;
      y: number;
      color: string;
      width: number;
    }[][]
  ) => {
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

  useEffect(() => {
    const reDraw = () => {
      if (ctx) {
        ctx.clearRect(0, 0, width, height);

        linesSlice.forEach((line) => {
          let previous: { x: number | null; y: number | null } = {
            x: null,
            y: null,
          };
          line.forEach((dot) => {
            ctx.beginPath();
            //first point creates dot so when you click and unclick without moving mouse dot is still drawn
            if (previous.x && previous.y) {
              ctx.lineCap = "round";
              ctx.lineJoin = "round";
              ctx.strokeStyle = dot.color;
              ctx.lineWidth = dot.width;
              ctx.moveTo(previous.x, previous.y);
              ctx.lineTo(dot.x, dot.y);
              ctx.stroke();
            } else {
              ctx.fillStyle = dot.color;
              ctx.arc(dot.x, dot.y, dot.width / 2, 0, 2 * Math.PI);
              ctx.fill();
            }
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
  }, [ctx, currentLine, height, linesSlice, width]);

  const clearLines = () => {
    setLines([]);
    setCurrentLine(0);
    ctx?.clearRect(0, 0, width, height);
  };

  return { linesSlice, handleLines, clearLines };
};
