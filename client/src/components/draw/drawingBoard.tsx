import { useRef, useLayoutEffect, useState, useEffect } from "react";
import { useDraw } from "~/hooks/useDraw";
import type { Image } from "~/assets/types/types";
import { useGameContext } from "~/context/gameContext";
import { socket } from "~/assets/socket";
import { loadImage } from "~/helpers/loadImage";

interface Props {
  image: Image;
  userId: string;
  animationImage?: HTMLImageElement | null;
}

export default function DrawingBoard({ image, userId, animationImage }: Props) {
  const { startDrawing, canvasRef, lines, clearLines } = useDraw();
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
      const ctx = canvasRef.current;
      if (!ctx) return;
      const canvasImage = loadImage(ctx.toDataURL());
      const imageData = { ...image, userId: userId, image: canvasImage };
      dispatchGame({
        type: "image",
        data: imageData,
      });
      socket.emit("send-image", { ...imageData, image: ctx.toDataURL() });
      clearLines();
    };
    socket.on("round-done", roundDone);
    return () => {
      socket.off("round-done", roundDone);
    };
  }, [canvasRef, clearLines, dispatchGame, image, lines, userId]);

  return (
    <div className="h-[80%] w-full rounded-b-2xl" ref={containerRef}>
      <canvas
        className="absolute z-20"
        height={dimensions.height}
        width={dimensions.width}
        onPointerDown={startDrawing}
        ref={canvasRef}
      />
      <BackGroundCanvas
        height={dimensions.height}
        width={dimensions.width}
        image={animationImage}
      />
    </div>
  );
}

interface CanvasProps {
  height: number;
  width: number;
  image?: HTMLImageElement | null;
}

const BackGroundCanvas = ({ height, width, image }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useLayoutEffect(() => {
    console.log(image)
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && image) {
      ctx?.clearRect(0, 0, width, height);
      ctx.globalAlpha = 0.5;
      console.log(image)
      if (image.complete) {
        ctx?.drawImage(image, 0, 0, width, height);
        return;
      }
      image.onload = () => {
        ctx?.drawImage(image, 0, 0, width, height);
      };
    }
  }, [height, image, width]);
  return (
    <canvas
      className="absolute z-10 bg-white"
      height={height}
      width={width}
      ref={canvasRef}
    />
  );
};
