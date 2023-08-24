import { useEffect, useRef, useState } from "react";
import { useToolsContext } from "~/context/toolsContext";
import { useLines } from "./useLines";

export const useDraw = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = canvasRef.current?.getContext("2d");
  const { color, width, tool, currentLine, setCurrentLine } = useToolsContext();
  const { linesSlice: lines, handleLines } = useLines(
    currentLine,
    setCurrentLine,
    canvasRef.current?.width ?? 0,
    canvasRef.current?.height ?? 0,
    ctx
  );

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    if (tool === "Draw" || tool === "Erase") {
      const selectedColor = tool === "Erase" ? "#FFFFFF" : color.code;
      const position = getPosition(event.clientX, event.clientY);
      if (!position) return;
      if (tool === "Erase" && lines.length === 1) {
        handleLines([]);
        return;
      }
      handleLines([
        ...lines,
        [
          {
            ...position,
            color: selectedColor,
            width,
          },
        ],
      ]);
    }
  };

  const getPosition = (clientX: number, clientY: number) => {
    if (canvasRef.current) {
      const boundingRect = canvasRef.current.getBoundingClientRect();
      return {
        x: clientX - boundingRect.left,
        y: clientY - boundingRect.top,
      };
    }

    return null;
  };

  useEffect(() => {
    const stopDrawing = () => {
      setIsDrawing(false);
    };

    const draw = (event: MouseEvent) => {
      if (isDrawing) {
        if (tool === "Draw" || tool === "Erase") {
          const selectedColor = tool === "Erase" ? "#FFFFFF" : color.code;
          const position = getPosition(event.clientX, event.clientY);
          if (!position) return;
          if (tool === "Erase" && lines.length === 1) {
            handleLines([]);
            return;
          }
          lines[lines.length - 1]?.push({
            ...position,
            color: selectedColor,
            width,
          });
          handleLines([...lines]);
        }
      }
    };

    document.addEventListener("pointermove", draw);
    document.addEventListener("pointerup", stopDrawing);

    return () => {
      document.removeEventListener("pointerup", stopDrawing);
      document.removeEventListener("pointermove", draw);
    };
  }, [color.code, ctx, handleLines, isDrawing, lines, tool, width]);

  return { startDrawing, canvasRef, lines };
};
