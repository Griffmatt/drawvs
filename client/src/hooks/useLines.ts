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
  }, [ctx, currentLine, height, linesSlice, width]);

  return { linesSlice, handleLines };
};
