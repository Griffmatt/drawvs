import { useEffect, useRef, useState } from "react";
import { useToolsContext } from "~/context/toolsContext";
import { useLines } from "./useLines";

export const useDraw = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevCoords, setPrevCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);
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

  const startDrawing = () => {
    setIsDrawing(true);
    handleLines([...lines, []]);
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
      setPrevCoords(null);
    };

    const draw = (event: MouseEvent) => {
      if (isDrawing && ctx) {
        if (tool === "Draw" || tool === "Erase") {
          const selectedColor = tool === "Erase" ? "#FFFFFF" : color.code;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.strokeStyle = selectedColor;
          ctx.lineWidth = width;
          ctx.beginPath();
          const position = getPosition(event.clientX, event.clientY);
          if (!position) return;
          ctx.moveTo(prevCoords?.x ?? position.x, prevCoords?.y ?? position.y);
          ctx.lineTo(position.x, position.y);
          ctx.stroke();
          setPrevCoords(position);
          if (tool === "Erase" && lines.length === 1) {
            ctx.clearRect(
              0,
              0,
              canvasRef.current?.width ?? 0,
              canvasRef.current?.height ?? 0
            );
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
  }, [
    color.code,
    ctx,
    handleLines,
    isDrawing,
    lines,
    prevCoords?.x,
    prevCoords?.y,
    tool,
    width,
  ]);

  return { startDrawing, canvasRef, lines };
};
