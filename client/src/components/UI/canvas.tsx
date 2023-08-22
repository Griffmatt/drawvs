import { useState, useRef, useLayoutEffect } from "react";
import type { Lines } from "~/assets/types";
import { useRedraw } from "~/hooks/useRedraw";

interface Props {
  image: Lines | null;
}

export const Canvas = ({ image }: Props) => {
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { canvasRef } = useRedraw(image, dimensions.width, dimensions.height);

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
    <>
      <div className="h-full w-full rounded-b-2xl" ref={containerRef}>
        <canvas
          className="absolute z-20 bg-white"
          height={dimensions.height}
          width={dimensions.width}
          ref={canvasRef}
        />
      </div>
    </>
  );
};
