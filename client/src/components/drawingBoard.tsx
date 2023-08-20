import { useRef, useLayoutEffect, useState } from "react";
import { useDraw } from "~/hooks/useDraw";
import type { Image } from "~/assets/types";

interface Props {
  image: {
    userId: string;
    id: number;
    prompt: string;
    image: Image | null;
  };
}

export default function DrawingBoard({ image }: Props) {
  const { startDrawing, canvasRef } = useDraw();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

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
