import { useRef, useLayoutEffect, useState, useEffect } from "react";
import { useDraw } from "~/hooks/useDraw";
import type { Image } from "~/assets/types";
import { useGameContext } from "~/context/gameContext";
import { socket } from "~/assets/socket";

interface Props {
  image: Image;
  userId: string;
}

export default function DrawingBoard({ image, userId }: Props) {
  const { startDrawing, canvasRef, lines } = useDraw();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  const { dispatchGame } = useGameContext();

  useLayoutEffect(() => {
    const container = containerRef.current;

    const updateSize = () => {
      setDimensions({
        height: container?.offsetHeight ?? 0,
        width: container?.offsetWidth ?? 0,
      });
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const roundDone = () => {
      const imageData = { ...image, userId: userId, image: lines }
      dispatchGame({
        type: "image",
        data: imageData ,
      });
      socket.emit("send-image", imageData);
    };
    socket.on("round-done", roundDone);
    return () => {
      socket.off("round-done", roundDone);
    };
  }, [dispatchGame, image, lines, userId]);

  return (
    <div className="h-[80%] w-full rounded-b-2xl" ref={containerRef}>
      <canvas
        className="absolute z-20"
        height={dimensions.height}
        width={dimensions.width}
        onPointerDown={startDrawing}
        ref={canvasRef}
      />
      <canvas
        className="absolute z-10 bg-white"
        height={dimensions.height}
        width={dimensions.width}
      />
    </div>
  );
}
